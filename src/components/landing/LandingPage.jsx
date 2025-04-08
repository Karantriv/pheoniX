import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoenixWings from '../main/PhoenixWings';
import './LandingPage.css';
import phoenixLogo from '../../assets/gemini_icon.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const [logoTouched, setLogoTouched] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // For header animation
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // For section visibility
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;
      
      sectionsRef.current.forEach((section, index) => {
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  // Register section refs
  const addToSectionsRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const handleLogoTouch = () => {
    if (logoTouched) return; // Prevent double-clicking during animation
    
    setLogoTouched(true);
    
    // Reset the state after animation completes
    setTimeout(() => {
      setLogoTouched(false);
    }, 800); // Match the transition duration in CSS
  };

  return (
    <div className="landing-page">
      <PhoenixWings />
      
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo-container">
          <img src={phoenixLogo} alt="Phoenix Logo" className="header-logo" />
          <h1>Phoenix</h1>
        </div>
        <div className="nav-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>Login</button>
          <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

      <section ref={addToSectionsRef} className={`hero-section ${activeSection === 0 ? 'active' : ''}`}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Your AI Ally</h1>
            <p className="hero-subtitle">
              Discover the power of Phoenix, your personal AI assistant designed to help you achieve more.
            </p>
            <button className="get-started-button" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="hero-image">
            <div className="phoenix-emblem">
              <img 
                src={phoenixLogo} 
                alt="Phoenix" 
                className={`phoenix-logo ${logoTouched ? 'touched' : ''}`} 
                onClick={handleLogoTouch}
                onTouchStart={handleLogoTouch}
              />
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      <section ref={addToSectionsRef} className={`features-section ${activeSection === 1 ? 'active' : ''}`}>
        <h2>Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Natural Conversations</h3>
            <p>Engage in human-like dialogue with advanced context understanding.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <h3>Image Recognition</h3>
            <p>Upload images and get intelligent insights and descriptions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Content Creation</h3>
            <p>Generate creative content, from stories to code snippets.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Knowledge Base</h3>
            <p>Access a vast knowledge base for accurate information.</p>
          </div>
        </div>
      </section>

      <section ref={addToSectionsRef} className={`cta-section ${activeSection === 2 ? 'active' : ''}`}>
        <div className="cta-content">
          <h2>Ready to Experience Phoenix?</h2>
          <p>Join thousands of users who are already leveraging the power of AI in their daily lives.</p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => navigate('/signup')}>Sign Up</button>
            <button className="cta-button secondary" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={phoenixLogo} alt="Phoenix Logo" className="footer-logo-img" />
            <span>Phoenix</span>
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Phoenix AI. Created by <a href="https://www.linkedin.com/in/karan-trivedi1105/" target="_blank" rel="noopener noreferrer">Karan Trivedi</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 