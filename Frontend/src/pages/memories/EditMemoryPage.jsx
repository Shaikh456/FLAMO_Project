import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMemories,
  updateMemory,
  deleteMemoryImage
} from "../../services/memory.service";
import "./EditMemory.css";

const EditMemoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const res = await getMemories();
        const mem = res.data.find((m) => m._id === id);
        setMemory(mem);
      } catch (err) {
        console.error("Error loading memory:", err);
      }
    };
    loadMemory();
  }, [id]);

  const removeImage = async (index) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await deleteMemoryImage(id, index);
      setMemory((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", memory.title);
      formData.append("description", memory.description);

      if (newImages && newImages.length > 0) {
        newImages.forEach((img) => {
          formData.append("images", img);
        });
      }

      await updateMemory(id, formData);
      navigate("/memories");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!memory) return <div className="loading-state">Loading Memory...</div>;

  return (
    <div className="edit-memory-wrapper">
      <div className="edit-memory-card">
        
        {/* Header Section */}
        <div className="form-header">
          <div className="header-text">
            <h2>Edit Memory</h2>
            <p className="subtitle">Update details or manage photos</p>
          </div>
          <button onClick={handleCancel} className="btn-close-icon" title="Cancel">
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdate} className="memory-form">
          
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Give your memory a title..."
              value={memory.title}
              onChange={(e) => setMemory({ ...memory, title: e.target.value })}
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="What happened on this day?"
              value={memory.description}
              onChange={(e) => setMemory({ ...memory, description: e.target.value })}
              rows={5}
            />
          </div>

          {/* Existing Images Management */}
          {memory.images && memory.images.length > 0 && (
            <div className="form-group">
              <label>Current Images</label>
              <div className="edit-preview-grid">
                {memory.images.map((img, index) => (
                  <div key={index} className="edit-image-wrapper">
                    <img src={img.imageUrl} alt={`Memory ${index}`} />
                    <button 
                      type="button" 
                      className="btn-remove-image"
                      onClick={() => removeImage(index)}
                      title="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload (Styled) */}
          <div className="form-group">
            <label>Add New Images</label>
            <div className="custom-file-upload">
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages(Array.from(e.target.files))}
              />
              <label htmlFor="file-upload" className="upload-label">
                <span className="upload-icon">☁️</span>
                <span>
                  {newImages.length > 0 
                    ? `${newImages.length} file(s) selected` 
                    : "Click to upload or drag photos here"}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditMemoryPage;