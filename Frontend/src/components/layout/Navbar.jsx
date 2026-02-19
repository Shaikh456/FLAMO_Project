import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import { ThemeContext } from "../../context/ThemeContext";


const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Toggle Button: Swaps between Hamburger (☰) and Close (✕) */}
        <button className="menu-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Logo: Only visible when Hamburger is visible */}
        <h2 className="mobile-logo">FLAMO</h2>
      </div>

      <div className="nav-right">
        {user && (
          <>
          <button className="theme-toggle" onClick={toggleTheme}>
  {theme === "light" ? "🌙" : "☀️"}
</button>

            <span className="username">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;