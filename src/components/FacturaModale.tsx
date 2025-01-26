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
    principalISv: 15, // Valor de 0 a 100
    secundaryIsv: 18, // Valor de 0 a 100
    discountAmount: 0, // Valor de 0 a 100
    importeGravable: 0.0,
    importeExento: 0.0,
    importeExonerado: 0.0,
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
    if (key === 'moneda') {
      setFormData(prev => ({ ...prev, [key]: value }));
      return;
    }
    let val = parseInt(value, 10);
    if (key === 'principalISv' || key === 'secundaryIsv' || key === 'discountAmount') {
      if (val < 0) val = 0;
      if (val > 100) val = 100;
    }
    setFormData(prev => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
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
          <label>Contacto</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => handleInputChange('contact', e.target.value)}
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
            <img src={formData.companyLogo} alt="Company Logo" style={{ width: '100px', height: '100px' }} />
          )}
        </div>
        <div className="modal-field">
          <label>Moneda</label>
          <input
            type="text"
            value={formData.moneda}
            onChange={(e) => handleInputChange('moneda', e.target.value)}
          />
        </div>
        <h3>Configuración de Impuestos</h3>
        <div className="modal-field">
          <label>ISV Principal (%)</label>
          <input
            type="number"
            value={formData.principalISv}
            onChange={(e) => handleInputChange('principalISv', parseInt(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>ISV Secundario (%)</label>
          <input
            type="number"
            value={formData.secundaryIsv}
            onChange={(e) => handleInputChange('secundaryIsv', parseInt(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>Descuento (%)</label>
          <input
            type="number"
            value={formData.discountAmount}
            onChange={(e) => handleInputChange('discountAmount', parseInt(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>Importe Gravable</label>
          <input
            type="number"
            value={formData.importeGravable}
            onChange={(e) => handleInputChange('importeGravable', parseFloat(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>Importe Exento</label>
          <input
            type="number"
            value={formData.importeExento}
            onChange={(e) => handleInputChange('importeExento', parseFloat(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label>Importe Exonerado</label>
          <input
            type="number"
            value={formData.importeExonerado}
            onChange={(e) => handleInputChange('importeExonerado', parseFloat(e.target.value))}
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
