// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA84WWMJigX9dcNJ4D6VIIakAte6IhJsz0",
  authDomain: "careermate-ai-31292.firebaseapp.com",
  databaseURL: "https://careermate-ai-31292-default-rtdb.firebaseio.com/",
  projectId: "careermate-ai-31292",
  storageBucket: "careermate-ai-31292.firebasestorage.app",
  messagingSenderId: "778112252209",
  appId: "1:778112252209:web:661e19c7a44a4717dfd810"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // ✅ Add this line
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);

export default app;
