import React, { useState, useEffect } from 'react';
import { Cliente } from '../interfaces/ClienteInterface';

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
          <div className="cliente-details">
            <h3>Detalles del Cliente</h3>
            <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
            <p><strong>Nombre Empresa:</strong> {selectedCliente.companyName}</p>
            <p><strong>CAI:</strong> {selectedCliente.cai}</p>
            <p><strong>Dirección Empresa:</strong> {selectedCliente.address}</p>
            <p><strong>Contacto Empresa:</strong> {selectedCliente.contact}</p>
            <p><strong>Número Factura:</strong> {selectedCliente.invoiceNumber}</p>
            <p><strong>Nombre Negocio:</strong> {selectedCliente.costumerBusinessName}</p>
            <p><strong>Número Negocio:</strong> {selectedCliente.costumerBusinessWithNumber}</p>
            <p><strong>Factura Footer:</strong> {selectedCliente.envoiceFooter}</p>
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
