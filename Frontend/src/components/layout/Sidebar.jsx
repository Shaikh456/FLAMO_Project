import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeSidebar();
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">FLAMO</h1>
        <div className="sidebar-divider"></div>
      </div>

      <ul className="nav-list">
        <li>
          <NavLink to="/dashboard" className="nav-item" onClick={closeSidebar}>
            <span>📊</span> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/memories" className="nav-item" onClick={closeSidebar}>
            <span>📸</span> Memories
          </NavLink>
        </li>
        <li>
          <NavLink to="/memories/add" className="nav-item" onClick={closeSidebar}>
            <span>✨</span> Add Memory
          </NavLink>
        </li>
        <li>
          <NavLink to="/heirlooms" className="nav-item" onClick={closeSidebar}>
            <span>🏺</span> Heirlooms
          </NavLink>
        </li>
        <li>
          <NavLink to="/heirlooms/add" className="nav-item" onClick={closeSidebar}>
            <span>➕</span> Add Heirloom
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="nav-item" onClick={closeSidebar}>
            <span>⚙️</span> Settings
          </NavLink>
        </li>
      </ul>

      {/* Footer: Visible ONLY on Mobile */}
      <div className="sidebar-footer mobile-only">
        {user && (
          <div className="sidebar-user">
            <div className="avatar-small">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">Member</span>
            </div>
          </div>
        )}
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;