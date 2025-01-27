import React, { useState, useEffect } from 'react';
import { Cliente } from '../interfaces/ClienteInterface';
import './FacturaModale.css';

interface ClienteModaleProps {
  onClose: () => void;
}

const ClienteModale: React.FC<ClienteModaleProps> = ({ onClose }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      const parsedClientes = JSON.parse(storedClientes);
      setClientes(parsedClientes);
      setFilteredClientes(parsedClientes);
    }

    const storedClienteComprador = localStorage.getItem('clienteComprador');
    if (storedClienteComprador) {
      setSelectedCliente(JSON.parse(storedClienteComprador));
    }
  }, []);

  const handleSelectCliente = (uid: string) => {
    const cliente = filteredClientes.find(c => c.uid === uid) || null;
    setSelectedCliente(cliente);
    if (cliente) {
      localStorage.setItem('clienteComprador', JSON.stringify(cliente));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(term)
    );
    setFilteredClientes(results);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Clientes</h2>
        <input
          type="text"
          placeholder="Buscar cliente por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select onChange={(e) => handleSelectCliente(e.target.value)} defaultValue="">
          <option value="" disabled>Seleccione un cliente</option>
          {filteredClientes.map(cliente => (
            <option key={cliente.uid} value={cliente.uid}>
              {cliente.nombre}
            </option>
          ))}
        </select>
        {selectedCliente && (
          <div className="custom-grid">
            <div className="modal-field">
              <label>Nombre:</label>
              <p>{selectedCliente.nombre}</p>
            </div>
            <div className="modal-field">
              <label>Nombre Empresa:</label>
              <p>{selectedCliente.companyName}</p>
            </div>
            <div className="modal-field">
              <label>Nombre Factura:</label>
              <p>{selectedCliente.costumerEnvoiceFileName}</p>
            </div>
            <div className="modal-field">
              <label>CAI:</label>
              <p>{selectedCliente.cai}</p>
            </div>
            <div className="modal-field">
              <label>Dirección Empresa:</label>
              <p>{selectedCliente.address}</p>
            </div>
            <div className="modal-field">
              <label>Contacto Empresa:</label>
              <p>{selectedCliente.contact}</p>
            </div>
            <div className="modal-field">
              <label>Nombre Negocio:</label>
              <p>{selectedCliente.costumerBusinessName}</p>
            </div>
            <div className="modal-field">
              <label>Número Negocio:</label>
              <p>{selectedCliente.costumerBusinessWithNumber}</p>
            </div>
            <div className="modal-field">
              <label>Factura Footer:</label>
              <p>{selectedCliente.envoiceFooter}</p>
            </div>
          </div>
        )}
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
