import React from 'react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import emailjs from 'emailjs-com';

const ActualizarStock = ({ carrito, formularioDatos, onCompraExitosa }) => {
  // Verifica si todos los campos están llenos
  const camposCompletos = formularioDatos.nombre && formularioDatos.telefono && formularioDatos.direccion;

  const confirmarPedido = async () => {
    try {
      // Crear un objeto de pedido
      const pedido = {
        cliente: {
          nombre: formularioDatos.nombre,
          telefono: formularioDatos.telefono,
          direccion: formularioDatos.direccion,
        },
        fechaPedido: new Date().toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
        productos: carrito.map((producto) => ({
          cantidad: producto.cantidad,
          descripcion: producto.descripcion,
          formatoSeleccionado: producto.formatoSeleccionado,
          precio: producto.precio,
        })),
        total: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
      };

      // Guardar datos del pedido en Firebase
      const pedidosRef = collection(db, 'Pedidos');
      const docRef = await addDoc(pedidosRef, pedido); // Almacena el pedido y obtiene el ID

      // Actualizar el stock de cada producto
      for (const producto of carrito) {
        let formatoNombre = producto.formatoSeleccionado.replace(/\s/g, '');

        // Correcciones específicas para ciertos productos
        if (producto.id === 'TofuFirme') {
          formatoNombre = formatoNombre.replace(/500gramos/i, '500Gramos');
        } else if (producto.id === 'PizzaJamon') {
          formatoNombre = formatoNombre.replace(/23cmy290gramos/i, '23cm290g');
        } else if (producto.id === 'PizzaPepperoni') {
          formatoNombre = formatoNombre.replace(/23cmy290gramos/i, '23cm290g');
        } else if (producto.id === 'PizzaVeggieAceitunas') {
          formatoNombre = formatoNombre.replace(/23cmy300gramos/i, '23cm300g');
        } else if (producto.id === 'PizzaVeggieProteinaSoyaAceitunas') {
          formatoNombre = formatoNombre.replace(/23cmy300gramos/i, '23cm300g');
        } else if (producto.id === 'PizzaVeggieProteinaSoyaTomates') {
          formatoNombre = formatoNombre.replace(/23cmy300gramos/i, '23cm300g');
        } else if (producto.id === 'PizzaVeggieVerduras') {
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

        if (nuevoStock === 0) {
          enviarCorreoAgotado(producto.nombre);
        } else if (nuevoStock <= 4) {
          enviarCorreoBajoStock(producto.nombre, nuevoStock);
        }
      }

      onCompraExitosa(docRef.id); // Pasar el ID del pedido exitoso
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    }
  };

  const enviarCorreoBajoStock = (nombreProducto, stock) => {
    const templateParams = {
      to_email: 'emilioestebansuazo@gmail.com',
      product_name: nombreProducto,
      stock_quantity: stock,
    };

    emailjs.send('service_wfl68aj', 'template_nxgfcmt', templateParams, '3Fz3DdCNxBCbRv-Ga')
      .then((response) => {
        console.log('Correo de bajo stock enviado con éxito:', response.status, response.text);
      }, (error) => {
        console.error('Error al enviar el correo de bajo stock:', error);
      });
  };

  const enviarCorreoAgotado = (nombreProducto) => {
    const templateParams = {
      to_email: 'emilioestebansuazo@gmail.com',
      product_name: nombreProducto,
    };

    emailjs.send('service_wfl68aj', 'template_cj3dg8t', templateParams, '3Fz3DdCNxBCbRv-Ga')
      .then((response) => {
        console.log('Correo de producto agotado enviado con éxito:', response.status, response.text);
      }, (error) => {
        console.error('Error al enviar el correo de producto agotado:', error);
      });
  };

  return (
    <button
      className="btn btn-success"
      onClick={confirmarPedido}
      disabled={!camposCompletos} // Deshabilita el botón si algún campo está vacío
    >
      Confirmar Pedido
    </button>
  );
};

export default ActualizarStock;
