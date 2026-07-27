import React from 'react';

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-background">
        <img 
          src="/hero-bg.jpg"
          alt="Chef Margot Sushi"
          className="hero-image"
        />
        {/* Capa oscura translúcida para que el texto resalte */}
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-brand">
          <img src="/logo.png" alt="Chef Margot Logo" className="hero-brand-logo" />
          <h1 className="hero-brand-name">Chef Margot</h1>
        </div>
        <h2 className="hero-title">¡Desliza hacia abajo<br/>y pide ya!</h2>
        <div className="hero-arrow">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
