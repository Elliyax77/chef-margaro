import React from 'react';

export default function LocationSelector({ locations, restaurant, onSelect }) {
  return (
    <div className="location-selector-container">
      <div className="location-selector-card">
        <img src={restaurant.logoUrl} alt={restaurant.name} className="location-logo" />
        <h1 className="location-title">¡Bienvenido a {restaurant.name}!</h1>
        <p className="location-subtitle">Por favor, selecciona la sede a la que deseas pedir:</p>
        
        <div className="locations-grid">
          {locations.map(loc => (
            <button 
              key={loc.id} 
              className="btn-location"
              onClick={() => onSelect(loc)}
            >
              <div className="loc-icon">📍</div>
              <div className="loc-info">
                <span className="loc-name">{loc.name}</span>
                <span className="loc-city">{loc.city}, {loc.state}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
