import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHeirlooms,
  deleteHeirloom
} from "../../services/heirloom.service";
import { AuthContext } from "../../context/AuthContext";
import TransferModal from "./TransferModal";
import "./Heirloom.css";

const HeirloomList = () => {
  const [heirlooms, setHeirlooms] = useState([]);
  const [selectedHeirloom, setSelectedHeirloom] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeirlooms();
  }, []);

  const fetchHeirlooms = async () => {
    const data = await getHeirlooms();
    setHeirlooms(data.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this heirloom?")) return;
    await deleteHeirloom(id);
    fetchHeirlooms();
  };

  return (
    <div className="heirloom-container">
      <h1 className="page-title">Your Heirlooms</h1>

      <div className="heirloom-grid">
        {heirlooms.map((item) => (
          <div key={item._id} className="heirloom-card">

            <div className="image-wrapper">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="heirloom-image"
              />
              {item.isVerified && (
                <span className="verified-badge">
                  ✔ Verified
                </span>
              )}
            </div>

            <div className="heirloom-content">
              <h3>{item.title}</h3>
              <p className="description">{item.description}</p>

              <div className="heirloom-meta">
                <span>Owner: {item.currentOwner?.name}</span>
              </div>

              {user?._id === item.currentOwner?._id && (
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/heirlooms/edit/${item._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="transfer-btn"
                    onClick={() =>
                      setSelectedHeirloom(item._id)
                    }
                  >
                    Transfer
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedHeirloom && (
        <TransferModal
          heirloomId={selectedHeirloom}
          onClose={() => setSelectedHeirloom(null)}
          refresh={fetchHeirlooms}
        />
      )}
    </div>
  );
};

export default HeirloomList;
