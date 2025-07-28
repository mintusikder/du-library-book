// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwIGWEBJh158M7HAFjuulKiXUM7tJBsKQ",
  authDomain: "du-library-10fb0.firebaseapp.com",
  projectId: "du-library-10fb0",
  storageBucket: "du-library-10fb0.firebasestorage.app",
  messagingSenderId: "594255992488",
  appId: "1:594255992488:web:1ee8edf4d5830f584f949d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
