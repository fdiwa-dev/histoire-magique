import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  error: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  premium: false,
  login: async () => {},
  logout: async () => {},
  error: null,
});

// 👇 Ton email — change-le ici
const ADMIN_EMAILS = ['fdiwaassisstantbot@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    // Handle redirect result (page reload after redirect auth)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('[Auth] Redirect login success:', result.user.email);
      }
    }).catch((err) => {
      console.warn('[Auth] Redirect result error:', err.code, err.message);
    });

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setError(null);
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
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn('[Auth] Popup failed, trying redirect:', err.code, err.message);

      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        // Popup bloqué → fallback redirect
        await signInWithRedirect(auth, provider);
      } else {
        const msg = err.code === 'auth/unauthorized-domain'
          ? 'Domaine non autorisé. Le domaine fdiwa-dev.github.io doit être ajouté dans Firebase Console > Authentication > Settings > Authorized domains.'
          : 'Erreur de connexion: ' + (err.message || 'inconnue');
        setError(msg);
      }
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, premium, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
