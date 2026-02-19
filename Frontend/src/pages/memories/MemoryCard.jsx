import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFreshDownloadUrl, downloadAllMemoryImages } from "../../services/memory.service";


const MemoryCard = ({ memory, currentUser, onDelete }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isOwner =
    memory?.uploadedBy?._id?.toString() ===
    (currentUser?._id || currentUser?.id)?.toString();

  const openModal = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === memory.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? memory.images.length - 1 : prev - 1
    );
  };

  /* 🔥 Download Single Image */
  const downloadImage = async (index) => {
    try {
      const res = await getFreshDownloadUrl(memory._id, index);

      if (res.success) {
        const link = document.createElement("a");
        link.href = res.url;
        link.download = `memory-${memory.title}-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* 🔥 Download All Images */
const downloadAllImages = async () => {
  try {
    const response = await downloadAllMemoryImages(memory._id);

    const blob = new Blob([response.data], {
      type: "application/zip"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${memory.title}.zip`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
  }
};


  return (
    <>
      <div className="memory-card">
        <div
          className="memory-images"
          onClick={() => openModal(0)}
        >
          {memory.images?.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img.imageUrl}
              alt={memory.title}
            />
          ))}
        </div>

        <div className="memory-body">
          <h3>{memory.title}</h3>
          <p>{memory.description}</p>

          <div className="memory-footer">
            <span>By {memory.uploadedBy?.name}</span>

            {isOwner && (
              <div className="memory-actions">
                <button
                  className="btn-download"
                  onClick={downloadAllImages}
                >
                  ⬇ Download All
                </button>

                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/memories/edit/${memory._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => onDelete(memory._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 Lightbox Modal */}
      {isOpen && (
        <div className="lightbox-overlay" onClick={closeModal}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>

            <button className="nav-btn left" onClick={prevImage}>
              ‹
            </button>

            <img
              src={memory.images[currentIndex].imageUrl}
              alt="Preview"
              className="lightbox-image"
            />

            <button className="nav-btn right" onClick={nextImage}>
              ›
            </button>

            {isOwner && (
              <button
                className="download-single-btn"
                onClick={() =>
                  downloadImage(currentIndex)
                }
              >
                ⬇ Download
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryCard;
