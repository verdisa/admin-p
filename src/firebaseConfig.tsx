// Importa las funciones necesarias desde Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDSRw8-eI1MVJA8XU0L31Faiq_vw4BMZUo',
  authDomain: 'midonki-app.firebaseapp.com',
  projectId: 'midonki-app',
  storageBucket: 'midonki-app.appspot.com',
  messagingSenderId: '750639975160',
  appId: '1:750639975160:web:3b2a69809c9aa68e67490d',
  measurementId: 'G-668W3ZKWG3',
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firestore
const db = getFirestore(app);

export { db, analytics };
