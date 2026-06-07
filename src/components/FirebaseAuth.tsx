import React from 'react';
import { useAuth } from '../lib/AuthContext';

export default function FirebaseAuth() {
  const { user, loading, premium, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="text-xs text-slate-500 animate-pulse">Connexion…</div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300">
            {(user.displayName || user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <span className="text-xs text-slate-300 truncate max-w-[100px]">
          {user.displayName || user.email}
        </span>
        {premium && (
          <span className="text-[9px] uppercase tracking-widest font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
            Premium
          </span>
        )}
        <button
          onClick={logout}
          className="text-[10px] uppercase tracking-wider text-pink-400 hover:text-pink-300 cursor-pointer"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/50 text-xs font-semibold text-purple-200 rounded-xl border border-purple-500/20 transition-all active:scale-95 cursor-pointer"
    >
      <span>👤</span>
      Espace membres
    </button>
  );
}
