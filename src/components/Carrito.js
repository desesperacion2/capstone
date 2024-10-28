import React, { useState, useEffect } from 'react';
import ActualizarStock from './ActualizarStock';

const Carrito = ({ carrito, setCarrito }) => {
  const [cantidad, setCantidad] = useState({});
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    fechaPedido: '',
  });
  const [compraId, setCompraId] = useState(null);
  const [mostrarIdCompra, setMostrarIdCompra] = useState(false);
  const [mostrarDatosBancarios, setMostrarDatosBancarios] = useState(false);

  useEffect(() => {
    if (compraExitosa) {
      const timer = setTimeout(() => {
        setCompraExitosa(false);
        setMostrarIdCompra(true);
      }, 1000);
      return () => clearTimeout(timer);
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
    setMostrarFormulario(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleCompraExitosa = (idCompra) => {
    vaciarCarrito();
    setCompraExitosa(true);
    setCompraId(idCompra);
    setMostrarFormulario(false);
    setMostrarDatosBancarios(false);
  };

  const camposCompletos =
    formularioDatos.nombre &&
    formularioDatos.telefono &&
    formularioDatos.direccion &&
    formularioDatos.fechaPedido;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Carrito de Compras</h1>

      {compraExitosa && (
        <div className="alert alert-success text-center">
          ¡Compra exitosa!
        </div>
      )}

      {mostrarIdCompra && compraId && (
  <div className="text-center mb-4">
    <p>ID de la Compra: <strong>{compraId}</strong></p>
    <p>Por favor, envíe su comprobante de pago via WhatsApp, indicando el ID de la compra.</p>
    <p>
      <a 
        href={`https://wa.me/56945768174?text=Hola mi nombre es: ${formularioDatos.nombre}%0AQuiero confirmar mi pedido con el ID: ${compraId}`} // Asegúrate de cambiar el número a tu número real
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary" // Puedes usar cualquier clase de estilo que prefieras
      >
        Presione aqui para enviar comprobando via WhatsApp
      </a>
    </p>
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

          {mostrarFormulario && (
            <form className="mt-4">
              <h3>Datos del Pedido</h3>
              <input
                type="text"
                className="form-control mb-3 w-50"
                name="nombre"
                placeholder="Nombre"
                value={formularioDatos.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="form-control mb-3 w-50"
                name="telefono"
                placeholder="Teléfono"
                value={formularioDatos.telefono}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="form-control mb-3 w-50"
                name="direccion"
                placeholder="Dirección"
                value={formularioDatos.direccion}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                className="form-control mb-3 w-50"
                name="fechaPedido"
                value={formularioDatos.fechaPedido}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => setMostrarDatosBancarios(true)}
                disabled={!camposCompletos}
              >
                Siguiente
              </button>
            </form>
          )}

          {mostrarDatosBancarios && (
            <div className="mt-4">
              <h5>Transfiera el total del pedido a la siguiente cuenta y luego presione en "Confirmar Pedido"</h5>
              <p>Nombre: Antonia Stevens</p>
              <p>Rut: 21.145.874-7</p>
              <p>Banco: Banco de Chile</p>
              <p>Tipo de cuenta: Cuenta Vista</p>
              <p>Cuenta: 07-593-01228-10</p>
              <p>Correo: antostevens3@gmail.com</p>
              <b>Monto: ${formatearPrecio(total)}</b>
              <div style={{ margin: '10px 0' }}></div>
              <ActualizarStock
                carrito={carrito}
                formularioDatos={formularioDatos}
                onCompraExitosa={handleCompraExitosa}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Carrito;
