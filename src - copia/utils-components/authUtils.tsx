import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

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
