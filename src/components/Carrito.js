import React, { useState, useEffect } from 'react';
import ActualizarStock from './ActualizarStock.js'; // Importar el componente ActualizarStock

const Carrito = ({ carrito, setCarrito }) => {
  const [cantidad, setCantidad] = useState({});
  const [compraExitosa, setCompraExitosa] = useState(false); // Estado para la notificación de compra exitosa
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para mostrar el formulario
  const [formularioDatos, setFormularioDatos] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    fechaPedido: '',
  });
  const [compraId, setCompraId] = useState(null); // Estado para almacenar el ID de la compra
  const [mostrarIdCompra, setMostrarIdCompra] = useState(false); // Estado para mostrar el ID de compra

  // Utiliza useEffect para ocultar el mensaje de compra exitosa después de 5 segundos
  useEffect(() => {
    if (compraExitosa) {
      const timer = setTimeout(() => {
        setCompraExitosa(false); // Oculta el mensaje de compra exitosa
        setMostrarIdCompra(true); // Muestra el ID de compra
      }, 1000); // 5000 milisegundos = 5 segundos
      return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
    }
  }, [compraExitosa]);

  const formatearPrecio = (precio) => {
    return precio.toString().replace(/\B(?=(\d{3})+(?!))/g, ".");
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

  const handleCompra = () => {
    setMostrarFormulario(true); // Mostrar el formulario cuando se presiona "Comprar"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleCompraExitosa = (idCompra) => {
    vaciarCarrito(); // Vaciar el carrito después de la compra
    setCompraExitosa(true); // Mostrar mensaje de compra exitosa
    setCompraId(idCompra); // Almacenar el ID de la compra
    setMostrarFormulario(false); // Ocultar formulario después de la compra
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Carrito de Compras</h1>

      {/* Mensaje de Compra Exitosa */}
      {compraExitosa && (
        <div className="alert alert-success text-center">
          ¡Compra exitosa!
        </div>
      )}

      {/* ID de la Compra */}
      {mostrarIdCompra && compraId && (
        <div className="text-center mb-4">
          <p>ID de la Compra: <strong>{compraId}</strong></p>
          <p>Por favor, guarda este ID para futuras referencias.</p>
        </div>
      )}

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
              {!mostrarFormulario && (
                <button className="btn btn-success" onClick={handleCompra}>
                  Comprar
                </button>
              )}
              <button className="btn btn-danger ms-2" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Formulario de datos del usuario */}
          {mostrarFormulario && (
            <div className="mt-4">
              <h3>Datos del Pedido</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formularioDatos.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={formularioDatos.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    value={formularioDatos.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fechaPedido" className="form-label">Fecha de Pedido</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPedido"
                    name="fechaPedido"
                    value={formularioDatos.fechaPedido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
              <ActualizarStock 
                formularioDatos={formularioDatos}
                onCompraExitosa={handleCompraExitosa} 
                carrito={carrito} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Carrito;
