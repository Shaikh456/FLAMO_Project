import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateHeirloom, getHeirlooms } from "../../services/heirloom.service";
import "./Heirloom.css";

const EditHeirloom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingle = async () => {
      try {
        const data = await getHeirlooms();
        const item = data.data.find((h) => h._id === id);

        if (item) {
          setForm({
            title: item.title,
            description: item.description
          });
          setPreview(item.imageUrl);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchSingle();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);

      if (file) {
        formData.append("image", file);
      }

      await updateHeirloom(id, formData);

      alert("Heirloom updated successfully!");
      navigate("/heirlooms");
    } catch (err) {
      alert(err.response?.data?.message);
    }

    setLoading(false);
  };

  return (
    <div className="edit-heirloom-wrapper">
      <div className="edit-heirloom-card">

        <div className="edit-header">
          <h2>Edit Heirloom</h2>
          <p>Update details of your legacy asset</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Update Image</label>

            <div className="upload-box-edit">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span>Click to upload new image</span>
            </div>

            {preview && (
              <div className="preview-container">
                <img
                  src={preview}
                  alt="Preview"
                  className="preview-img"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Heirloom"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              Cancel / Go Back
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditHeirloom;
