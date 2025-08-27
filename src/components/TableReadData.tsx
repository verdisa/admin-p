import React, { useState } from 'react';
import './TableReadData.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importar FontAwesome

interface TableReadDataProps<T = { [key: string]: any }> {
  columns: string[];
  data: T[];
  columnNames?: { [key: string]: string };
  columnRenderers?: { [key: string]: (value: any, row: T) => React.ReactNode };
  editableColumns?: string[]; // Nueva propiedad para especificar columnas editables
  onSave?: (updatedRow: T) => void;
  onDelete?: (uid: string) => void; // Función para manejar la eliminación
}

const TableReadData = <T extends { [key: string]: any }>(
  {
    columns,
    data,
    columnNames = {},
    columnRenderers = {},
    editableColumns = [], // Valor predeterminado: todas las columnas no son editables
    onSave,
    onDelete, // Recibimos la función onDelete
  }: TableReadDataProps<T>
) => {
  const [editValue, setEditValue] = useState<{ [key: string]: any }>({});
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});

  const defaultRenderer = (value: any, _column: string) => {
    if (typeof value === 'boolean') {
      return value ? <i className="fas fa-check check-icon"></i> : null;
    }
    if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
      return date.toLocaleDateString();
    }
    return value ?? '';
  };

  const handleEditSave = (rowIndex: number, column: string) => {
    const key = `${rowIndex}-${column}`;
    if (onSave && editValue[key] !== undefined) {
      const updatedRow = { ...data[rowIndex], [column]: editValue[key] };
      onSave(updatedRow);
      setEditValue((prev) => {
        const newEditValue = { ...prev };
        delete newEditValue[key];
        return newEditValue;
      });
      setEditing((prev) => {
        const newEditing = { ...prev };
        delete newEditing[key];
        return newEditing;
      });
    }
  };

  return (
    <table className="users-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{columnNames[column] || column}</th>
          ))}
          {onDelete && <th>Acciones</th>} {/* Columna de acciones */}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => {
              const key = `${rowIndex}-${column}`;
              const isEditing = editing[key];
              const columnRenderer = columnRenderers[column];
              const isEditable = editableColumns.includes(column);

              return (
                <td key={column} className={isEditable ? '' : 'non-editable-cell'}>
                  {isEditable && isEditing ? (
                    <input
                      type="text"
                      value={editValue[key] ?? row[column] ?? ''}
                      onChange={(e) =>
                        setEditValue((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      onBlur={() => handleEditSave(rowIndex, column)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(rowIndex, column);
                      }}
                    />
                  ) : (
                    <div
                      onClick={() =>
                        isEditable && setEditing((prev) => ({ ...prev, [key]: true }))
                      }
                      style={{ cursor: isEditable ? 'pointer' : 'not-allowed' }}
                    >
                      {columnRenderer
                        ? columnRenderer(row[column], row)
                        : defaultRenderer(row[column], column)}
                    </div>
                  )}
                </td>
              );
            })}
            {/* Columna de Acciones */}
            {onDelete && (
              <td className="actions-cell">
                <button
                  className="delete-button"
                  onClick={() => onDelete(row.uid)} // Llamar la función de eliminar
                >
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableReadData;