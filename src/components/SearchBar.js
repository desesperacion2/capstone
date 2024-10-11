// src/components/SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa el ícono de lupa

const SearchBar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <input
        type="text"
        placeholder="Buscar productos y marcas"
        style={{
          width: '250px', // Ajusta el ancho de la barra de búsqueda
          padding: '5px 30px 5px 10px', // Aumenta el padding a la izquierda para dar espacio al ícono
          borderRadius: '5px',
          border: '1px solid #ccc',
          outline: 'none', // Elimina el contorno predeterminado al enfocar
        }}
      />
      <button
        style={{
          marginLeft: '-40px', // Coloca el botón de búsqueda sobre la barra de entrada
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}
      >
        <FaSearch style={{ color: '#aaa', fontSize: '16px' }} /> {/* Icono de búsqueda */}
      </button>
    </div>
  );
};

export default SearchBar;
