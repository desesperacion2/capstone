import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Productos from './components/Productos';
import Header from './components/Header';
import Carrito from './components/Carrito';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

// Inicializa Google Analytics
ReactGA.initialize("G-H0BVNY9V3X");

function App() {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Componente para manejar el seguimiento de páginas
  function PageTracker() {
    const location = useLocation();
    
    useEffect(() => {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    return null;
  }

  return (
    <Router>
      <PageTracker />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header setBusqueda={setBusqueda} />
        <Navbar />
        <div style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/productos" element={<Productos carrito={carrito} setCarrito={setCarrito} busqueda={busqueda} />} />
            <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;