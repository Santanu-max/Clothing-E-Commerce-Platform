import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginonecart-465be.firebaseapp.com",
  projectId: "loginonecart-465be",
  storageBucket: "loginonecart-465be.firebasestorage.app",
  messagingSenderId: "469128245910",
  appId: "1:469128245910:web:53f966574983d426ccc8b7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export { auth, provider }