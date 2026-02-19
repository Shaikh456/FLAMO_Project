import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMemory } from "../../services/memory.service";
import "./Memories.css";

const AddMemoryPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createMemory(formData);
      navigate("/memories");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-memory-wrapper">
      <div className="add-memory-card">
        <h2 className="form-title">✨ Create New Memory</h2>
        <p className="form-subtitle">
          Capture your special moments and share with family
        </p>

        <form onSubmit={handleSubmit} className="memory-form">

          <div className="form-group">
            <label>Memory Title</label>
            <input
              type="text"
              placeholder="Enter memory title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Write something about this memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Drag & Drop */}
          <div
            className={`drop-zone ${dragActive ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="drop-content">
              <span className="upload-icon">📷</span>
              <p>Drag & Drop images here</p>
              <span className="or-text">or</span>
              <label className="upload-btn">
                Browse Files
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="preview-grid">
              {images.map((img, index) => (
                <div key={index} className="preview-card">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                  />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Memory"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddMemoryPage;
