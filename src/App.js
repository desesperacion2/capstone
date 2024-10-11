import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Productos from './components/Productos';
import Header from './components/Header'; // Importamos el nuevo componente Header

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Reemplazamos con el nuevo componente Header que incluye el logo y la barra de búsqueda */}
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
