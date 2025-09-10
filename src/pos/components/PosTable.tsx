import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductList from '../../productos/components/ProductList';
import Cart from '../../components/Cart';
import ClienteModal from '../../clientes/components/ClienteModal';
import FacturaModale from '../../components/FacturaModale';
import '../styles/PosTable.css';
import { usePos } from '../hooks/usePos';

const PosTable: React.FC = () => {
  const { cartItems, setCartItems, categories, activeCategory, setActiveCategory, addToCart, clearCart } = usePos();
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isFacturaModaleOpen, setIsFacturaModaleOpen] = useState(false);
  
  // Cargar el estado del sidebar desde localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem('posSidebarOpen');
    return savedSidebarState === 'true';
  });

  // Guardar el estado del sidebar cuando cambie
  React.useEffect(() => {
    localStorage.setItem('posSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pos-container">
        {isSidebarOpen && (
          <div className="sidebar-overlay active">
            <div className="sidebar-overlay-clickable" onClick={() => setIsSidebarOpen(false)}></div>
          </div>
        )}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="icon-menu">
            <a href="#" className="icon-menu-item" onClick={() => setIsFacturaModaleOpen(true)}>
              <i className="fas fa-file-invoice"></i>
            </a>
            <a href="#" className="icon-menu-item" onClick={() => setIsClienteModalOpen(true)}>
              <i className="fas fa-user-cog"></i>
            </a>
          </div>
          <h1>Categorías</h1>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.uid}
                className={`category-button ${activeCategory === category.uid ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.uid);
                  setIsSidebarOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="products-section">
          <div className="products-header">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i className="fas fa-bars"></i> Categorías
            </button>
            <div className="products-header-content">
              <div className="products-actions">
                <button className="action-icon" onClick={() => setIsFacturaModaleOpen(true)} title="Configurar Factura">
                  <i className="fas fa-file-invoice"></i>
                </button>
                <button className="action-icon" onClick={() => setIsClienteModalOpen(true)} title="Gestionar Cliente">
                  <i className="fas fa-user-cog"></i>
                </button>
              </div>
              <div className="products-title">
                <h1>Productos</h1>
              </div>
            </div>
          </div>
          <div className="category-tags">
            {categories.map(category => (
              <button
                key={category.uid}
                className={`category-button ${activeCategory === category.uid ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.uid)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="product-lists">
            {categories.map(category => (
              <div key={category.uid} className={activeCategory === category.uid ? 'active' : 'hidden'}>
                <ProductList category={category} addToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
        <div className="cart-section">
          <h2>Carrito de Compras</h2>
          <Cart items={cartItems} setItems={setCartItems} clearCart={clearCart} />
        </div>
      </div>
      {isClienteModalOpen && <ClienteModal onClose={() => setIsClienteModalOpen(false)} />}
      {isFacturaModaleOpen && <FacturaModale onClose={() => setIsFacturaModaleOpen(false)} />}
    </DndProvider>
  );
}
export default PosTable;