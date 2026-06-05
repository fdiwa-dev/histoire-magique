import { useState, useEffect } from 'react';
import { Sparkles, Wand2, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const MAGICAL_STEPS = [
    "Dépoussiérage du grimoire aux histoires secrètes...",
    "Recherche d'inspiration auprès des petits lutins de la forêt...",
    "Tracé des premiers croquis à l'encre d'étoile dorée...",
    "Harmonisation de la palette d'aquarelles douces...",
    "Chuchotement des dialogues aux oreilles des personnages...",
    "Génération et séchage des illustrations magiques...",
    "Reliure de l'ouvrage avec un délicat fil de lune argenté...",
    "Saupoudrage de paillettes d'IA bienveillante...",
    "Dernier coup de baguette pour illuminer la couverture...",
    "Reliure achevée ! Ouverture du chef-d'œuvre..."
  ];

  useEffect(() => {
    // Increment progress periodically over ~12 seconds
    const intervalTime = 120; // total around 12 seconds
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    // Rotate magical step text every 1.2s to look highly reactive and creative
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MAGICAL_STEPS.length);
    }, 1200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(quoteTimer);
    };
  }, [onComplete]);

  return (
    <div
      id="magical_loader_canvas"
      className="w-full flex flex-col items-center justify-center min-h-[420px] p-6 text-center text-slate-100 relative"
    >
      {/* Background magical pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.06)_0%,_transparent_60%)] pointer-events-none"></div>

      {/* Rotating Magic Circle Symbol */}
      <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
        {/* Outer Rotating Glyph */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-amber-400/30 rounded-full"
        />
        {/* Inner Counter-rotating Glyph */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 border border-purple-500/20 rounded-full flex items-center justify-center"
        >
          <Compass className="w-12 h-12 text-purple-400/40" />
        </motion.div>
        
        {/* Core Pulsing Magic Wand */}
        <div className="absolute bg-slate-950/80 p-5 rounded-full border border-amber-400 shadow-xl shadow-amber-400/15">
          <Wand2 className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>

        {/* Floating tiny sparks */}
        <div className="absolute top-2 right-2 animate-ping">
          <Sparkles className="w-4 h-4 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute bottom-4 left-2 animate-ping" style={{ animationDelay: '0.4s' }}>
          <Sparkles className="w-4 h-4 text-pink-300 opacity-60" />
        </div>
      </div>

      <h3 className="font-serif text-2xl font-bold text-amber-400 tracking-wide mb-1 flex items-center gap-2">
        Mélange d'enchantement en cours...
      </h3>
      <p id="magic_step_text" className="text-xs text-purple-200/90 max-w-sm h-10 font-medium italic select-none">
        {MAGICAL_STEPS[quoteIndex]}
      </p>

      {/* Numerical and visual indicator progress bar */}
      <div className="w-full max-w-sm bg-slate-950 p-1.5 rounded-full border border-slate-800/80 mt-6 shadow-inner">
        <div
          id="loading_progress_bar_fill"
          className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing particle head */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-lg shadow-white animate-pulse"></div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-slate-500 mt-2 tracking-widest uppercase">
        Enchantement à {progress}% raccordé
      </div>

      {/* Interactive Skip Button */}
      <button
        id="skip_loading_btn"
        onClick={onComplete}
        className="mt-8 px-4 py-2 text-xs font-mono tracking-wider font-semibold opacity-70 hover:opacity-100 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
      >
        ⏩ Sauter l'attente (Sortilège accéléré)
      </button>
    </div>
  );
}
