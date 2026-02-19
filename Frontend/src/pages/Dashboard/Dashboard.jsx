import { useEffect, useState, useContext } from "react";
import { getMemories } from "../../services/memory.service";
import { getHeirlooms } from "../../services/heirloom.service";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [memories, setMemories] = useState([]);
  const [heirlooms, setHeirlooms] = useState([]);
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalHeirlooms: 0,
    verified: 0,
    transfers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    const memoryRes = await getMemories();
    const heirloomRes = await getHeirlooms();

    // FIXED HERE
    const memoriesData = memoryRes?.data || [];
    const heirloomsData = heirloomRes?.data || [];

    setMemories(memoriesData.slice(0, 4));
    setHeirlooms(heirloomsData.slice(0, 4));

    setStats({
      totalMemories: memoryRes?.total || memoriesData.length,
      totalHeirlooms: heirloomRes?.total || heirloomsData.length,
      verified: heirloomsData.filter((h) => h.isVerified).length,
      transfers: heirloomsData.filter(
        (h) => h.ownershipHistory?.length > 1
      ).length,
    });
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="dashboard-container">

      {/* HERO SECTION */}
      <div className="dashboard-hero">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Your family legacy secured on blockchain.</p>
        </div>
        <div className="hero-stats-mini">
          <div>
            <span>{stats.totalHeirlooms}</span>
            <small>Heirlooms</small>
          </div>
          <div>
            <span>{stats.totalMemories}</span>
            <small>Memories</small>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon">📸</div>
          <div>
            <h3>Memories</h3>
            <p>{stats.totalMemories}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">🏺</div>
          <div>
            <h3>Heirlooms</h3>
            <p>{stats.totalHeirlooms}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">✔</div>
          <div>
            <h3>Verified</h3>
            <p>{stats.verified}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">🔄</div>
          <div>
            <h3>Transfers</h3>
            <p>{stats.transfers}</p>
          </div>
        </div>
      </div>

      {/* RECENT MEMORIES */}
      <div className="section">
        <h2>Recent Memories</h2>
        <div className="preview-grid">
          {memories.map((memory) => (
  <div key={memory._id} className="preview-card">
    {memory.images?.length > 0 && (
      <img
        src={memory.images[0]?.imageUrl}
        alt={memory.title}
      />
    )}
    <div className="preview-overlay">
      <h4>{memory.title}</h4>
    </div>
  </div>
))}

        </div>
      </div>

      {/* RECENT HEIRLOOMS */}
      <div className="section">
        <h2>Recent Heirlooms</h2>
        <div className="preview-grid">
          {heirlooms.map((item) => (
            <div key={item._id} className="preview-card">
              <img src={item.imageUrl} alt={item.title} />
              <div className="preview-overlay">
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
