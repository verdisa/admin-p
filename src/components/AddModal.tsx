import React, { useState, useEffect } from 'react';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'checkbox';
  options?: { id: string; name: string }[];
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
        initialData[field.key] = field.options[0].id;
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
    if (key === 'IdCategory') {
      const categories = JSON.parse(localStorage.getItem("categories") || "[]");
      const found = categories.find((cat: { id: string; name: string }) => cat.id === value);
      setFormData(prev => ({ ...prev, categoryName: found ? found.name : '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    const found = categories.find((cat: { id: string; name: string }) => cat.id === formData.IdCategory);
    if (found) {
      formData.IdCategory = found.id;
      formData.categoryName = found.name;
    }
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
                  onChange={(e) => {
                    handleInputChange(field.key, e.target.value);
                    if (field.key === 'IdCategory') {
                      const categories = JSON.parse(localStorage.getItem("categories") || "[]");
                      const found = categories.find((cat: { id: string; name: string }) => cat.name === e.target.value);
                      console.log('found', found);
                      setFormData((prev) => ({
                        ...prev,
                        categoryName: found ? found.name : '',
                        IdCategory: found ? found.uid : ''

                      }));
                    }
                  }}
                >
                  <option key={`${field.key}-default`} value="">
                    Seleccione una opción
                  </option>
                  {field.options.map((option, index) => (
                    <option key={option.id || index} value={option.id}>
                      {option.name}
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
