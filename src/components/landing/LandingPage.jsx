import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import phoenixLogo from '../../assets/gemini_icon.png';
import ThreeBackground from './ThreeBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <ThreeBackground />
      
      <div className="landing-header-wrapper">
        <header className="landing-header">
          <div className="header-logo">
            <img src={phoenixLogo} alt="Phoenix Logo" className="logo-image-small" />
            <h1>Phoenix</h1>
          </div>
          <div className="header-buttons">
            <button className="header-login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="header-signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </header>
      </div>
      
      <main className="landing-main">
        <div className="hero-section">
          <div className="hero-content">
            <div className="glowing-badge">AI-Powered</div>
            <h2 className="hero-title">
              Experience the power of<br />
              AI conversation
            </h2>
            <p className="hero-description">
              Phoenix is your intelligent AI assistant that helps you find answers,<br />
              generate ideas, and solve problems through natural conversation.
            </p>
            <div className="cta-container">
              <button className="cta-button" onClick={() => navigate('/signup')}>
                Get Started Free
              </button>
              <p className="cta-subtitle">No credit card required</p>
            </div>
          </div>
        </div>
        
        <div className="features-section">
          <h3 className="section-title">Why choose Phoenix?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Lightning Fast</h4>
              <p>Get instant responses to your questions with our optimized AI engine</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>Secure & Private</h4>
              <p>Your conversations are encrypted and your data stays private</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h4>Smart Learning</h4>
              <p>Phoenix learns from interactions to provide better responses over time</p>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-number">10M+</span>
            <span className="stat-label">Questions Answered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5,000+</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <div className="footer-content-wrapper">
          <div className="footer-content">
            <div className="footer-company-info">
              <div className="footer-logo">
                <img src={phoenixLogo} alt="Phoenix Logo" className="logo-image-small" />
                <span>Phoenix</span>
              </div>
              <p className="footer-tagline">Your intelligent AI conversation partner</p>
              <p className="footer-copyright">© {new Date().getFullYear()} Phoenix AI</p>
            </div>
            
            <div className="footer-links-container">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#integrations">Integrations</a></li>
                  <li><a href="#changelog">Changelog</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#documentation">Documentation</a></li>
                  <li><a href="#tutorials">Tutorials</a></li>
                  <li><a href="#guides">Guides</a></li>
                  <li><a href="#api">API Status</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="https://www.linkedin.com/in/karan-trivedi1105/" target="_blank" rel="noopener noreferrer">About Us</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#cookies">Cookie Settings</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>Made with love by Karan Trivedi ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 