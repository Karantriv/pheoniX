import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import ThreeBackground from "../landing/ThreeBackground";
import "./Auth.css";
import phoenixLogo from "../../assets/gemini_icon.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      
      await resetPassword(email);
      setMessage("Check your email for instructions to reset your password");
    } catch (error) {
      setError("Failed to reset password. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ThreeBackground />
      
      <div className="auth-header-wrapper">
        <header className="auth-header">
          <div className="logo-container" onClick={() => navigate('/')}>
            <img src={phoenixLogo} alt="Phoenix Logo" className="header-logo" />
            <h1>Phoenix</h1>
          </div>
        </header>
      </div>
      
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "error" : ""}
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
          
          {error && (
            <div className="error-message submit-error">
              {error}
            </div>
          )}
          
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
          
          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 