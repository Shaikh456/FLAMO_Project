import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";
import "./Settings.css";

const Settings = () => {
  const { user, logout } = useContext(AuthContext);

  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/dashboard");

      setFamily(res.data.data.family);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  if (loading) {
    return <div className="settings-container">Loading...</div>;
  }

  return (
    <div className="settings-container">
      {/* PROFILE HEADER */}
      <div className="profile-header-card">
        <div className="avatar-large">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      {/* ACCOUNT DETAILS */}
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Account Details</h3>


          <div className="info-row">
            <span>Family Name</span>
            <div>{family?.name || "Not Joined"}</div>
          </div>

          <div className="info-row">
            <span>Date of Birth</span>
            <div>
              {user?.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "Not Provided"}
            </div>
          </div>

          <div className="info-row">
            <span>User ID</span>
            <div>
              {user?._id}
              <button onClick={() => copy(user?._id)}>Copy</button>
            </div>
          </div>

           <div className="info-row">
            <span>Family ID</span>
            <div>
              {family?.familyId ? (
                <>
                  {family.familyId}
                  <button onClick={() => copy(family.familyId)}>Copy</button>
                </>
              ) : (
                "Not Joined"
              )}
            </div>
          </div>
        </div>

        {/* WALLET */}
        <div className="settings-card">
          <h3>Wallet</h3>

          <div className="wallet-box">
            <span
              className={`wallet-status ${user?.walletAddress ? "connected" : "not-connected"}`}
            >
              {user?.walletAddress ? "Connected" : "Not Connected"}
            </span>

            {user?.walletAddress && (
              <p className="wallet-address">{user.walletAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="settings-card danger-zone">
        <h3>Danger Zone</h3>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
