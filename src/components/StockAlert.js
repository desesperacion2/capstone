import React, { useEffect } from 'react';
import emailjs from 'emailjs-com';

const StockAlert = ({ product, purchaseSuccess }) => {
  useEffect(() => {
    const checkStock = () => {
      console.log(`Verificando stock para ${product.nombre}: ${product.stock}`); // Registro de depuración

      // Verifica si la compra fue exitosa y si el stock es igual a 0 para enviar el correo correspondiente
      if (purchaseSuccess) {
        // Disminuir el stock después de la compra
        const newStock = product.stock - 1;

        if (newStock === 0) {
          sendEmail('agotado'); // Enviar correo de stock agotado
        } else if (newStock <= 4) {
          sendEmail('bajo'); // Enviar correo de stock bajo
        }
      }
    };

    checkStock();
  }, [product, purchaseSuccess]); // Dependencias del efecto

  const sendEmail = (tipo) => {
    let templateParams;

    if (tipo === 'agotado') {
      templateParams = {
        to_email: 'emilioestebansuazo@gmail.com', // Reemplaza con la dirección de correo deseada
        product_name: product.nombre,
      };

      emailjs.send('service_wfl68aj', 'template_cj3dg8t', templateParams, '3Fz3DdCNxBCbRv-Ga')
        .then((response) => {
          console.log('Email de stock agotado enviado exitosamente:', response.status, response.text);
        }, (error) => {
          console.error('Error al enviar el email de stock agotado:', error);
        });
    } else if (tipo === 'bajo') {
      templateParams = {
        to_email: 'emilioestebansuazo@gmail.com', // Reemplaza con la dirección de correo deseada
        product_name: product.nombre,
        stock_quantity: product.stock,
      };

      emailjs.send('service_wfl68aj', 'template_nxgfcmt', templateParams, '3Fz3DdCNxBCbRv-Ga')
        .then((response) => {
          console.log('Email de stock bajo enviado exitosamente:', response.status, response.text);
        }, (error) => {
          console.error('Error al enviar el email de stock bajo:', error);
        });
    }
  };

  return null; // No renderiza nada, solo se encarga de la lógica
};

export default StockAlert;
