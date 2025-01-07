import React, { useState, useEffect } from 'react';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'checkbox';
  options?: string[];
}

interface AddModalProps {
  fields: Field[];
  onSave: (data: any) => void;
  onClose: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ fields, onSave, onClose }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const initialData: { [key: string]: any } = {};
    fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        // Para campos select, usar la primera opción como valor inicial
        initialData[field.key] = field.options[0];
      } else if (field.type === 'checkbox') {
        initialData[field.key] = false;
      } else {
        initialData[field.key] = '';
      }
    });
    setFormData(initialData);
  }, [fields]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className="modal-field">
              <label>{field.label}</label>
              {field.type === 'select' && field.options ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                >
                  <option key={`${field.key}-default`} value="">
                    Seleccione una opción
                  </option>
                  {field.options.map((option, index) => (
                    <option key={`${field.key}-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
