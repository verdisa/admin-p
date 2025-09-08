// firebaseUtils.ts
import { deleteDoc, setDoc, collection, query, where, getDocs, DocumentData, doc, updateDoc, addDoc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Subcategory, Category } from '../subcategorias/types/SubCategoriaInterface';
import { Inventory } from '../inventario/types/InventarioInterface';

// Define missing interfaces
interface Operator {
  id: string;
  uid: string;
  licence: string;
  DniBack: string;
  DniFront: string;
  displayName: string;
}

interface Machine {
  id: string;
  name: string;
  uid: string;
  IdCategory: string;
  displayName: string;
  categoryName: string;
}

export const handleDelete = async (collectionName: string, uid: string) => {
  try {
    const docRef = doc(db, collectionName, uid);
    await deleteDoc(docRef); // Elimina el documento
    console.log(`Documento con UID ${uid} eliminado`);
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
  }
};

export const handleSave = async <T extends { uid?: string }>(
  collectionName: string,
  updatedRow: T
): Promise<void> => {
  try {
    const { uid, ...dataToUpdate } = updatedRow;
    let docRef;

    if (uid) {
      docRef = doc(db, collectionName, uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        await updateDoc(docRef, dataToUpdate);
        console.log(`Datos actualizados correctamente en la colección: ${collectionName}`);
      } else {
        console.error(`No se encontró el documento con UID ${uid} en la colección ${collectionName}`);
      }
    } else {
      docRef = doc(db, collectionName);
      await setDoc(docRef, { ...dataToUpdate, uid: docRef.id });
      console.log(`Nuevo documento creado correctamente en la colección: ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error al guardar en la colección ${collectionName}:`, error);
  }
};

export const fetchCollectionData = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
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

export const fetchInventoriesWithUsersAndCategories = async (): Promise<Inventory[]> => {
  try {
    // Intentar cargar datos de `inventories`, `users` y `categories` desde localStorage
    const localInventories = localStorage.getItem("inventories");
    const localUsers = localStorage.getItem("users");
    const localCategories = localStorage.getItem("categories");

    const inventories = localInventories
      ? JSON.parse(localInventories)
      : await fetchCollectionData("inventories"); // Obtener inventarios de Firebase si no están en localStorage

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users"); // Obtener usuarios de Firebase si no están en localStorage

    const categories = localCategories
      ? JSON.parse(localCategories)
      : await fetchCollectionData("categories"); // Obtener categorías de Firebase si no están en localStorage

    // Guardar datos en localStorage si se obtuvieron de Firebase
    if (!localInventories) {
      localStorage.setItem("inventories", JSON.stringify(inventories));
    }
    if (!localUsers) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localCategories) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    // Crear un mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map((category: Category) => [category.id, category.name])
    );

    // Combine data based on matching `uid` and `IdCategory`
    const combinedData = inventories.map((inventory: any) => {
      const user = users.find((user: any) => user.id === inventory.uid); // Buscar usuario correspondiente
      const categoryName = categoryMap.get(inventory.IdCategory) || 'Categoría no encontrada'; // Buscar categoría correspondiente
      return {
        ...inventory,
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
      categories.map((category: Category) => [category.id, category.name])
    );

    // Combine data based on matching `uid` and `IdCategory`
    const combinedData = machines.map((machine: any) => {
      const user = users.find((user: any) => user.id === machine.uid); // Buscar usuario correspondiente
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



export const handleAdd = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<DocumentReference<DocumentData>> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`Nuevo documento agregado a la colección ${collectionName}`);
    return docRef;
  } catch (error) {
    console.error(`Error al agregar a la colección ${collectionName}:`, error);
    throw error;
  }
};

// Authentication functions
export interface AdminUser {
  username: string;
  password: string;
  uid?: string;
}

export const loginWithCredentials = async (username: string, password: string): Promise<AdminUser | null> => {
  try {
    const adminsQuery = query(
      collection(db, "admins"),
      where("username", "==", username),
      where("password", "==", password)
    );
    
    const querySnapshot = await getDocs(adminsQuery);
    
    if (querySnapshot.empty) {
      throw new Error("Credenciales inválidas");
    }
    
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data() as AdminUser;
    
    const adminWithUid = {
      ...adminData,
      uid: adminDoc.id
    };
    
    localStorage.setItem("currentAdmin", JSON.stringify(adminWithUid));
    
    return adminData;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    localStorage.removeItem("currentAdmin");
    localStorage.clear();
    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

export const getCurrentAdmin = (): AdminUser | null => {
  try {
    const adminData = localStorage.getItem("currentAdmin");
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error("Error al obtener admin actual:", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentAdmin() !== null;
};

