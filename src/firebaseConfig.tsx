// Importa las funciones necesarias desde Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDq5W5FGwE-GVjWiL1Ic2cpsenG_qocAlE",
  authDomain: "midonkipos.firebaseapp.com",
  projectId: "midonkipos",
  storageBucket: "midonkipos.firebasestorage.app",
  messagingSenderId: "477040758139",
  appId: "1:477040758139:web:7924a691c7520300b2c1de",
  measurementId: "G-3TTHN4GZND"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Authentication
const auth = getAuth(app);

export { db, analytics, auth };
