import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'; // Importamos los íconos de WhatsApp e Instagram

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-2" style={{ fontSize: '14px' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <p className="mb-0">© 2024 Alcobiobio. Todos los derechos reservados.</p>
        <div className="d-flex align-items-center">
          <a
            href="https://wa.me/56984820089" // Reemplaza con tu número de WhatsApp real (formato internacional sin "+")
            className="text-white me-3"
            style={{ fontSize: '20px' }}
            aria-label="Contacto WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/alcobiobiocomercializadora/" // Reemplaza con el enlace a tu Instagram
            className="text-white"
            style={{ fontSize: '20px' }}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
        <p className="mb-0">
          <a href="https://wa.me/56984820089" className="text-white" style={{ textDecoration: 'none' }}>
            Contacto: +56 9 8482 0089
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
