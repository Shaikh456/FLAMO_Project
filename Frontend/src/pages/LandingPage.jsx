import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">◆ FLAMO</div>
        <div className="nav-links">
          <Link to="/login" className="btn-login">
            Login
          </Link>
          <Link to="/register" className="btn-cta-nav">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">Web3 Legacy Management</div>
        <h1 className="hero-title">
          Secure Your Family's <br />
          <span>Digital Heritage.</span>
        </h1>
        <p className="hero-subtitle">
          The first decentralized platform designed to preserve heirlooms, memories,
          and assets for generations to come. Immutable. Private. Forever.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Start Your Journey
          </Link>
          <Link to="/login" className="btn-secondary">
            Access Vault
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Bank-Grade Security</h3>
            <p>
              Your data is encrypted with AES-256 and stored on decentralized
              networks, ensuring no single point of failure.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⛓️</div>
            <h3>Blockchain Proof</h3>
            <p>
              Every heirloom and memory is timestamped on the Polygon blockchain,
              providing immutable proof of ownership.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Family First</h3>
            <p>
              Seamlessly invite family members, assign roles, and ensure your
              legacy is passed down exactly how you intend.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} FLAMO Legacy Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;