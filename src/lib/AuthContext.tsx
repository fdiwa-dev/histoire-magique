import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth, isUserPremium } from './firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  premium: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  premium: false,
  login: async () => {},
  logout: async () => {},
});

// 👇 Ton email — change-le ici
const ADMIN_EMAILS = ['fdiwaassisstantbot@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Bypass admin : email dans la liste → premium direct
        if (ADMIN_EMAILS.includes(u.email || '')) {
          setPremium(true);
        } else {
          const dbPremium = await isUserPremium(u.uid);
          setPremium(dbPremium);
        }
      } else {
        setPremium(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, premium, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
