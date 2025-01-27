import './FacturaModale.css';
import React, { useState, useEffect } from 'react';

interface FacturaModaleProps {
  onClose: () => void;
}

const FacturaModale: React.FC<FacturaModaleProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "SOLUCIONES SOLARES S.A.",
    rtn: "08019014639996",
    cai: "B2EDD8-0F6781-4D4B86-8B96A2-CD3A12-D5",
    rango: "000000000001 al 000000000100",
    address: "Residencial Altos del Comercio\n3era cuadra izquierda 3era casa izquierda",
    contact: "Tel: +504 2705-9182 | info@solsolenergy.com",
    principalISv: "15", // Valor de 0 a 100 como cadena de texto
    secundaryIsv: "18", // Valor de 0 a 100 como cadena de texto
    discountAmount: "0", // Valor de 0 a 100 como cadena de texto
    importeGravable: "0.0",
    importeExento: "0.0",
    importeExonerado: "0.0",
    companyLogo: "", // Campo para la imagen del logo
    moneda: "", // Nueva propiedad para la moneda
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, companyLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('facturaData', JSON.stringify(formData));
    window.dispatchEvent(new Event('storage'));
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content custom-modal-width">
        <h2>Datos de la Factura</h2>
        
        {/* Agrupar campos en una cuadrícula de dos columnas */}
        <div className="custom-grid">
          {/* Campos del formulario */}
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
            <label>Rango</label>
            <input
              type="text"
              value={formData.rango}
              onChange={(e) => handleInputChange('rango', e.target.value)}
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
            <label>Logo de la Empresa</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.companyLogo && (
              <img src={formData.companyLogo} alt="Company Logo" className="company-logo" />
            )}
          </div>
          
          <div className="modal-field">
            <label>Contacto</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
            />
          </div>


          <div className="modal-field">
            <label>Moneda</label>
            <input
              type="text"
              value={formData.moneda}
              onChange={(e) => handleInputChange('moneda', e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>ISV Principal (%)</label>
            <input
              type="number"
              value={formData.principalISv}
              onChange={(e) => handleInputChange('principalISv', e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>ISV Secundario (%)</label>
            <input
              type="number"
              value={formData.secundaryIsv}
              onChange={(e) => handleInputChange('secundaryIsv', e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Descuento (%)</label>
            <input
              type="number"
              value={formData.discountAmount}
              onChange={(e) => handleInputChange('discountAmount', e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Importe Gravable</label>
            <input
              type="number"
              value={formData.importeGravable}
              onChange={(e) => handleInputChange('importeGravable', e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Importe Exento</label>
            <input
              type="number"
              value={formData.importeExento}
              onChange={(e) => handleInputChange('importeExento', e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Importe Exonerado</label>
            <input
              type="number"
              value={formData.importeExonerado}
              onChange={(e) => handleInputChange('importeExonerado', e.target.value)}
            />
          </div>
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
