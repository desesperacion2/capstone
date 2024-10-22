// src/services/GuardarPedido.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const guardarCompra = async (formData, carrito, total) => {
  try {
    // Crea un nuevo documento en la colección Compras
    const docRef = await addDoc(collection(db, 'Pedidos'), {
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion,
      fechaEntrega: formData.fechaEntrega,
      total: total,
      productos: carrito.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        formato: producto.formatoSeleccionado,
        cantidad: producto.cantidad,
        precio: producto.precio,
      })),
    });

    console.log('Compra guardada con ID: ', docRef.id);
    return docRef.id; // Puedes devolver el ID de la compra si lo necesitas
  } catch (error) {
    console.error('Error al guardar la compra: ', error);
    throw error; // Lanzar el error para manejarlo donde se llame
  }
};
