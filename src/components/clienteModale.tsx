import React, { useState, useEffect } from 'react';
import { Cliente } from '../interfaces/ClienteInterface';

interface ClienteModaleProps {
  onClose: () => void;
}

const ClienteModale: React.FC<ClienteModaleProps> = ({ onClose }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    }
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Clientes</h2>
        <ul>
          {clientes.map(cliente => (
            <li key={cliente.uid}>
              {cliente.nombre} - {cliente.email}
            </li>
          ))}
        </ul>
        <div className="modal-actions">
          <button type="button" id="closebtn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteModale;
