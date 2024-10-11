// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para redirección

const Header = () => {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo.jpeg?alt=media&token=150a90e1-8dd3-4bf0-a6cf-3ebb6a115bca"
            alt="Logo"
            className="img-thumbnail" // Clase de Bootstrap para imagen
            style={{ width: '150px', height: 'auto' }}
          />
        </Link>
        
        <div className="d-flex justify-content-center" style={{ flex: 1 }}> {/* Usamos flex para centrar el formulario */}
          <form className="d-flex" role="search" style={{ width: '350px' }}> {/* Ancho fijo para la barra de búsqueda */}
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos y marcas"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
