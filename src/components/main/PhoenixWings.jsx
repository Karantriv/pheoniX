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
      const emberCount = isDarkTheme ? 4 : 2;
      
      for (let i = 0; i < emberCount; i++) {
        // Create a new ember
        const ember = document.createElement('div');
        ember.className = 'phoenix-ember';
        
        // Random ember type for variety
        const emberType = Math.floor(Math.random() * 3);
        if (emberType === 1) {
          ember.style.backgroundColor = '#ffcc00';
          ember.style.width = '2px';
          ember.style.height = '2px';
        } else if (emberType === 2) {
          ember.style.backgroundColor = '#ff3300';
          ember.style.width = '4px';
          ember.style.height = '4px';
          ember.style.boxShadow = '0 0 15px #ff3300, 0 0 25px #ff6600';
        }
        
        // Position embers more along the wing shapes
        const side = Math.random() > 0.5;
        let randomX;
        if (side) {
          // Left wing
          randomX = containerRect.width * 0.3 + Math.random() * (containerRect.width * 0.2);
        } else {
          // Right wing
          randomX = containerRect.width * 0.5 + Math.random() * (containerRect.width * 0.2);
        }
        
        const randomY = containerRect.height * 0.4 + Math.random() * (containerRect.height * 0.3);
        
        ember.style.left = `${randomX}px`;
        ember.style.top = `${randomY}px`;
        
        // Random animation duration for natural effect
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 0.5;
        ember.style.animation = `ember-float ${duration}s ${delay}s ease-out forwards`;
        
        container.appendChild(ember);
        
        // Remove ember after animation completes
        setTimeout(() => {
          if (container.contains(ember)) {
            container.removeChild(ember);
          }
        }, (duration + delay) * 1000);
      }
    };
    
    // Create embers at different intervals based on theme
    const emberInterval = setInterval(createEmbers, isDarkTheme ? 150 : 200);
    
    // Additional flame effect with occasional larger embers
    const createLargeEmber = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      const largeEmber = document.createElement('div');
      largeEmber.className = 'phoenix-ember';
      largeEmber.style.width = '6px';
      largeEmber.style.height = '6px';
      largeEmber.style.backgroundColor = '#ff9500';
      largeEmber.style.boxShadow = '0 0 20px #ff6d00, 0 0 30px #ff9500, 0 0 40px #ffcc00';
      largeEmber.style.filter = 'blur(2px)';
      
      // Position toward the center of the wings
      const randomX = containerRect.width * 0.4 + Math.random() * (containerRect.width * 0.2);
      const randomY = containerRect.height * 0.4 + Math.random() * (containerRect.height * 0.2);
      
      largeEmber.style.left = `${randomX}px`;
      largeEmber.style.top = `${randomY}px`;
      
      // Longer animation duration for large embers
      const duration = 5 + Math.random() * 3;
      largeEmber.style.animation = `ember-float ${duration}s ease-out forwards`;
      
      container.appendChild(largeEmber);
      
      // Remove large ember after animation completes
      setTimeout(() => {
        if (container.contains(largeEmber)) {
          container.removeChild(largeEmber);
        }
      }, duration * 1000);
    };
    
    const largeEmberInterval = setInterval(createLargeEmber, isDarkTheme ? 1500 : 2000);
    
    // Clean up
    return () => {
      clearInterval(emberInterval);
      clearInterval(largeEmberInterval);
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