// firebaseUtils.ts
import { deleteDoc, collection, query, where, getDocs, DocumentData, doc, updateDoc, addDoc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Subcategory, Category } from '../interfaces/subCategoriaInterface';
import { Operator } from '../interfaces/EmpleadosInterface';
import { User } from '../interfaces/UserInterface';
import { Machine } from '../interfaces/ProveedoresInterface';
import { Inventory } from '../interfaces/Inventarionterface';

export const handleDelete = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef); // Elimina el documento
    console.log(`Categoría con ID ${id} eliminada`);
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
  }
};

export const handleSave = async <T extends { id: string }>(
  collectionName: string,
  updatedRow: T
): Promise<void> => {
  try {
    const { id, ...dataToUpdate } = updatedRow; // Excluye `id` ya que no se usa en Firebase
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      await updateDoc(docRef, dataToUpdate);
      console.log(`Datos actualizados correctamente en la colección: ${collectionName}`);
    } else {
      console.error(`No se encontró el documento con ID ${id} en la colección ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error al actualizar en la colección ${collectionName}:`, error);
  }
};

export const fetchCollectionData = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchAndStoreCollectionData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => doc.data());

    if (data.length === 0) {
      throw new Error(`No hay datos en la colección ${collectionName}`);
    }

    localStorage.setItem(collectionName, JSON.stringify(data));
    console.log(`Datos de la colección ${collectionName} guardados en localStorage`);
  } catch (error) {
    console.error(`Error al obtener y guardar datos de la colección ${collectionName}: `, error);
  }
};

export const fetchSubcategoriesWithCategories = async () => {
  try {
    const localData = localStorage.getItem("subcategoriesWithCategories");
    if (localData) {
      console.log("Datos de subcategorías con categorías cargados desde localStorage");
      return JSON.parse(localData);
    }

    // 1. Primero obtenemos todas las subcategorías
    const subcategoriesQuery = query(collection(db, "subCategories"));
    const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
    const subcategories = subcategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subcategory[];

    // 2. Obtenemos todas las categorías
    const categoriesQuery = query(collection(db, "categories"));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];

    // 3. Creamos un mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map(category => [category.id, category.name])
    );

    // 4. Combinamos los datos
    const subcategoriesWithCategories = subcategories.map(subcategory => ({
      ...subcategory,
      categoryName: categoryMap.get(subcategory.IdCategory) || 'Categoría no encontrada'
    }));

    localStorage.setItem("subcategoriesWithCategories", JSON.stringify(subcategoriesWithCategories));
    console.log("Datos de subcategorías con categorías guardados en localStorage");

    return subcategoriesWithCategories;
  } catch (error) {
    console.error('Error fetching subcategories with categories:', error);
    throw error;
  }
};

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
    const combinedData = operators.map((operator) => {
      const user = users.find((user) => user.id === operator.uid); // Buscar usuario correspondiente
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

export const fetchMachinesWithUsersAndCategories = async (): Promise<Machine[]> => {
  try {
    // Intentar cargar datos de `machines`, `users` y `categories` desde localStorage
    const localMachines = localStorage.getItem("machines");
    const localUsers = localStorage.getItem("users");
    const localCategories = localStorage.getItem("categories");

    const machines = localMachines
      ? JSON.parse(localMachines)
      : await fetchCollectionData("machines"); // Obtener maquinarias de Firebase si no están en localStorage

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users"); // Obtener usuarios de Firebase si no están en localStorage

    const categories = localCategories
      ? JSON.parse(localCategories)
      : await fetchCollectionData("categories"); // Obtener categorías de Firebase si no están en localStorage

    // Guardar datos en localStorage si se obtuvieron de Firebase
    if (!localMachines) {
      localStorage.setItem("machines", JSON.stringify(machines));
    }
    if (!localUsers) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localCategories) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    // Crear un mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map((category) => [category.id, category.name])
    );

    // Combine data based on matching `uid` and `IdCategory`
    const combinedData = machines.map((machine) => {
      const user = users.find((user) => user.id === machine.uid); // Buscar usuario correspondiente
      const categoryName = categoryMap.get(machine.IdCategory) || 'Categoría no encontrada'; // Buscar categoría correspondiente
      return {
        ...machine,
        displayName: user?.displayName || "Sin Nombre", // Tomar el nombre del usuario o un valor predeterminado
        categoryName, // Tomar el nombre de la categoría o un valor predeterminado
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching or combining data:", error);
    throw error;
  }
};

export const fetchInventoriesWithUsersAndCategories = async (): Promise<Inventory[]> => {
  try {
    const localInventories = localStorage.getItem("inventories");
    const localUsers = localStorage.getItem("users");
    const localCategories = localStorage.getItem("categories");

    const inventories = localInventories
      ? JSON.parse(localInventories)
      : await fetchCollectionData("inventories");

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users");

    const categories = localCategories
      ? JSON.parse(localCategories)
      : await fetchCollectionData("categories");

    if (!localInventories) {
      localStorage.setItem("inventories", JSON.stringify(inventories));
    }
    if (!localUsers) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localCategories) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    const categoryMap = new Map(
      categories.map((category) => [category.id, category.name])
    );

    const combinedData = inventories.map((inventory) => {
      const user = users.find((user) => user.id === inventory.uid);
      const categoryName = categoryMap.get(inventory.category) || 'Categoría no encontrada';
      return {
        ...inventory,
        displayName: user?.displayName || "Sin Nombre",
        categoryName,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching or combining data:", error);
    throw error;
  }
};

export const handleAdd = async<T>(
  collectionName: string,
  data: T
): Promise<DocumentReference<DocumentData>> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
  console.log(`Nuevo documento agregado a la colección ${collectionName}`);
  return docRef;
  } catch (error) {
    console.error(`Error al agregar a la colección ${collectionName}: `, error);
  throw error;
  }
};

