// empleados/services/empleadosService.ts
import { fetchCollectionData } from '../../../utils-components/firebaseUtils';

// Interfaces locales para evitar problemas de importación
interface Operator {
  id: string;
  uid: string;
  licence: string;
  DniBack: string;
  DniFront: string;
  displayName?: string;
}

export const fetchOperatorsWithUsers = async (): Promise<Operator[]> => {
  try {
    // Intentar cargar datos de `users` y `operators` desde localStorage
    const localOperators = localStorage.getItem("operators");
    const localUsers = localStorage.getItem("users");

    const operators = localOperators
      ? JSON.parse(localOperators)
      : await fetchCollectionData("operators"); // Obtener operadores de Firebase si no están en localStorage

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users"); // Obtener usuarios de Firebase si no están en localStorage

    // Guardar datos en localStorage si se obtuvieron de Firebase
    if (!localOperators) {
      localStorage.setItem("operators", JSON.stringify(operators));
    }
    if (!localUsers) {
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Combine data based on matching `uid`
    const combinedData = operators.map((operator: any) => {
      const user = users.find((user: any) => user.id === operator.uid); // Buscar usuario correspondiente
      return {
        id: operator.id, // Mantener el `id` del operador
        uid: operator.uid, // Mantener el `uid` del operador
        licence: operator.licence, // Mantener la licencia
        DniBack: operator.DniBack, // Mantener el DNI trasero
        DniFront: operator.DniFront, // Mantener el DNI frontal
        displayName: user?.displayName || "Sin Nombre", // Tomar el nombre del usuario o un valor predeterminado
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching or combining data:", error);
    throw error;
  }
};
