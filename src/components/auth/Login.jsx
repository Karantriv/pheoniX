import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { Context } from "../../context/Context";
import ThreeBackground from "../landing/ThreeBackground";
import "./Auth.css";
import phoenixLogo from "../../assets/gemini_icon.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGithub, logout, currentUser } = useAuth();
  const { setUserName } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState({});

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredsString = localStorage.getItem("savedCredentials");
    if (savedCredsString) {
      setSavedCredentials(JSON.parse(savedCredsString));
    }
  }, []);

  // Check for saved password when email changes
  useEffect(() => {
    if (email && savedCredentials[email]) {
      setPassword(savedCredentials[email].password);
      // Also load saved name if available
      if (savedCredentials[email].name) {
        setName(savedCredentials[email].name);
      }
    }
  }, [email, savedCredentials]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      // Save credentials if Remember Me is checked
      if (rememberMe) {
        const updatedCredentials = {
          ...savedCredentials,
          [email]: { password, name }
        };
        localStorage.setItem("savedCredentials", JSON.stringify(updatedCredentials));
        setSavedCredentials(updatedCredentials);
      }
      
      await login(email, password);
      // Set the user name from input, saved credentials, or email
      const displayName = name || savedCredentials[email]?.name || email.split('@')[0] || "User";
      setUserName(displayName);
      // Also save the name to localStorage for persistence
      localStorage.setItem("userName", displayName);
      
      navigate("/home");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during login"
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
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
          
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="remember-forgot">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> 
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
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
              Sign in with Google
            </button>
            <button 
              className="github-button" 
              onClick={handleGithubSignIn}
              disabled={loading}
            >
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/github.png" alt="GitHub" />
              Sign in with GitHub
            </button>
          </div>
          
          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 