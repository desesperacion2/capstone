import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const Productos = () => {
  const [productos, setProductos] = useState([]);

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
            ...formatoDoc.data(), // Tomamos todos los campos, incluyendo "formato"
          }));

          data.formatos = formatos;

          // Seleccionar el primer formato por defecto
          if (formatos.length > 0) {
            data.formatoSeleccionado = formatos[0].formato; // Usamos el campo "formato"
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
              {/* Imagen del producto */}
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="card-img-top"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <div className="card-body text-center">
                {/* Nombre del producto */}
                <h5 className="card-title">{producto.nombre}</h5>

                {/* Descripción del producto */}
                <p className="card-text">{producto.descripcion}</p>

                {/* Dropdown para seleccionar formato */}
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
                            {formato.formato} {/* Ahora usamos el campo "formato" */}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No hay formatos disponibles</li>
                    )}
                  </ul>
                </div>

                {/* Precio del producto */}
                <p className="card-text">
                  <strong>Precio:</strong> ${producto.precio}
                </p>

                {/* Stock disponible */}
                <p className="card-text">
                  <strong>Stock disponible:</strong> {producto.stock}
                </p>

                {/* Botón para agregar al carrito */}
                <button className="btn btn-primary">Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
