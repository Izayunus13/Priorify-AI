import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCV4hazK20A-QsGNrbT72Kw_R7SnNUm5a4",
  authDomain: "priorify-ai-119f1.firebaseapp.com",
  projectId: "priorify-ai-119f1",
  storageBucket: "priorify-ai-119f1.firebasestorage.app",
  messagingSenderId: "730513708176",
  appId: "1:730513708176:web:aeb5f2026e18bb5492f415",
  measurementId: "G-ZZQNFVZVGK",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutGoogle() {
  await signOut(auth);
}