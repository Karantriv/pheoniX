import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x141c2c, 1);
    
    // Only append the renderer if the ref exists and doesn't already have a canvas
    if (mountRef.current && !mountRef.current.querySelector('canvas')) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    
    // Create positions for particles
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a spherical formation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 10;
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
      
      // Set random scale factors for each particle
      scaleArray[i/3] = Math.random() * 0.5 + 0.5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4a80f0,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Create Lines
    const lineCount = 20;
    const lines = [];
    
    for (let i = 0; i < lineCount; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      
      // Create curved lines with random paths
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        )
      ]);
      
      const points = curve.getPoints(50);
      lineGeometry.setFromPoints(points);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4a80f0,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.2
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push({
        line,
        rotationSpeed: (Math.random() - 0.5) * 0.002
      });
    }

    // Animation loop
    const animate = () => {
      // Rotate the particle system
      particleSystem.rotation.x += 0.0003;
      particleSystem.rotation.y += 0.0005;
      
      // Animate lines
      lines.forEach(item => {
        item.line.rotation.x += item.rotationSpeed;
        item.line.rotation.y += item.rotationSpeed * 0.8;
      });
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometry and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      lines.forEach(item => {
        item.line.geometry.dispose();
        item.line.material.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} className="three-background" />;
};

export default ThreeBackground; 