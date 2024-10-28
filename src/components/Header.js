import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const Header = ({ setBusqueda }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(db, 'Productos');
        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosData);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (producto) => {
    setSearchTerm(producto.nombre);
    setBusqueda(producto.nombre);
    setShowSuggestions(false);
    navigate('/productos');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const filteredProducts = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo.jpeg?alt=media&token=150a90e1-8dd3-4bf0-a6cf-3ebb6a115bca"
            alt="Logo"
            className="img-thumbnail"
            style={{ width: '150px', height: 'auto' }}
          />
        </Link>

        <div className="d-flex position-relative" style={{ width: '300px', margin: '0 auto' }} ref={searchRef}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Buscar productos y marcas"
            aria-label="Search"
            style={{ width: '100%' }}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {showSuggestions && searchTerm.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ 
              top: '100%', 
              zIndex: 1000, 
              maxHeight: '200px', 
              overflowY: 'auto'   
            }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(producto => (
                  <li
                    key={producto.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSearch(producto)}
                  >
                    {producto.nombre}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No se encontraron búsquedas relacionadas.</li>
              )}
            </ul>
          )}
          <button className="btn btn-outline-success" onClick={() => handleSearch({ nombre: searchTerm })}>
            Buscar
          </button>
        </div>

        <Link to="/carrito" className="btn btn-outline-primary ms-3">
          <FaShoppingCart size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Header;