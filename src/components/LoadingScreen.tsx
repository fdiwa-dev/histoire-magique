import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const MAGICAL_STEPS = [
  'Écoute des souhaits des enfants…',
  'Préparation de la potion magique…',
  'Sélection des personnages enchantés…',
  'Tissage des mots féeriques…',
  'Illumination des couleurs merveilleuses…',
  'Enfants et créatures fabuleuses en chemin…',
  'Assemblage des ingrédients du rêve…',
  'Derrière le voile de l’imaginaire…',
  'Les étoiles alignent l’histoire…',
  'Pose des derniers scintillements…',
  'Votre histoire prend vie…',
  'Prêt pour la lecture enchantée ✨',
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Simule 3 secondes max de chargement
    const totalDuration = 3000; // 3 secondes
    const step = 100 / (totalDuration / 30); // ~30ms par tick

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, 30);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MAGICAL_STEPS.length);
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  // Quand progress atteint 100, onComplete
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => onComplete(), 300);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <div
      id="magical_loader_canvas"
      className="w-full flex flex-col items-center justify-center py-16 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Fond étincelles animées */}
      <div className="relative mb-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-purple-500/5 to-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ width: 200, height: 200 }}></div>

        {/* Icône livre magique */}
        <div className="relative w-24 h-24 bg-slate-800/60 rounded-2xl flex items-center justify-center border border-amber-400/20 shadow-lg">
          <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Anneaux orbitaux */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400/30 animate-spin" style={{ width: 180, height: 180, animationDuration: '3s' }}></div>
        <div className="absolute inset-0 rounded-full border border-transparent border-r-purple-400/20 animate-spin" style={{ width: 200, height: 200, animationDuration: '4s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Texte magique */}
      <p className="text-lg font-serif text-slate-200 animate-pulse mb-4">{MAGICAL_STEPS[quoteIndex]}</p>

      {/* Barre de progression */}
      <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 rounded-full transition-all duration-150 ease-linear"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>

      <p className="text-xs text-slate-500 mt-2 font-mono">{Math.round(progress)}%</p>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="mt-6 text-[11px] text-slate-400 underline underline-offset-2 hover:text-slate-200 transition-all cursor-pointer"
      >
        Passer la magie →
      </button>
    </div>
  );
}
