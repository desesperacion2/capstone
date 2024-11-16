import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';
import ReactGA from "react-ga4";
import 'bootstrap/dist/css/bootstrap.min.css';

const Productos = ({ carrito, setCarrito, busqueda }) => {
  const [productos, setProductos] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAgregadoId, setProductoAgregadoId] = useState(null);
  const [mensajeError, setMensajeError] = useState({});

  const fetchProductos = async () => {
    try {
      const productosRef = collection(db, 'Productos');
      const snapshot = await getDocs(productosRef);

      const productosData = await Promise.all(
        snapshot.docs.map(async (docProducto) => {
          const data = { id: docProducto.id, ...docProducto.data() };

          if (data.imagenPath) {
            const storage = getStorage();
            const url = await getDownloadURL(ref(storage, data.imagenPath));
            data.imagenUrl = url;
          }

          const formatosRef = collection(db, `Productos/${docProducto.id}/Formatos`);
          const formatosSnapshot = await getDocs(formatosRef);
          const formatos = formatosSnapshot.docs.map((formatoDoc) => ({
            id: formatoDoc.id,
            ...formatoDoc.data(),
          }));

          data.formatos = formatos;

          if (formatos.length > 0) {
            data.formatoSeleccionado = formatos[0].formato;
            data.precio = formatos[0].precio;
            data.stock = formatos[0].stock;
          } else {
            data.precio = 'No disponible';
            data.stock = 0;
          }

          return data;
        })
      );

      setProductos(productosData);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleFormatoChange = (productoId, formatoSeleccionado) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) => {
        if (producto.id === productoId) {
          const formatoSeleccionadoObj = producto.formatos.find(
            (formato) => formato.formato === formatoSeleccionado
          );
          return {
            ...producto,
            formatoSeleccionado: formatoSeleccionado,
            precio: formatoSeleccionadoObj ? formatoSeleccionadoObj.precio : producto.precio,
            stock: formatoSeleccionadoObj ? formatoSeleccionadoObj.stock : producto.stock,
          };
        }
        return producto;
      })
    );
  };

  const agregarAlCarrito = (producto) => {
    setMensajeError((prev) => ({ ...prev, [producto.id]: null }));

    if (productoSeleccionado) {
      const productoEnCarrito = carrito.find(
        (item) =>
          item.id === productoSeleccionado.id &&
          item.formatoSeleccionado === productoSeleccionado.formatoSeleccionado
      );

      if (productoEnCarrito) {
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;

        if (nuevaCantidad <= productoSeleccionado.stock) {
          const nuevoCarrito = carrito.map((item) =>
            item.id === productoSeleccionado.id &&
            item.formatoSeleccionado === productoSeleccionado.formatoSeleccionado
              ? { ...item, cantidad: nuevaCantidad }
              : item
          );
          setCarrito(nuevoCarrito);
          localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
          setProductoAgregadoId(productoSeleccionado.id);

          // Rastrear producto añadido al carrito
          ReactGA.event({
            category: "Ecommerce",
            action: "Add to Cart",
            label: productoSeleccionado.nombre,
            value: nuevaCantidad
          });

          setTimeout(() => {
            setProductoAgregadoId(null);
          }, 2000);
        } else {
          const errorMsg = "No hay suficiente stock disponible";
          setMensajeError((prev) => ({ ...prev, [producto.id]: errorMsg }));
          
          setTimeout(() => {
            setMensajeError((prev) => ({ ...prev, [producto.id]: null }));
          }, 2000);
        }
      } else {
        if (cantidad > 0 && cantidad <= productoSeleccionado.stock) {
          const nuevoCarrito = [...carrito, { ...productoSeleccionado, cantidad }];
          setCarrito(nuevoCarrito);
          localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
          setProductoAgregadoId(productoSeleccionado.id);

          // Rastrear producto añadido al carrito
          ReactGA.event({
            category: "Ecommerce",
            action: "Add to Cart",
            label: productoSeleccionado.nombre,
            value: cantidad
          });

          setTimeout(() => {
            setProductoAgregadoId(null);
          }, 2000);
        } else {
          const errorMsg = "No hay suficiente stock disponible";
          setMensajeError((prev) => ({ ...prev, [producto.id]: errorMsg }));
          
          setTimeout(() => {
            setMensajeError((prev) => ({ ...prev, [producto.id]: null }));
          }, 2000);
        }
      }

      setCantidad(1);
      setProductoSeleccionado(null);
    } else {
      setProductoSeleccionado({ ...producto, cantidad });
    }
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0 && nuevaCantidad <= (productoSeleccionado?.stock || Infinity)) {
      setCantidad(nuevaCantidad);
    }
  };

  const cancelarSeleccion = () => {
    setCantidad(1);
    setProductoSeleccionado(null);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Productos Disponibles</h1>
      <div className="row">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="card-img-top"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">{producto.descripcion}</p>
                  <div className="dropdown mb-3">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id={`dropdown-${producto.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Formato: {producto.formatoSeleccionado}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdown-${producto.id}`}>
                      {producto.formatos && producto.formatos.length > 0 ? (
                        producto.formatos.map((formato) => (
                          <li key={formato.id}>
                            <button
                              className="dropdown-item"
                              onClick={() => handleFormatoChange(producto.id, formato.formato)}
                            >
                              {formato.formato}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li>No hay formatos disponibles</li>
                      )}
                    </ul>
                  </div>
                  <p className="card-text">
                    <strong>Precio:</strong> ${producto.precio}
                  </p>
                  <p className="card-text">
                    <strong>Stock disponible:</strong> {producto.stock}
                  </p>

                  {productoSeleccionado?.id === producto.id ? (
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: '80px', margin: '0 auto' }}
                        value={cantidad}
                        onChange={handleCantidadChange}
                        min="1"
                        max={productoSeleccionado?.stock || Infinity}
                      />
                    </div>
                  ) : null}

                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      {productoSeleccionado?.id === producto.id ? 'Confirmar cantidad' : 'Agregar al carrito'}
                    </button>

                    {productoSeleccionado?.id === producto.id && (
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={cancelarSeleccion}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  {/* Mensaje de éxito */}
                  {productoAgregadoId === producto.id && (
                    <div style={{ color: 'green', marginTop: '10px' }}>
                      Se ha agregado al carrito
                    </div>
                  )}

                  {/* Mensaje de error específico */}
                  {mensajeError[producto.id] && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {mensajeError[producto.id]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">No hay productos disponibles.</div>
        )}
      </div>
    </div>
  );
};

export default Productos;
