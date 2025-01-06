import React, { useState } from 'react';

interface AddModalProps {
  fields: { key: string; label: string; type?: string; options?: any[] }[]; // Campos dinámicos (clave, etiqueta, tipo y opciones)
  onSave: (data: { [key: string]: any }) => void; // Función para manejar el guardado
  onClose: () => void; // Función para cerrar el modal
}

const AddModal: React.FC<AddModalProps> = ({ fields, onSave, onClose }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar Nuevo</h2>
        {fields.map((field) => (
          <div key={field.key} className="modal-field">
            <label>{field.label}</label>
            {/* Si el campo es de tipo select */}
            {field.type === 'select' ? (
              <select
                name={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                {field.options?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              // Si no es un select, mostramos un input normal
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
