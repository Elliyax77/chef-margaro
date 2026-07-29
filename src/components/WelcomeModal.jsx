import React, { useState, useEffect } from 'react';

export default function WelcomeModal({ restaurantName }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('hideWelcomeModal');
    if (!hidden) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleCloseSession = () => {
    setIsOpen(false);
  };

  const handleClosePermanent = () => {
    localStorage.setItem('hideWelcomeModal', 'true');
    setIsOpen(false);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content welcome-modal">
        <h2 className="welcome-title">¡Bienvenido al Menú Interactivo de {restaurantName}! 🚀</h2>
        
        <p className="welcome-text">
          En este menú puedes armar tu pedido fácilmente. No te preocupes, ya que <strong>no tienes que hacer ningún pago aquí</strong>.
        </p>
        
        <p className="welcome-text">
          <strong>Pedir es muy sencillo:</strong> Agrega productos a tu carrito, rellena tus datos y luego te conectaremos de nuevo con <strong>{restaurantName}</strong> para que termines tu compra con ellos en WhatsApp.
        </p>

        <button className="btn-welcome" onClick={handleCloseSession}>
          Ok, quiero ver el Menú
        </button>

        <button className="btn-welcome-hide" onClick={handleClosePermanent}>
          No volver a mostrar este mensaje
        </button>
      </div>
    </div>
  );
}
