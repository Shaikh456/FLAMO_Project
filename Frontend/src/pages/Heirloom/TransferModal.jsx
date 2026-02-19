import { useState } from "react";
import {
  transferHeirloom,
  scheduleHeirloomTransfer
} from "../../services/heirloom.service";
import "./TransferModal.css";

const TransferModal = ({ heirloomId, onClose, refresh }) => {
  const [mode, setMode] = useState(null);
  const [nextOwnerId, setNextOwnerId] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualTransfer = async () => {
    if (!nextOwnerId) return alert("Next Owner ID is required");

    try {
      setLoading(true);
      await transferHeirloom(heirloomId, nextOwnerId);
      alert("Heirloom transferred successfully!");
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message);
    }
    setLoading(false);
  };

  const handleScheduleTransfer = async () => {
    if (!nextOwnerId || !transferDate)
      return alert("All fields are required");

    try {
      setLoading(true);
      await scheduleHeirloomTransfer(
        heirloomId,
        nextOwnerId,
        transferDate
      );
      alert("Transfer scheduled successfully!");
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div className="transfer-overlay">

      <div className="transfer-modal">

        {/* Close Icon */}
        <button className="modal-close-icon" onClick={onClose}>
          ✕
        </button>

        <h2>Transfer Heirloom</h2>
        <p className="modal-subtitle">
          Choose how you want to transfer ownership
        </p>

        {!mode && (
          <div className="transfer-options">
            <button
              className="option-btn"
              onClick={() => setMode("manual")}
            >
              ⚡ Manual Transfer
            </button>

            <button
              className="option-btn secondary"
              onClick={() => setMode("schedule")}
            >
              ⏳ Schedule Transfer
            </button>
          </div>
        )}

        {mode && (
          <div className="transfer-form">

            <div className="form-group">
              <label>Next Owner ID</label>
              <input
                type="text"
                placeholder="Enter Next Owner ID"
                value={nextOwnerId}
                onChange={(e) => setNextOwnerId(e.target.value)}
              />
            </div>

            {mode === "schedule" && (
              <div className="form-group">
                <label>Transfer Date</label>
                <input
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>
            )}

            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={
                  mode === "manual"
                    ? handleManualTransfer
                    : handleScheduleTransfer
                }
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : mode === "manual"
                  ? "Confirm Transfer"
                  : "Schedule Transfer"}
              </button>

              <button
                className="back-btn"
                onClick={() => setMode(null)}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Bottom Cancel */}
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  );
};

export default TransferModal;
