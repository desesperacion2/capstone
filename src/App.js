import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import About from './components/About.js';
import Navbar from './components/Navbar.js';
import Productos from './components/Productos.js';
import Header from './components/Header.js';
import Carrito from './components/Carrito.js';
import Footer from './components/Footer.js'; // Asegúrate de importar el Footer
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [carrito, setCarrito] = useState([]);

  // Recuperar el carrito del localStorage al iniciar la aplicación
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Navbar />
        <div style={{ flex: '1' }}> {/* Este div flex crecerá para ocupar el espacio disponible */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/productos" element={<Productos carrito={carrito} setCarrito={setCarrito} />} />
            <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
          </Routes>
        </div>
        <Footer /> {/* Footer al final */}
      </div>
    </Router>
  );
}

export default App;
