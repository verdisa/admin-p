import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './sidebar.css';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  submenu?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    path: '/dashboard',
    submenu: [
      {
        id: 'analytics-users',
        label: 'Analíticas Usuarios',
        icon: 'fas fa-chart-line',
        path: '/analytics-users',
      },
      {
        id: 'analytics-operators',
        label: 'Analíticas Operadores',
        icon: 'fas fa-chart-bar',
        path: '/analytics-operators',
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: 'fas fa-shopping-cart',
    path: '/ventas',
    submenu: [
      {
        id: 'ventas-list',
        label: 'Lista Ventas',
        icon: 'fas fa-list',
        path: '/ventas',
      },
      {
        id: 'cierres-list',
        label: 'Cierre de Caja',
        icon: 'fas fa-cash-register',
        path: '/cierres',
      },
      {
        id: 'pos-list',
        label: 'POS',
        icon: 'fas fa-credit-card',
        path: '/pos',
      },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventario',
    icon: 'fas fa-boxes',
    path: '/inventory',
    submenu: [
      {
        id: 'inventory-list',
        label: 'Lista Inventario',
        icon: 'fas fa-list',
        path: '/inventory',
      },
    ],
  },
  {
    id: 'products',
    label: 'Productos',
    icon: 'fas fa-box',
    path: '/productos',
    submenu: [
      {
        id: 'product-list',
        label: 'Lista Productos',
        icon: 'fas fa-list',
        path: '/productos',
      },
    ],
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: 'fas fa-th-large',
    path: '/categories',
    submenu: [
      {
        id: 'category-list',
        label: 'Lista Categorías',
        icon: 'fas fa-list',
        path: '/categorias',
      },
      {
        id: 'subcategory-list',
        label: 'Lista Sub Categorías',
        icon: 'fas fa-list-alt',
        path: '/subcategorias',
      },
    ],
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: 'fas fa-users',
    path: '/users',
    submenu: [
      {
        id: 'user-list',
        label: 'Lista Usuarios',
        icon: 'fas fa-list',
        path: '/usuarios',
      },
    ],
  },
  {
    id: 'employees',
    label: 'Empleados',
    icon: 'fas fa-user-cog',
    path: '/employees',
    submenu: [
      {
        id: 'employee-list',
        label: 'Lista Empleados',
        icon: 'fas fa-list',
        path: '/empleados',
      },
    ],
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    icon: 'fas fa-parachute-box',
    path: '/proveedores',
    submenu: [
      {
        id: 'proveedores-list',
        label: 'Lista proveedores',
        icon: 'fas fa-list',
        path: '/proveedores',
      },
    ],
  },
  {
    id: 'documentation',
    label: 'Documentación',
    icon: 'fas fa-book',
    path: '/documentation',
    submenu: [
      {
        id: 'documents',
        label: 'Documentos',
        icon: 'fas fa-file-alt',
        path: '/docs',
      },
    ],
  },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSubmenu = (itemId: string) => {
    setExpanded(expanded === itemId ? null : itemId);
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expanded === item.id;

    return (
      <div key={item.id}>
        <div
          className={`menu-item ${isExpanded ? 'expanded' : ''}`}
          onClick={() => hasSubmenu && toggleSubmenu(item.id)}
        >
          <span className="menu-item-content">
            <i className={`${item.icon} menu-icon`}></i>
            <span className="menu-label">{item.label}</span>
          </span>
          {hasSubmenu && (
            <i className={`fas fa-chevron-down menu-chevron ${isExpanded ? 'rotate' : ''}`}></i>
          )}
        </div>

        {hasSubmenu && isExpanded && item.submenu && (
          <div className="submenu">
            {item.submenu.map((subItem) => (
              <Link key={subItem.id} to={subItem.path} className="submenu-item">
                <i className={`${subItem.icon} submenu-icon`}></i>
                <span className="submenu-label">{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-bars header-icon"></i>
        <h2 className="header-title">POS</h2>
      </div>
      <nav className="menu">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;