import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Carrito from './Carrito';

describe('Carrito Component', () => {
  const mockSetCarrito = jest.fn();
  const mockCarrito = [
    { id: '1', nombre: 'Producto A', descripcion: 'Desc A', formatoSeleccionado: 'Formato A', precio: 1000, cantidad: 2 },
    { id: '2', nombre: 'Producto B', descripcion: 'Desc B', formatoSeleccionado: 'Formato B', precio: 2000, cantidad: 1 },
  ];

  it('debería renderizar el título Carrito de Compras', () => {
    const { getByText } = render(<Carrito carrito={mockCarrito} setCarrito={mockSetCarrito} />);
    expect(getByText('Carrito de Compras')).toBeInTheDocument();
  });

  it('debería calcular correctamente el total', () => {
    const { getByText } = render(<Carrito carrito={mockCarrito} setCarrito={mockSetCarrito} />);
    expect(getByText('Total: $4000')).toBeInTheDocument();
  });

  it('debería vaciar el carrito al hacer clic en Vaciar carrito', () => {
    const { getByText } = render(<Carrito carrito={mockCarrito} setCarrito={mockSetCarrito} />);
    fireEvent.click(getByText('Vaciar carrito'));
    expect(mockSetCarrito).toHaveBeenCalledWith([]);
  });

  it('debería eliminar un producto específico del carrito', () => {
    const { getByText } = render(<Carrito carrito={mockCarrito} setCarrito={mockSetCarrito} />);
    fireEvent.click(getByText('Eliminar', { selector: 'button' }));
    expect(mockSetCarrito).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: '2' })
      ])
    );
  });

  it('debería mostrar el formulario de compra al hacer clic en Comprar', () => {
    const { getByText, getByPlaceholderText } = render(<Carrito carrito={mockCarrito} setCarrito={mockSetCarrito} />);
    fireEvent.click(getByText('Comprar'));
    expect(getByPlaceholderText('Nombre')).toBeInTheDocument();
  });
});
