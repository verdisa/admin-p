import { useCierreCaja } from "../hooks/useCierreCaja";
import { CierreCaja } from "../types/CierreCajaInterface";
import TableReadData from "../../components/TableReadData";
import AddModal from "../../components/AddModal";

const CierreCajaTable = () => {
  const {
    cierres,
    isModalOpen,
    setIsModalOpen,
    handleSaveCierre,
    handleAddCierre,
    handleDeleteCierre,
    columns,
    columnNames,
    editableColumns,
  } = useCierreCaja();

  return (
    <div className="cierres-container">
      <h1>Cierre de Caja</h1>

      <TableReadData<CierreCaja>
        columns={columns}
        data={cierres}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveCierre}
        onDelete={handleDeleteCierre}
      />

      <button className="add-cierre-button" onClick={() => setIsModalOpen(true)}>
        Agregar Cierre de Caja
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "total", label: "Total" },
          ]}
          onSave={(data) => handleAddCierre(data as Omit<CierreCaja, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CierreCajaTable;
