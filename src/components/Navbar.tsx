import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar: React.FC = () => {
  const { currentAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Emitir evento para toggle sidebar
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <>
      <style>
        {`
          .navbar {
            background-color: #1a202c;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            width: 100%;
            box-sizing: border-box;
          }

          .navbar-list {
            list-style: none;
            display: flex;
            margin: 0;
            padding: 0;
          }

          .navbar-item {
            margin: 0 1rem;
          }

          .navbar-item a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            transition: background-color 0.3s;
          }

          .navbar-item a:hover {
            background-color: #555;
          }

          .navbar-item i {
            margin-right: 0.5rem;
          }

          .login-panel {
            color: white;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .login-panel button {
            color: white;
            background: none;
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
          }

          .login-panel button:hover {
            background-color: #555;
          }

          .login-icon {
            font-size: 1.5rem;
          }

          .user-info {
            font-size: 0.9rem;
            color: #cbd5e0;
          }

          .menu-toggle {
            display: none;
            color: white;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
          }

          /* Media queries para responsividad */
          @media (max-width: 768px) {
            .navbar-list {
              position: fixed;
              top: 100%;
              left: 0;
              width: 100%;
              background-color: #1a202c;
              flex-direction: column;
              transform: translateY(-100%);
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s ease;
              z-index: 999;
            }

            .navbar-list.open {
              transform: translateY(0);
              opacity: 1;
              visibility: visible;
            }

            .navbar-item {
              margin: 0;
              width: 100%;
            }

            .navbar-item a {
              justify-content: center;
              padding: 1rem;
            }

            .menu-toggle {
              display: block;
            }

            .login-panel {
              flex-direction: column;
              gap: 0.5rem;
            }

            .user-info {
              text-align: center;
            }
          }

          @media (max-width: 480px) {
            .navbar {
              padding: 0.75rem;
            }

            .navbar-item a {
              font-size: 0.9rem;
              padding: 0.75rem;
            }

            .login-panel button {
              padding: 0.4rem 0.8rem;
              font-size: 0.9rem;
            }
          }
        `}
      </style>
      <nav className="navbar">
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}>
          <li className="navbar-item">
            <Link to="/estadisticas" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-chart-pie"></i> Estadísticas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/viajes" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-route"></i> Viajes
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/vehiculos" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-car"></i> Vehículos
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/propuestas" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-lightbulb"></i> Propuestas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/notificaciones" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-bell"></i> Notificaciones
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/clientes" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-users"></i> Clientes
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/operadores" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-id-card"></i> Operadores
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/usuarios" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-user-friends"></i> Usuarios
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/documentacion" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-book"></i> Documentación
            </Link>
          </li>
        </ul>
        <div className="login-panel">
          {currentAdmin && (
            <span className="user-info">
              Bienvenido, {currentAdmin.username}
            </span>
          )}
          <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt login-icon"></i>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;