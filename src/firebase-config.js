import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBt6H9sV0pauRjhyqKfoPxO6QbUz7mWLR0",
  authDomain: "alcobiobio-99968.firebaseapp.com",
  projectId: "alcobiobio-99968",
  storageBucket: "alcobiobio-99968.appspot.com",
  messagingSenderId: "1089350368735",
  appId: "1:1089350368735:web:aad89b162d0216e11e186a",
  measurementId: "G-HB0NVY9X3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
