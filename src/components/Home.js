import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';  // Asegúrate de que la ruta sea correcta

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
      <h1>Bienvenido a la página de inicio</h1>
      <p>Esta es la página principal.</p>
      <p>Nombre: {userData.name || 'No disponible'}</p>
      <p>Apellido: {userData.apellido || 'No disponible'}</p>
    </div>
  );
};

export default Home;
