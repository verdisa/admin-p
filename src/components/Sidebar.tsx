import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    id: 'pos',
    label: 'POS',
    icon: 'fas fa-shopping-cart',
    path: '/pos',
    submenu: [
      {
        id: 'pos-list',
        label: 'POS',
        icon: 'fas fa-credit-card',
        path: '/pos',
      },
      /* {
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
      }, */
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
      /* {
        id: 'subcategory-list',
        label: 'Lista Sub Categorías',
        icon: 'fas fa-list-alt',
        path: '/subcategorias',
      }, */
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: 'fas fa-users',
    path: '/clientes',
    submenu: [
      {
        id: 'clientes-list',
        label: 'Lista Clientes',
        icon: 'fas fa-list',
        path: '/clientes',
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
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Cargar el estado expandido y abierto desde localStorage al montar el componente
  useEffect(() => {
    const savedExpanded = localStorage.getItem('sidebar-expanded');
    const savedIsOpen = localStorage.getItem('sidebar-is-open');
    
    if (savedExpanded) {
      try {
        const parsedExpanded = JSON.parse(savedExpanded);
        if (Array.isArray(parsedExpanded)) {
          setExpanded(parsedExpanded);
        }
      } catch (error) {
        console.warn('Error parsing sidebar expanded state:', error);
      }
    }
    
    if (savedIsOpen) {
      setIsOpen(savedIsOpen === 'true');
    }
  }, []);

  // Guardar el estado expandido en localStorage cuando cambia
  useEffect(() => {
    if (expanded.length > 0) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(expanded));
    } else {
      localStorage.removeItem('sidebar-expanded');
    }
  }, [expanded]);

  // Guardar el estado abierto/cerrado en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('sidebar-is-open', isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen(!isOpen);
    };

  const handleClickOutside = (event: MouseEvent) => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !sidebar.contains(event.target as Node) && isOpen) {
      setIsOpen(false);
      // No colapsar los submenús cuando se hace clic fuera, mantener la memoria
    }
  };

    window.addEventListener('toggleSidebar', handleToggleSidebar);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleSubmenu = (itemId: string) => {
    setExpanded(prevExpanded => {
      if (prevExpanded.includes(itemId)) {
        // Si ya está expandido, lo removemos
        return prevExpanded.filter(id => id !== itemId);
      } else {
        // Si no está expandido, lo agregamos
        return [...prevExpanded, itemId];
      }
    });
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expanded.includes(item.id);
    const isActive = location.pathname === item.path || 
                    (item.submenu && item.submenu.some(sub => location.pathname === sub.path));

    return (
      <div key={item.id}>
        <div
          className={`menu-item ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''}`}
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
            {item.submenu.map((subItem) => {
              const isSubActive = location.pathname === subItem.path;
              return (
                <Link key={subItem.id} to={subItem.path} className={`submenu-item ${isSubActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                  <i className={`${subItem.icon} submenu-icon`}></i>
                  <span className="submenu-label">{subItem.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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