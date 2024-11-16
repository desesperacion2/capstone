import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBt6H9sV0pauRjhyqKfoPxO6QbUz7mWLR0",
  authDomain: "alcobiobio-99968.firebaseapp.com",
  projectId: "alcobiobio-99968",
  storageBucket: "alcobiobio-99968.appspot.com",
  messagingSenderId: "1089350368735",
  appId: "1:1089350368735:web:aad89b162d0216e11e186a",
  measurementId: "G-H0BVNY9V3X"  // Corregido aquí
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };