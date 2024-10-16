// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg" data-bs-theme="light" style={{ borderTop: '1px solid #ccc', marginTop: '0px' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Inicio</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/productos">Productos</Link>
            <Link className="nav-link" to="/about">Sobre Nosotros</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
