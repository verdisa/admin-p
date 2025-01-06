import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar: React.FC = () => {
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
          }

          .login-panel a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            transition: background-color 0.3s;
          }

          .login-panel a:hover {
            background-color: #555;
          }

          .login-icon {
            font-size: 1.5rem;
          }
        `}
      </style>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/ventas">
              <i className="fas fa-shopping-cart"></i> Ventas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/pos">
              <i className="fas fa-credit-card"></i> POS
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/productos">
              <i className="fas fa-box"></i> Productos
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
          </li>
        </ul>
        <div className="login-panel">
          <Link to="/login">
            <i className="fas fa-sign-in-alt login-icon"></i>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;