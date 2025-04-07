import React, { useEffect, useRef, useContext } from 'react';
import { Context } from '../../context/Context';
import './PhoenixWings.css';

const PhoenixWings = () => {
  const containerRef = useRef(null);
  const { isDarkTheme } = useContext(Context);
  
  useEffect(() => {
    // Function to create and animate ember particles
    const createEmbers = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Create more embers in dark mode
      const emberCount = isDarkTheme ? 2 : 1;
      
      for (let i = 0; i < emberCount; i++) {
        // Create a new ember
        const ember = document.createElement('div');
        ember.className = 'phoenix-ember';
        
        // Random position at the bottom half of the screen
        const randomX = Math.random() * containerRect.width;
        const randomY = containerRect.height / 2 + Math.random() * (containerRect.height / 2);
        
        ember.style.left = `${randomX}px`;
        ember.style.top = `${randomY}px`;
        
        // Random animation duration
        const duration = 3 + Math.random() * 3;
        ember.style.animation = `ember-float ${duration}s ease-out forwards`;
        
        container.appendChild(ember);
        
        // Remove ember after animation completes
        setTimeout(() => {
          if (container.contains(ember)) {
            container.removeChild(ember);
          }
        }, duration * 1000);
      }
    };
    
    // Create embers at different intervals based on theme
    const emberInterval = setInterval(createEmbers, isDarkTheme ? 200 : 300);
    
    // Clean up
    return () => {
      clearInterval(emberInterval);
    };
  }, [isDarkTheme]);
  
  return (
    <div className="phoenix-wings-container" ref={containerRef}>
      <div className="phoenix-wing wing-left"></div>
      <div className="phoenix-wing wing-right"></div>
    </div>
  );
};

export default PhoenixWings; 