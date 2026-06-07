import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA1K4_XjxSC6KO7JgMYRyyjT_EcEzKgn2Y',
  authDomain: 'histoire-magique.firebaseapp.com',
  projectId: 'histoire-magique',
  storageBucket: 'histoire-magique.firebasestorage.app',
  messagingSenderId: '806301153356',
  appId: '1:806301153356:web:b0ad2453539122d99bdce9',
  measurementId: 'G-C1RGWC4E0N',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function initFirebase() {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  if (import.meta.env.DEV) {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  }

  return { app, auth, db };
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) throw new Error('Firebase not initialized. Call initFirebase() first.');
  return db;
}

export async function isUserPremium(userId: string): Promise<boolean> {
  try {
    const dbRef = getFirestoreDb();
    const userDoc = await getDoc(doc(dbRef, 'users', userId));
    return userDoc.exists() && userDoc.data()?.premium === true;
  } catch {
    return false;
  }
}

export async function markUserAsPremium(
  userId: string,
  plan: string
): Promise<void> {
  const dbRef = getFirestoreDb();
  await setDoc(
    doc(dbRef, 'users', userId),
    {
      premium: true,
      plan,
      upgradedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
