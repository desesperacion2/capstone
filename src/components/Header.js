// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Para la navegación
import { FaShoppingCart } from 'react-icons/fa'; // Importa el ícono del carrito

const Header = () => {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo a la izquierda */}
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo.jpeg?alt=media&token=150a90e1-8dd3-4bf0-a6cf-3ebb6a115bca"
            alt="Logo"
            className="img-thumbnail"
            style={{ width: '150px', height: 'auto' }}
          />
        </Link>

        {/* Barra de búsqueda centrada */}
        <form className="d-flex" role="search" style={{ flexGrow: 1, justifyContent: 'center' }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Buscar productos y marcas"
            aria-label="Search"
            style={{ width: '300px' }}
          />
          <button className="btn btn-outline-success" type="submit">
            Buscar
          </button>
        </form>

        {/* Ícono del carrito alineado a la derecha */}
        <Link to="/carrito" className="btn btn-outline-primary ms-3">
          <FaShoppingCart size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
