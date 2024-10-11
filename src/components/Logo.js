// src/components/Logo.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link

const Logo = () => {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
      <Link to="/"> {/* Envuélvelo en un Link */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo.jpeg?alt=media&token=150a90e1-8dd3-4bf0-a6cf-3ebb6a115bca"
          alt="Logo"
          style={{ width: '100px', height: 'auto', cursor: 'pointer' }} // Agrega cursor: 'pointer' para indicar que es clickeable
        />
      </Link>
    </div>
  );
};

export default Logo;
