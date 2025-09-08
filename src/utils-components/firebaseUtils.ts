// firebaseUtils.ts - Funciones CRUD genéricas y autenticación
import { deleteDoc, setDoc, collection, query, where, getDocs, DocumentData, doc, updateDoc, addDoc, getDoc, DocumentReference } from "firebase/firestore";
import { db } from '../firebaseConfig';

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

