import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/productos?categoria=${category}`);
  };

  const handleAddToCart = (productId) => {
    navigate(`/productos?highlight=${productId}`);
  };

  return (
    <div>
      {/* Carousel Section */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/info.jpeg?alt=media&token=6a2e10c2-5035-494e-89d6-62c7ce57befc" 
              className="d-block w-100" 
              alt="Info" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/BANNERCONGELADOS.jpg?alt=media&token=5ad0d401-a76a-419a-a3e8-9f7eb279e60e" 
              className="d-block w-100" 
              alt="Congelado" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/arrolao.jpg?alt=media&token=9686dba2-af0f-4581-86ae-10246489c306" 
              className="d-block w-100" 
              alt="Arrollado" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/pizza.webp?alt=media&token=59b4c86d-3c5c-4857-aeee-74b483e2502e" 
              className="d-block w-100" 
              alt="Pizza" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/tofu.avif?alt=media&token=8ed120a8-0a6d-4eba-8bc7-bda1533b8166" 
              className="d-block w-100" 
              alt="Tofu" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/gyozas.jpg?alt=media&token=45128f18-edc1-4cf6-bd04-da58da609b27" 
              className="d-block w-100" 
              alt="Gyozas" 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: 'invert(1)' }}></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: 'invert(1)' }}></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card h-100" onClick={() => handleCategoryClick('Arrollados')}>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/arrollado%20home.jpg?alt=media&token=f61880a4-adbd-4153-b5a4-36dd7429d149" 
                className="card-img-top" 
                alt="Arrollados"
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Arrollados</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100" onClick={() => handleCategoryClick('Gyozas')}>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/gyoza%20home.jpg?alt=media&token=c2eef125-5be5-4be8-a9ff-53a1dd8cfc15" 
                className="card-img-top" 
                alt="Gyozas"
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Gyozas</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100" onClick={() => handleCategoryClick('Pizzas')}>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/pizza%20home.webp?alt=media&token=993d7e5f-046c-494b-ab2c-18f936351beb" 
                className="card-img-top" 
                alt="Pizzas"
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Pizzas</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100" onClick={() => handleCategoryClick('Tofu')}>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/tofu%20home.jpg?alt=media&token=90261933-b02b-44f7-b09d-efcf56936b71" 
                className="card-img-top" 
                alt="Tofu"
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Tofu</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Destacados Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Productos Destacados</h2>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <div className="row g-4">
            {productos.slice(0, 4).map((producto) => (
              <div key={producto.id} className="col-md-3">
                <div className="card h-100">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text text-muted">{producto.descripcion}</p>
                    <p className="card-text"><strong>Precio: ${producto.precio}</strong></p>
                    <p className="card-text text-success">{producto.stock > 0 ? 'En stock' : 'Agotado'}</p>
                    <div className="mt-auto">
                      <button 
                        className="btn btn-primary w-100"
                        onClick={() => handleAddToCart(producto.id)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;