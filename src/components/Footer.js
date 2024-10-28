import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="bg-dark text-white text-center py-2"
      style={{ fontSize: '14px', marginTop: '20px' }} // Aquí agregamos el margen superior
    >
      <div className="container d-flex justify-content-between align-items-center">
        <p className="mb-0">© 2024 Alcobiobio. Todos los derechos reservados.</p>
        <div className="d-flex align-items-center">
          <a
            href="https://wa.me/56945768174"
            className="text-white me-3"
            style={{ fontSize: '20px' }}
            aria-label="Contacto WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/alcobiobiocomercializadora/"
            className="text-white"
            style={{ fontSize: '20px' }}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
        <p className="mb-0">
          <a href="https://wa.me/56945768174" className="text-white" style={{ textDecoration: 'none' }}>
            Contacto: +56 9 4576 8174
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
