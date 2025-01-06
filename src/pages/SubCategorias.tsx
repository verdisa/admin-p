import React from 'react';
import Navbar from '../components/Navbar';
import SubCategoriesTable from '../data-tables/SubCategoriesTable';
import Sidebar from '../components/Sidebar';
import './Categorias.css'; // Asegúrate de importar el archivo CSS

export default function SubCategorias() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <SubCategoriesTable />
      </div>
    </div>
  );
}