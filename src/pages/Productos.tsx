import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductosTable from '../data-tables/ProductosTable';

const ProductosPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="productos-container">
        <Sidebar />
        <div className="content">
          <h1>Gestión de Productos</h1>
          <ProductosTable />
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;
