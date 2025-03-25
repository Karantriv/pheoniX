import React, { useState } from "react";
import { useAuth } from '../firebase/AuthContext';
import "./login-signup/LoginSingup.css";
import gemini_icon from "../assets/gemini_icon.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithGithub, signup } = useAuth();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({}); // Clear errors on toggle
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
      
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      await loginWithGoogle();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      await loginWithGithub();
    } catch (error) {
      setErrors({ submit: error.message });
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
                    <input type="checkbox" /> Remember Me
                  </label>
                  <a href="/forgot-password">Forgot Password?</a>
                </div>

                <div className="butt">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>Create an account</h2>
              <p>Join us to get started.</p>
              <form onSubmit={handleSubmit} className="signup-form">
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
                      <option value="+1">+1 (US)</option>
                      <option value="+91">+91 (IN)</option>
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

                <div className="butt">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Sign Up"}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="toggle-link" onClick={handleToggle}>
              {isLogin ? "Sign up" : "Login"}
            </span>
          </div>

          <div className="social-login">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="google-button"
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
              Sign in with Google
            </button>
            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="github-button"
            >
              <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 