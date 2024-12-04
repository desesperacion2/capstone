import React, { useState } from 'react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import emailjs from 'emailjs-com';
import ReactGA from "react-ga4";

export default function ActualizarStock({ carrito, formularioDatos, onCompraExitosa }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmarPedido = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const notifiedProducts = new Set();

    try {
      const pedido = {
        cliente: {
          nombre: formularioDatos.nombre,
          telefono: formularioDatos.telefono,
          direccion: formularioDatos.direccion,
        },
        fechaPedido: new Date().toISOString().split('T')[0],
        productos: carrito.map((producto) => ({
          cantidad: producto.cantidad,
          descripcion: producto.descripcion,
          formatoSeleccionado: producto.formatoSeleccionado,
          precio: producto.precio,
        })),
        total: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
      };

      const pedidosRef = collection(db, 'Pedidos');
      const docRef = await addDoc(pedidosRef, pedido);

      // Rastrear la compra completada
      ReactGA.event({
        category: "Ecommerce",
        action: "Purchase",
        value: pedido.total
      });

      // Rastrear los productos comprados
      carrito.forEach((producto) => {
        ReactGA.event({
          category: "Ecommerce",
          action: "Product Purchased",
          label: producto.nombre,
          value: producto.cantidad
        });
      });

      for (const producto of carrito) {
        let formatoNombre = producto.formatoSeleccionado.replace(/\s/g, '');

        // Correcciones específicas para ciertos productos
        if (producto.id === 'TofuFirme') {
          formatoNombre = formatoNombre.replace(/500gramos/i, '500Gramos');
        } else if (['PizzaJamon', 'PizzaPepperoni'].includes(producto.id)) {
          formatoNombre = formatoNombre.replace(/23cmy290gramos/i, '23cm290g');
        } else if (['PizzaVeggieAceitunas', 'PizzaVeggieProteinaSoyaAceitunas', 'PizzaVeggieProteinaSoyaTomates', 'PizzaVeggieVerduras'].includes(producto.id)) {
          formatoNombre = formatoNombre.replace(/23cmy300gramos/i, '23cm300g');
        } else {
          formatoNombre = formatoNombre.replace(/unidades/i, 'Unidades');
        }

        const formatoRef = doc(db, `Productos/${producto.id}/Formatos`, `Formato${formatoNombre}`);

        const nuevoStock = producto.stock - producto.cantidad;

        if (nuevoStock < 0) {
          alert(`No puedes eliminar más cantidad de la que hay en stock para ${producto.formatoSeleccionado}.`);
          continue;
        }

        await updateDoc(formatoRef, { stock: nuevoStock });

        const productKey = `${producto.id}-${formatoNombre}`;

        if (nuevoStock === 0 && !notifiedProducts.has(productKey)) {
          await enviarCorreoAgotado(producto.nombre);
          notifiedProducts.add(productKey);
        } else if (nuevoStock <= 4 && !notifiedProducts.has(productKey)) {
          await enviarCorreoBajoStock(producto.nombre, nuevoStock);
          notifiedProducts.add(productKey);
        }
      }

      onCompraExitosa(docRef.id);
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const enviarCorreoBajoStock = async (nombreProducto, stock) => {
    const templateParams = {
      to_email: 'alimentosalcobiobiomail@gmail.com',
      product_name: nombreProducto,
      stock_quantity: stock,
    };

    try {
      const response = await emailjs.send('service_wfl68aj', 'template_nxgfcmt', templateParams, '3Fz3DdCNxBCbRv-Ga');
      console.log('Correo de bajo stock enviado con éxito:', response.status, response.text);
    } catch (error) {
      console.error('Error al enviar el correo de bajo stock:', error);
    }
  };

  const enviarCorreoAgotado = async (nombreProducto) => {
    const templateParams = {
      to_email: 'alimentosalcobiobiomail@gmail.com',
      product_name: nombreProducto,
    };

    try {
      const response = await emailjs.send('service_wfl68aj', 'template_cj3dg8t', templateParams, '3Fz3DdCNxBCbRv-Ga');
      console.log('Correo de producto agotado enviado con éxito:', response.status, response.text);
    } catch (error) {
      console.error('Error al enviar el correo de producto agotado:', error);
    }
  };

  return (
    <button
      className="btn btn-success"
      onClick={confirmarPedido}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
    </button>
  );
}