import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface Props {
  /** 'HOME' | 'LOADING' | 'STORY' — la musique s'arrête quand on passe en STORY */
  appState: string;
}

export default function MagicMusicPlayer({ appState }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const attemptedRef = useRef(false);

  const base = import.meta.env.BASE_URL || '/';
  const audioSrc = `${base}audio/histoire-magique-theme.mp3`;

  // Animation des barres d'égaliseur
  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll('.eq-bar');
    if (isPlaying) {
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: () => 0.3 + Math.random() * 1,
          duration: 0.3 + Math.random() * 0.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.08,
        });
      });
    } else {
      gsap.to(bars, {
        scaleY: 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isPlaying]);

  // Auto-play dès l'arrivée (avec gestion du blocage navigateur)
  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    if (!audioRef.current) return;
    const audio = audioRef.current;

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Autoplay bloqué par le navigateur → on affiche le bouton
      setAutoplayBlocked(true);
    });
  }, []);

  // Arrêter la musique quand l'histoire est générée (STORY ou LOADING)
  useEffect(() => {
    if ((appState === 'STORY' || appState === 'LOADING') && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [appState, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // On montre toujours le bouton, comme ça l'utilisateur peut cliquer
  // L'auto-play est tenté silencieusement au cas où

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="metadata"
      />

      {/* Bouton play/pause */}
      <button
        onClick={togglePlay}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center group cursor-pointer"
        aria-label={isPlaying ? 'Mettre en pause' : 'Jouer la musique'}
        title="Musique Histoire Magique"
      >
        {/* Égaliseur animé */}
        {isPlaying && (
          <div ref={barsRef} className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-5">
            {[1,2,3,4].map(i => (
              <div
                key={i}
                className="eq-bar w-[3px] bg-amber-400/70 rounded-full"
                style={{ height: '16px', transformOrigin: 'bottom', scaleY: 0.3 }}
              />
            ))}
          </div>
        )}

        {isPlaying ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
}
