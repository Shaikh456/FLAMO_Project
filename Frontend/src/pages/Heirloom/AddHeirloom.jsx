import { useState } from "react";
import { createHeirloom } from "../../services/heirloom.service";
import "./Heirloom.css";

const AddHeirloom = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("Image is required");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("image", file);

      await createHeirloom(formData);

      alert("Heirloom added successfully!");

      setForm({ title: "", description: "" });
      setFile(null);
      setPreview(null);

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="add-heirloom-wrapper">
      <div className="heirloom-form-card">
        <div className="form-header">
          <h2>🏺 Add New Heirloom</h2>
          <p>Preserve your family legacy with meaningful stories.</p>
        </div>

        <form onSubmit={handleSubmit} className="heirloom-form">

          {/* Title */}
          <div className="form-group">
            <label>Heirloom Title</label>
            <div className="input-wrapper">
              <span className="input-icon">🏺</span>
              <input
                type="text"
                name="title"
                placeholder="e.g., Grandfather's Watch"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <div className="input-wrapper">
              <span className="input-icon textarea-icon">📝</span>
              <textarea
                name="description"
                placeholder="Share the story behind this heirloom..."
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Heirloom Photo</label>
            <div className="image-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                className="hidden-input"
                onChange={handleFileChange}
                accept="image/*"
                required={!file}
              />

              <label htmlFor="file-upload" className="upload-box">

                {preview ? (
                  <div className="preview-container">
                    <img
                      src={preview}
                      alt="Preview"
                      className="preview-img"
                    />
                    <div className="preview-overlay">
                      <span>Click to Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-large">📷</div>
                    <span>Click to Upload Image</span>
                    <small>JPG, PNG, WEBP supported</small>
                  </div>
                )}

              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Save Heirloom
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddHeirloom;
