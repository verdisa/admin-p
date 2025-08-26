import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar: React.FC = () => {
  const { currentAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
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
        `}
      </style>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/pos">
              <i className="fas fa-shopping-cart"></i> POS
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/categorias">
              <i className="fas fa-tags"></i> Categorías
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/clientes">
              <i className="fas fa-users"></i> Clientes
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/productos">
              <i className="fas fa-box"></i> Productos
            </Link>
          </li>
          {/* <li className="navbar-item">
            <Link to="/pos">
              <i className="fas fa-credit-card"></i> POS
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/proveedores">
              <i className="fas fa-parachute-box"></i> Proveedores
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/inventory">
              <i className="fas fa-boxes"></i> Inventario
            </Link>
          </li> */}
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