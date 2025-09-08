// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Usuarios from './usuarios/UsuariosPage';
import CategoriasPage from './categorias/CategoriasPage';
import EmpleadosPage from './empleados/EmpleadosPage';
import SubCategorias from './subcategorias/SubCategoriasPage';
import Docs from './docs/DocsPage';
import ProveedoresPage from './proveedores/ProveedoresPage';
import InventarioPage from './inventario/InventarioPage';
import VentasPage from './ventas/VentasPage';
import CierreCajaPage from './cierre-caja/CierreCajaPage';
import HomePage from './home/HomePage';
import PosPage from './pages/Pos';
import ProductosPage from './productos/ProductosPage';
import ClientesPage from './clientes/ClientesPage';

const App: React.FC = () => {
  return (
    <Router>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<PosPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/subcategorias" element={<SubCategorias />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/inventory" element={<InventarioPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/cierres" element={<CierreCajaPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
        </Routes>
      </ProtectedRoute>
    </Router>
  );
};

export default App;
