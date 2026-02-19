import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      login(data.data, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL: CENTERED BRANDING */}
      <div className="auth-left">
        <div className="brand-content">
          <div className="logo-area">
            <span>◆</span> FLAMO
          </div>
          <h1>Secure Legacy Vault</h1>
          <p>Access your family records and streamline your inheritance workflows with our secure infrastructure.</p>
          
          <ul className="feature-list">
            <li>AES-256 Encryption</li>
            <li>Decentralized Storage</li>
            <li>Instant Access Retrieval</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL: FORM */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access your vault.</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Decrypting Vault..." : "Access Dashboard →"}
            </button>
          </form>

          <div className="auth-footer">
            New to FLAMO? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;