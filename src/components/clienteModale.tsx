import React, { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../interfaces/ClienteInterface';
import { handleSave } from '../utils-components/firebaseUtils';
import debounce from 'lodash.debounce';
import './FacturaModale.css';

interface ClienteModaleProps {
  onClose: () => void;
}

const ClienteModale: React.FC<ClienteModaleProps> = ({ onClose }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<string>('');

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

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const results = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(term)
      );
      setFilteredClientes(results);
      setSearching(false);
      setSearchResult(results.length > 0 ? 'Cliente encontrado' : 'No se encontraron clientes');
      if (results.length > 0) {
        handleSelectCliente(results[0].uid);
      }
    }, 300),
    [clientes]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSearching(true);
    debouncedSearch(term);
  };

  const handleInputChange = (key: string, value: any) => {
    if (selectedCliente) {
      setSelectedCliente(prev => prev ? { ...prev, [key]: value } : null);
    }
  };

  const handleSaveCliente = async () => {
    if (selectedCliente) {
      try {
        await handleSave('clientes', selectedCliente);
        const updatedClientes = clientes.map(cliente =>
          cliente.uid === selectedCliente.uid ? selectedCliente : cliente
        );
        setClientes(updatedClientes);
        localStorage.setItem('clientes', JSON.stringify(updatedClientes));
        localStorage.setItem('clienteComprador', JSON.stringify(selectedCliente));
        window.dispatchEvent(new Event('storage'));
        onClose();
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Clientes</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar cliente por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={() => debouncedSearch(searchTerm)}>Buscar</button>
        </div>
        {searching && <p>Buscando...</p>}
        {searchResult && (
          <p style={{ color: filteredClientes.length > 0 ? 'green' : 'red' }}>
            {searchResult}
          </p>
        )}
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
              <input
                type="text"
                value={selectedCliente.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Nombre Empresa:</label>
              <input
                type="text"
                value={selectedCliente.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Nombre Factura:</label>
              <input
                type="text"
                value={selectedCliente.costumerEnvoiceFileName}
                onChange={(e) => handleInputChange('costumerEnvoiceFileName', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>CAI:</label>
              <input
                type="text"
                value={selectedCliente.cai}
                onChange={(e) => handleInputChange('cai', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Dirección Empresa:</label>
              <input
                type="text"
                value={selectedCliente.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Contacto Empresa:</label>
              <input
                type="text"
                value={selectedCliente.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Nombre Negocio:</label>
              <input
                type="text"
                value={selectedCliente.costumerBusinessName}
                onChange={(e) => handleInputChange('costumerBusinessName', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Número Negocio:</label>
              <input
                type="text"
                value={selectedCliente.costumerBusinessWithNumber}
                onChange={(e) => handleInputChange('costumerBusinessWithNumber', e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Factura Footer:</label>
              <input
                type="text"
                value={selectedCliente.envoiceFooter}
                onChange={(e) => handleInputChange('envoiceFooter', e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="modal-actions">
          <button type="button" id="savebtn" onClick={handleSaveCliente}>
            Guardar
          </button>
          <button type="button" id="closebtn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteModale;
