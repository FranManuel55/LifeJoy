// Conexion de Firebase con la aplicacion
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLQ2ZAinof5rnCT7nNJFd3ZTI1GhDXONs",
  authDomain: "lista-de-vida.firebaseapp.com",
  projectId: "lista-de-vida",
  storageBucket: "lista-de-vida.firebasestorage.app",
  messagingSenderId: "974218051862",
  appId: "1:974218051862:web:854cded3add0d14cde1037",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize FirestoreDB and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
