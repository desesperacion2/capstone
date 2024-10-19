import React, { useState } from 'react';
import ActualizarStock from './ActualizarStock'; // Importar el componente ActualizarStock

const Carrito = ({ carrito, setCarrito }) => {
  const [cantidad, setCantidad] = useState({});
  const [compraExitosa, setCompraExitosa] = useState(false); // Estado para la notificación de compra exitosa

  const formatearPrecio = (precio) => {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCantidadChange = (productoId, formatoSeleccionado, e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [`${productoId}-${formatoSeleccionado}`]: nuevaCantidad >= 0 ? nuevaCantidad : 0,
    }));
  };

  const eliminarDelCarrito = (productoId, formatoSeleccionado) => {
    const cantidadEliminar = cantidad[`${productoId}-${formatoSeleccionado}`] || 0;

    const nuevoCarrito = carrito
      .map((item) => {
        if (item.id === productoId && item.formatoSeleccionado === formatoSeleccionado) {
          const nuevaCantidad = item.cantidad - cantidadEliminar;
          return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 0 };
        }
        return item;
      })
      .filter((item) => item.cantidad > 0);

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [`${productoId}-${formatoSeleccionado}`]: 0,
    }));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.setItem('carrito', JSON.stringify([]));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const total = calcularTotal();

  const handleCompraExitosa = () => {
    vaciarCarrito(); // Vaciar el carrito después de la compra
    setCompraExitosa(true); // Mostrar mensaje de compra exitosa
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Carrito de Compras</h1>
      {compraExitosa && <p className="alert alert-success text-center">¡Compra exitosa!</p>} {/* Mostrar mensaje */}

      {carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <div>
          <div className="list-group mb-4">
            {carrito.map((producto) => (
              <div
                key={`${producto.id}-${producto.formatoSeleccionado}`}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center mb-2"
              >
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="img-fluid me-2"
                    style={{ maxHeight: '50px', maxWidth: '50px', objectFit: 'contain' }}
                  />
                  <div>
                    <h6 className="mb-1">{producto.nombre}</h6>
                    <p className="mb-0">{producto.descripcion}</p>
                    <p className="mb-0">Formato: {producto.formatoSeleccionado}</p>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center">
                  <p className="mb-2 mb-md-0 me-md-2">Cantidad: {producto.cantidad}</p>
                  <p className="mb-2 mb-md-0 me-md-2">
                    Total: ${formatearPrecio(producto.precio * producto.cantidad)}
                  </p>
                  <div className="input-group mb-2 mb-md-0" style={{ width: '100px' }}>
                    <input
                      type="number"
                      className="form-control"
                      value={cantidad[`${producto.id}-${producto.formatoSeleccionado}`] || 0}
                      onChange={(e) => handleCantidadChange(producto.id, producto.formatoSeleccionado, e)}
                      min="0"
                      max={producto.cantidad}
                    />
                  </div>
                  <button
                    className="btn btn-danger ms-md-2"
                    onClick={() => eliminarDelCarrito(producto.id, producto.formatoSeleccionado)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <h4>Total: ${formatearPrecio(total)}</h4>
            <div className="mt-3 mt-md-0">
              {/* Pasar la función handleCompraExitosa a ActualizarStock */}
              <ActualizarStock carrito={carrito} onCompraExitosa={handleCompraExitosa} />
              <button className="btn btn-danger ms-2" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
