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
    id: 'estadisticas',
    label: 'Estadísticas',
    icon: 'fas fa-chart-pie',
    path: '/estadisticas',
    submenu: [
      {
        id: 'estadisticas-list',
        label: 'Ver estadísticas',
        icon: 'fas fa-chart-bar',
        path: '/estadisticas',
      },
    ],
  },
  {
    id: 'viajes',
    label: 'Viajes',
    icon: 'fas fa-route',
    path: '/viajes',
    submenu: [
      {
        id: 'viajes-list',
        label: 'Lista Viajes',
        icon: 'fas fa-list',
        path: '/viajes',
      },
    ],
  },
  {
    id: 'vehiculos',
    label: 'Vehículos',
    icon: 'fas fa-car',
    path: '/vehiculos',
    submenu: [
      {
        id: 'vehiculos-list',
        label: 'Lista Vehículos',
        icon: 'fas fa-list',
        path: '/vehiculos',
      },
    ],
  },
  {
    id: 'propuestas',
    label: 'Propuestas',
    icon: 'fas fa-lightbulb',
    path: '/propuestas',
    submenu: [
      {
        id: 'propuestas-list',
        label: 'Lista Propuestas',
        icon: 'fas fa-list',
        path: '/propuestas',
      },
    ],
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: 'fas fa-bell',
    path: '/notificaciones',
    submenu: [
      {
        id: 'notificaciones-list',
        label: 'Lista Notificaciones',
        icon: 'fas fa-list',
        path: '/notificaciones',
      },
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
    id: 'operadores',
    label: 'Operadores',
    icon: 'fas fa-id-card',
    path: '/operadores',
    submenu: [
      {
        id: 'operadores-list',
        label: 'Lista Operadores',
        icon: 'fas fa-list',
        path: '/operadores',
      },
    ],
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: 'fas fa-user-friends',
    path: '/usuarios',
    submenu: [
      {
        id: 'usuarios-list',
        label: 'Lista Usuarios',
        icon: 'fas fa-list',
        path: '/usuarios',
      },
    ],
  },
  {
    id: 'documentacion',
    label: 'Documentación',
    icon: 'fas fa-book',
    path: '/documentacion',
    submenu: [
      {
        id: 'documentacion-list',
        label: 'Ver Documentación',
        icon: 'fas fa-book-open',
        path: '/documentacion',
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

        {hasSubmenu && (
          <div className={`submenu ${isExpanded ? 'expanded' : ''}`}>
            {item.submenu?.map((subItem) => {
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
        <h2 className="header-title">HEY TAXY ADMIN</h2>
      </div>
      <nav className="menu">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;