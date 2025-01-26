import React, { useState, useEffect } from 'react';

interface FacturaModaleProps {
  onClose: () => void;
}

const FacturaModale: React.FC<FacturaModaleProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "SOLUCIONES SOLARES S.A.",
    rtn: "08019014639996",
    cai: "B2EDD8-0F6781-4D4B86-8B96A2-CD3A12-D5",
    address: "Residencial Altos del Comercio\n3era cuadra izquierda 3era casa izquierda",
    contact: "Tel: +504 2705-9182 | info@solsolenergy.com",
    principalISv: 0.15,
    secundaryIsv: 0.18
  });

  useEffect(() => {
    const storedData = localStorage.getItem('facturaData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('facturaData', JSON.stringify(formData));
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Datos de la Factura</h2>
        <div className="modal-field">
          <label>Nombre de la Empresa</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>RTN</label>
          <input
            type="text"
            value={formData.rtn}
            onChange={(e) => handleInputChange('rtn', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>CAI</label>
          <input
            type="text"
            value={formData.cai}
            onChange={(e) => handleInputChange('cai', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Dirección</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Contacto</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => handleInputChange('contact', e.target.value)}
          />
        </div>
        <h3>Configuración de Impuestos</h3>
        <div className="modal-field">
          <label>ISV Principal (%)</label>
          <input
            type="number"
            value={formData.principalISv}
            onChange={(e) => handleInputChange('principalISv', parseFloat(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>ISV Secundario (%)</label>
          <input
            type="number"
            value={formData.secundaryIsv}
            onChange={(e) => handleInputChange('secundaryIsv', parseFloat(e.target.value))}
          />
        </div>
        <div className="modal-actions">
          <button type="button" id="savebtn" onClick={handleSave}>
            Guardar
          </button>
          <button type="button" id="closebtn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturaModale;
