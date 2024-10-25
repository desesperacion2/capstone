import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config.js';  // Asegúrate de que la ruta sea correcta

const Home = () => {
  const [userData, setUserData] = useState({});

  // Función para obtener los datos de un documento específico en Firestore
  const fetchUserData = async () => {
    try {
      console.log('Obteniendo datos de Firestore...');
      
      // Reemplaza 'OXGdRqtgZYbCMwjBkn06' con el ID de tu documento
      const docRef = doc(db, 'nombres', 'jwOsR4OzkWILIlZWal4F');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Datos obtenidos:', docSnap.data());
        setUserData(docSnap.data());  // Establece los datos en el estado
      } else {
        console.log('No se encontró el documento');
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/info.jpeg?alt=media&token=6a2e10c2-5035-494e-89d6-62c7ce57befc" 
              className="d-block w-100" 
              alt="..." 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="..." 
              className="d-block w-100" 
              alt="..." 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="..." 
              className="d-block w-100" 
              alt="..." 
              style={{ height: '400px', objectFit: 'contain' }} 
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
