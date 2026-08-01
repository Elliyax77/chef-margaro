import React from 'react';

const Footer = ({ restaurant, categories }) => {
  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3 className="footer-logo-text">Eli Sushi</h3>
          <p className="footer-desc">El mejor sushi de la ciudad. Calidad y sabor desde el primer bocado.</p>
        </div>
        
        <div className="footer-links">
          <h4>Explorar Menú</h4>
          <ul>
            {categories.map(cat => (
              <li key={cat.id}>
                <a href={`#${cat.id}`}>{cat.name}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contacto y Horarios</h4>
          <p>Lunes a Domingos</p>
          <p>11:00 AM - 10:00 PM</p>
          <a 
            href={`https://wa.me/${restaurant.phone}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-whatsapp"
          >
            Chatea con nosotros
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">© {new Date().getFullYear()} Eli Sushi. Todos los derechos reservados.</p>
        <p className="developer-credit">
          Desarrollado por <a href="https://wa.me/584244980621?text=Hola%2C%20vi%20tu%20trabajo%20y%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20desarrollo%20de%20p%C3%A1ginas%20web%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer" className="developer-link"><strong>Elías Espinal</strong></a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
