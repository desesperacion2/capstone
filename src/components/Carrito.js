import React, { useEffect, useState } from 'react';

const Carrito = ({ carrito, setCarrito }) => {
  const [cantidad, setCantidad] = useState({}); // Estado para almacenar las cantidades a eliminar

  // Función para formatear el precio con separadores de miles
  const formatearPrecio = (precio) => {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Función para manejar el cambio en el input de cantidad
  const handleCantidadChange = (productoId, formatoSeleccionado, e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [`${productoId}-${formatoSeleccionado}`]: nuevaCantidad >= 0 ? nuevaCantidad : 0,
    }));
  };

  // Función para eliminar productos del carrito
  const eliminarDelCarrito = (productoId, formatoSeleccionado) => {
    const cantidadEliminar = cantidad[`${productoId}-${formatoSeleccionado}`] || 0;

    const nuevoCarrito = carrito.map((item) => {
      // Solo actualizar la cantidad si el producto coincide con el ID y formato
      if (item.id === productoId && item.formatoSeleccionado === formatoSeleccionado) {
        const nuevaCantidad = item.cantidad - cantidadEliminar;
        return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 0 };
      }
      return item;
    }).filter(item => item.cantidad > 0); // Filtrar productos con cantidad 0

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    // Restablecer la cantidad en el estado
    setCantidad((prevCantidad) => ({ ...prevCantidad, [`${productoId}-${formatoSeleccionado}`]: 0 }));
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.setItem('carrito', JSON.stringify([]));
  };

  // Calcular el total del carrito
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const total = calcularTotal();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <div>
          <div className="list-group mb-4">
            {carrito.map((producto) => (
              <div key={`${producto.id}-${producto.formatoSeleccionado}`} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
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
                <div className="d-flex align-items-center">
                  <p className="mb-0 me-2">Cantidad: {producto.cantidad}</p>
                  <p className="mb-0 me-2">
                    Total: ${formatearPrecio(producto.precio * producto.cantidad)}
                  </p>
                  <div className="input-group" style={{ width: '100px' }}>
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
                    className="btn btn-danger ms-2"
                    onClick={() => eliminarDelCarrito(producto.id, producto.formatoSeleccionado)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total y botones para comprar y vaciar el carrito */}
          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: ${formatearPrecio(total)}</h4>
            <div>
              <button className="btn btn-success me-2" onClick={() => alert("Compra realizada!")}>
                Comprar
              </button>
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
