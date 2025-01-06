import { useEffect, useState } from "react";
import {
  fetchOperatorsWithUsers,
  handleSave,
} from "../utils-components/firebaseUtils";
import TableReadData from "../components/TableReadData";
import { Operator } from "../interfaces/EmpleadosInterface";

const Operators = () => {
  // Especificar el tipo explícito para evitar errores
  const [operators, setOperators] = useState<Operator[]>([]);
  const [users, setUsers] = useState<any[]>([]); // Si necesitas tipar los usuarios, define una interfaz similar
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const localData = localStorage.getItem("operatorsWithUsers");
        if (localData) {
          setOperators(JSON.parse(localData) as Operator[]); // Asegúrate de tipar el parseo
          console.log(
            "Datos de operadores con usuarios cargados desde localStorage"
          );
        } else {
          const operatorsList: Operator[] = await fetchOperatorsWithUsers();
          console.log("operatorsList", operatorsList);
          setOperators(operatorsList);
          localStorage.setItem(
            "operatorsWithUsers",
            JSON.stringify(operatorsList)
          );
          console.log(



            "Datos de operadores con usuarios cargados desde Firebase y guardados en localStorage"
          );
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };

    fetchOperators();
  }, []);

  const handleSaveOperator = async (updatedRow: Operator) => {
    try {
      await handleSave("operators", updatedRow); // Cambiado a "operators"

      setOperators((prevOperators) => {
        const updatedOperators = prevOperators.map((operator) =>
          operator.id === updatedRow.id ? updatedRow : operator
        );
        localStorage.setItem(
          "operatorsWithUsers",
          JSON.stringify(updatedOperators)
        );
        return updatedOperators;
      });

      console.log("Operador actualizado correctamente.");
    } catch (error) {
      console.error("Error al guardar el operador:", error);
    }
  };

  const columns = ["displayName", "licence", "DniBack", "DniFront"];
  const columnNames = {
    displayName: "Nombre Usuario",
    licence: "Licencia",
    DniBack: "DNI Trasero",
    DniFront: "DNI Frontal",
  };

  const editableColumns = ["licence", "DniBack", "DniFront"];

  return (
    <div className="users-container">
      <h1>Operadores</h1>

      <TableReadData
        columns={columns}
        data={operators}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveOperator}
      />
    </div>
  );
};

export default Operators;
