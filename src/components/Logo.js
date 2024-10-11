// src/components/Logo.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para redirección

const Logo = () => {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
      <Link to="/"> {/* Redirige a la página de inicio al hacer clic en el logo */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo.jpeg?alt=media&token=150a90e1-8dd3-4bf0-a6cf-3ebb6a115bca"
          alt="Logo"
          className="img-thumbnail" // Clase de Bootstrap para imagen
          style={{ width: '100px', height: 'auto' }}
        />
      </Link>
    </div>
  );
};

export default Logo;
