import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { Context } from "../../context/Context";
import ThreeBackground from "../landing/ThreeBackground";
import "./Auth.css";
import phoenixLogo from "../../assets/gemini_icon.png";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loginWithGithub, logout, currentUser } = useAuth();
  const { setUserName } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateName = (name) => {
    return name.length >= 2;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateName(name)) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!validatePhone(phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      await signup(email, password);
      setUserName(name || "User");
      // Save the name to localStorage for persistence
      localStorage.setItem("userName", name || "User");
      
      navigate("/home");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during signup"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      const result = await loginWithGoogle();
      
      // Get the name from the Google profile, or use email if no name
      const displayName = result?.user?.displayName || result?.user?.email?.split('@')[0] || "User";
      setUserName(displayName);
      localStorage.setItem("userName", displayName);
      
      navigate("/home");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during Google sign-in"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      const result = await loginWithGithub();
      
      // Get the name from the GitHub profile, or use username if no name
      const displayName = result?.user?.displayName || result?.user?.reloadUserInfo?.screenName || "User";
      setUserName(displayName);
      localStorage.setItem("userName", displayName);
      
      navigate("/home");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during GitHub sign-in"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle signout
  const handleSignOut = async () => {
    try {
      await logout();
      // Redirect to landing page
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      // Display error if needed
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
          {currentUser && (
            <button className="auth-signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
          )}
        </header>
      </div>
      
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Join Phoenix to start your AI journey</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="phone-input">
                <select
                  id="countryCode"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+1">+1 (US)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter your number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={errors.phone ? "error" : ""}
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login">
            <button 
              className="google-button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
              Sign up with Google
            </button>
            <button 
              className="github-button" 
              onClick={handleGithubSignIn}
              disabled={loading}
            >
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/github.png" alt="GitHub" />
              Sign up with GitHub
            </button>
          </div>
          
          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 