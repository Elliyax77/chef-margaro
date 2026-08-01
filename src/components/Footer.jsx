import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer" style={{ padding: '24px 20px' }}>
      <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0, gap: '8px' }}>
        <p className="copyright">© {new Date().getFullYear()} Eli Sushi. Todos los derechos reservados.</p>
        <p className="developer-credit">
          Desarrollado por <a href="https://wa.me/584244980621?text=Hola%2C%20vi%20tu%20trabajo%20y%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20desarrollo%20de%20p%C3%A1ginas%20web%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer" className="developer-link"><strong>Elías Espinal</strong></a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
