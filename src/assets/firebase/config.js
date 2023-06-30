
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyADnrrKt32a697UhpJFLaT9Ox9B64fPXkA",
  authDomain: "login-4d0ef.firebaseapp.com",
  projectId: "login-4d0ef",
  storageBucket: "login-4d0ef.appspot.com",
  messagingSenderId: "196261660288",
  appId: "1:196261660288:web:498ab86d7218f2ad814865"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

