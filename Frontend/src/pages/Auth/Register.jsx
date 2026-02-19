import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import "./Register.css"; // Ensure this has the new CSS provided above

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    dateOfBirth: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Validate Polygon wallet address
  const isValidWallet = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!isValidWallet(form.walletAddress)) {
      return setError("Invalid Polygon wallet address format.");
    }
    
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL: BRANDING */}
      <div className="auth-left">
        <div className="brand-content">
          <div className="logo-area">
            <span>◆</span> FLAMO
          </div>
          <h1>Start your journey into<br />digital legacy.</h1>
          <p>Join thousands of users preserving their history on the blockchain.</p>
          
          <ul className="feature-list">
            <li>Personalized Legacy Insights</li>
            <li>Blockchain Secured Records</li>
            <li>Direct Beneficiary Communication</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL: FORM */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join FLAMO to protect what matters most.</p>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a strong password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Wallet Address (Polygon)</label>
              <input
                type="text"
                name="walletAddress"
                placeholder="0x..."
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleChange}
                required
                style={{ colorScheme: "dark" }} /* Ensures calendar icon is visible on dark theme */
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Create My Account →"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? 
            <span onClick={() => navigate("/login")}>Sign in instead</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;