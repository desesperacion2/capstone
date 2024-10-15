import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css';

const Productos = ({ carrito, setCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [cantidad, setCantidad] = useState(1); // Estado para controlar la cantidad
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para el producto seleccionado

  // Función para obtener productos desde Firestore
  const fetchProductos = async () => {
    try {
      const productosRef = collection(db, 'Productos');
      const snapshot = await getDocs(productosRef);

      const productosData = await Promise.all(
        snapshot.docs.map(async (docProducto) => {
          const data = { id: docProducto.id, ...docProducto.data() };

          // Obtén la URL de la imagen desde Firebase Storage
          if (data.imagenPath) {
            const storage = getStorage();
            const url = await getDownloadURL(ref(storage, data.imagenPath));
            data.imagenUrl = url;
          }

          // Obtener formatos disponibles del producto
          const formatosRef = collection(db, `Productos/${docProducto.id}/Formatos`);
          const formatosSnapshot = await getDocs(formatosRef);
          const formatos = formatosSnapshot.docs.map((formatoDoc) => ({
            id: formatoDoc.id,
            ...formatoDoc.data(),
          }));

          data.formatos = formatos;

          // Seleccionar el primer formato por defecto
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

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    if (productoSeleccionado) {
      const productoEnCarrito = carrito.find(
        (item) =>
          item.id === productoSeleccionado.id &&
          item.formatoSeleccionado === productoSeleccionado.formatoSeleccionado
      );

      if (productoEnCarrito) {
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;

        // Validar si la nueva cantidad no supera el stock
        if (nuevaCantidad <= productoSeleccionado.stock) {
          const nuevoCarrito = carrito.map((item) =>
            item.id === productoSeleccionado.id &&
            item.formatoSeleccionado === productoSeleccionado.formatoSeleccionado
              ? { ...item, cantidad: nuevaCantidad }
              : item
          );
          setCarrito(nuevoCarrito);
          localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        } else {
          console.log('No hay suficiente stock disponible');
        }
      } else {
        // Validar si la cantidad no supera el stock al añadir un nuevo producto
        if (cantidad > 0 && cantidad <= productoSeleccionado.stock) {
          const nuevoCarrito = [...carrito, { ...productoSeleccionado, cantidad }];
          setCarrito(nuevoCarrito);
          localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        } else {
          console.log('No hay suficiente stock disponible');
        }
      }

      setCantidad(1);
      setProductoSeleccionado(null);
    } else {
      setProductoSeleccionado({ ...producto, cantidad });
    }
  };

  // Función para manejar el cambio en el input de cantidad
  const handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0 && nuevaCantidad <= (productoSeleccionado?.stock || Infinity)) {
      setCantidad(nuevaCantidad);
    }
  };

  // Función para cancelar la selección
  const cancelarSeleccion = () => {
    setCantidad(1);
    setProductoSeleccionado(null);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Productos Disponibles</h1>
      <div className="row">
        {productos.map((producto) => (
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

                {/* Input para seleccionar la cantidad */}
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

                  {/* Botón de Cancelar */}
                  {productoSeleccionado?.id === producto.id && (
                    <button
                      className="btn btn-secondary ms-2"
                      onClick={cancelarSeleccion}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
