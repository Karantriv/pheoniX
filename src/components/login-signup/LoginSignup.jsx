import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { Context } from "../../context/Context";
import "./LoginSignup.css";
import gemini_icon from "../../assets/gemini_icon.png";

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();
  const { setUserName } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
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
    if (isLogin && email && savedCredentials[email]) {
      setPassword(savedCredentials[email].password);
      if (savedCredentials[email].name) {
        setName(savedCredentials[email].name);
      }
    }
  }, [email, savedCredentials, isLogin]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

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

    if (!isLogin && !validateName(name)) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin && !validatePhone(phone)) {
      newErrors.phone = "Invalid phone number";
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
      
      if (isLogin) {
        await login(email, password);
        setUserName(name || "User");
      } else {
        await signup(email, password);
        setUserName(name || "User");
      }
      
      navigate("/");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during authentication"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      await loginWithGoogle();
      setUserName(name || "User");
      navigate("/");
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
      await loginWithGithub();
      setUserName(name || "User");
      navigate("/");
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during GitHub sign-in"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div className="login-signup-container">
        <div className="logo-container">
          <img src={gemini_icon} alt="Gemini Logo" className="logo" />
          <p className="tagline">Your AI-powered assistant</p>
        </div>

        <div className={`form-container ${!isLogin ? 'active' : ''}`}>
          {isLogin ? (
            <>
              <h2>Welcome back!</h2>
              <p>Please log in to continue.</p>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="remember-forgot">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    /> Remember&nbsp;Me
                  </label>
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Create an account</h2>
              <p>Join us to get started.</p>
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="input-group">
                  <div className="phone-input">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={errors.phone ? "error" : ""}
                    />
                  </div>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Creating account..." : "Sign up"}
                </button>
              </form>
            </>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error" style={{ textAlign: "center", marginTop: "10px" }}>
            {errors.submit}
          </div>
        )}

        <div className="additional-options">
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
              <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" />
              Sign in with GitHub
            </button>
          </div>

          <div className="toggle-text">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="toggle-link" onClick={handleToggle}>
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="toggle-link" onClick={handleToggle}>
                  Login
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;