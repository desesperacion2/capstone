import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const ActualizarStock = ({ carrito, onCompraExitosa }) => {
  const actualizarStock = async () => {
    try {
      for (const producto of carrito) {
        // Normalización del nombre del formato
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
          // Corregir el formato si es necesario para asegurar la 'U' mayúscula en "Unidades"
          formatoNombre = formatoNombre.replace(/unidades/i, 'Unidades');
        }

        // Crear la referencia correcta al documento
        const formatoRef = doc(db, `Productos/${producto.id}/Formatos`, `Formato${formatoNombre}`);

        const nuevoStock = producto.stock - producto.cantidad;

        if (nuevoStock < 0) {
          alert(`No puedes eliminar más cantidad de la que hay en stock para ${producto.formatoSeleccionado}.`);
          continue;
        }

        // Actualizar el stock en Firestore
        await updateDoc(formatoRef, { stock: nuevoStock });
      }

      // Llamar a la función de éxito después de actualizar el stock
      onCompraExitosa();
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
    }
  };

  return (
    <button className="btn btn-success" onClick={actualizarStock}>
      Comprar
    </button>
  );
};

export default ActualizarStock;
