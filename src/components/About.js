import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-12">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/alcobiobio-99968.appspot.com/o/logo2.jpg?alt=media&token=e29d4ab3-4a27-4f99-93c9-1c4dc715b14f"
            alt="AlcoBioBio Logo"
            className="w-64 h-auto"
          />
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Quienes somos</h1>
          
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <span className="font-semibold">AlcoBioBio</span>, empresa regional creada en la ciudad de Concepción, orientada a la distribución y comercialización de productos alimenticios congelados de alta calidad.
            </p>

            <p>
              Radica su estrategia de negocios en productos de calidad a precios muy competitivos y de oportunidad, lo cual nos ha permitido diferenciarnos de nuestros competidores y aumentar año a año nuestra oferta comercial.
            </p>

            <p>
              Actualmente nos especializamos en la venta de productos congelados como Arrollados, Gyozas, Pizzas y Tofu, ofreciendo una amplia variedad de opciones para satisfacer los gustos de nuestros clientes.
            </p>

            <p>
              <span className="font-semibold">AlcoBioBio</span>, una Empresa, una Marca que busca diferenciarse siempre de sus competidores, en beneficio directo de nuestros clientes.
            </p>

            {/* Valores section */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Calidad</h3>
                <p className="text-gray-600">Comprometidos con ofrecer los mejores productos congelados del mercado.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Servicio</h3>
                <p className="text-gray-600">Atención personalizada y entrega oportuna para nuestros clientes.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Innovación</h3>
                <p className="text-gray-600">Constantemente ampliando nuestra variedad de productos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}