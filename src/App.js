import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Productos from './components/Productos';
import SearchBar from './components/SearchBar'; // Importamos el componente SearchBar
import Logo from './components/Logo'; // Importamos el componente Logo

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Logo /> {/* Agregamos el componente del logo */}
        <SearchBar /> {/* Agregamos la barra de búsqueda */}
        <Navbar /> {/* La barra de navegación se desplaza hacia abajo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
