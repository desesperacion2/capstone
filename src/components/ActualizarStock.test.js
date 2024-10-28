import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActualizarStock from './ActualizarStock';
import { db } from '../firebase-config';
import emailjs from 'emailjs-com';

// Mock de Firebase y EmailJS
jest.mock('../firebase-config', () => ({
  db: jest.fn(),
}));

jest.mock('emailjs-com', () => ({
  send: jest.fn(),
}));

describe('ActualizarStock Component', () => {
  const mockCarrito = [
    { id: 'TofuFirme', formatoSeleccionado: '500 gramos', stock: 5, cantidad: 1, descripcion: 'Tofu firme 500g', precio: 1000 },
  ];
  const mockFormularioDatos = { nombre: 'John Doe', telefono: '123456789', direccion: '123 Main St' };
  const mockOnCompraExitosa = jest.fn();

  it('debería renderizar el botón Confirmar Pedido', () => {
    const { getByText } = render(
      <ActualizarStock
        carrito={mockCarrito}
        formularioDatos={mockFormularioDatos}
        onCompraExitosa={mockOnCompraExitosa}
      />
    );
    expect(getByText('Confirmar Pedido')).toBeInTheDocument();
  });

  it('debería llamar a confirmarPedido al hacer click en Confirmar Pedido', async () => {
    const { getByText } = render(
      <ActualizarStock
        carrito={mockCarrito}
        formularioDatos={mockFormularioDatos}
        onCompraExitosa={mockOnCompraExitosa}
      />
    );
    fireEvent.click(getByText('Confirmar Pedido'));
    expect(mockOnCompraExitosa).toHaveBeenCalled();
  });

  it('debería enviar un correo de stock agotado cuando el stock es 0', () => {
    const { getByText } = render(
      <ActualizarStock
        carrito={[{ ...mockCarrito[0], stock: 0 }]}
        formularioDatos={mockFormularioDatos}
        onCompraExitosa={mockOnCompraExitosa}
      />
    );
    fireEvent.click(getByText('Confirmar Pedido'));
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_wfl68aj',
      'template_cj3dg8t',
      { to_email: 'emilioestebansuazo@gmail.com', product_name: 'Tofu firme 500g' },
      '3Fz3DdCNxBCbRv-Ga'
    );
  });

  it('debería enviar un correo de bajo stock cuando el stock es <= 4', () => {
    const { getByText } = render(
      <ActualizarStock
        carrito={[{ ...mockCarrito[0], stock: 4 }]}
        formularioDatos={mockFormularioDatos}
        onCompraExitosa={mockOnCompraExitosa}
      />
    );
    fireEvent.click(getByText('Confirmar Pedido'));
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_wfl68aj',
      'template_nxgfcmt',
      { to_email: 'emilioestebansuazo@gmail.com', product_name: 'Tofu firme 500g', stock_quantity: 4 },
      '3Fz3DdCNxBCbRv-Ga'
    );
  });
});
