// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Categorias from './pages/Categorias';
import Empleados from './pages/Empleados';
import SubCategorias from './pages/SubCategorias';
import Docs from './pages/docs';
import Machines from './pages/Proveedores';
import InventoryPage from './pages/Inventario';
import VentasPage from './pages/Ventas';
import CierreCajaPage from './pages/CierreCaja';
import PosPage from './pages/Pos';
import ProductosPage from './pages/Productos';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/subcategorias" element={<SubCategorias />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/proveedores" element={<Machines />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/cierres" element={<CierreCajaPage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/productos" element={<ProductosPage />} />
      </Routes>
    </Router>
  );
};

export default App;
