import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Ear,
  Eye,
  SkipForward,
  SkipBack,
  Settings,
  Music,
  ChevronDown,
  Check,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────

type VoiceQuality = 'elevenlabs' | 'webspeech';

interface AudioReaderProps {
  text: string;
  audiodescription?: string;
  lang?: string;
  /** Appelé quand la lecture se termine */
  onEnd?: () => void;
  /** Déclenche la lecture auto */
  autoPlay?: boolean;
  /** Identifiant de page pour le tracking */
  pageId?: string | number;
}

// ─── Voix ElevenLabs ─────────────────────────────────

const ELEVENLABS_API_KEY = 'sk_3ee…007';
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah — voix naturelle douce

/** Charge un son depuis ElevenLabs via TTS */
// Actuellement desactive — necessite une cle ElevenLabs valide
async function fetchElevenLabsAudio(
  text: string,
  voiceId: string = ELEVENLABS_VOICE_ID
): Promise<ArrayBuffer | null> {
  const truncated = text.slice(0, 2000); // limite ElevenLabs
  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: truncated,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.25,
            similarity_boost: 0.5,
            speed: 0.9,
          },
        }),
      }
    );
    if (!resp.ok) {
      console.warn('ElevenLabs API error:', resp.status, resp.statusText);
      return null;
    }
    return resp.arrayBuffer();
  } catch (e) {
    console.warn('ElevenLabs fetch failed:', e);
    return null;
  }
}

// ─── Composant Principal ─────────────────────────────

export default function AudioReader({
  text,
  audiodescription,
  lang = 'fr-FR',
  onEnd,
  autoPlay = false,
  pageId,
}: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [quality, setQuality] = useState<VoiceQuality>('webspeech'); // elevenlabs dispo si clé valide
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Nettoie tout
  const stopAll = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setLoading(false);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nettoie au démontage
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Lecture Web Speech
  const speakWebSpeech = useCallback(
    (content: string) => {
      if (!('speechSynthesis' in window)) {
        setError("Votre navigateur ne supporte pas la synthèse vocale.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setLoading(false);
        setError(null);
      };

      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        setError("Erreur de synthèse vocale.");
        setIsPlaying(false);
        setLoading(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      // Simule une progression
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(Math.min(p, 95));
        if (p >= 95) clearInterval(interval);
      }, 100);
      progressIntervalRef.current = interval;
    },
    [lang, volume, onEnd]
  );

  // Lecture ElevenLabs
  const playElevenLabs = useCallback(
    async (content: string) => {
      setLoading(true);
      setError(null);

      const buffer = await fetchElevenLabsAudio(content);
      if (!buffer) {
        // Fallback Web Speech si ElevenLabs échoue
        console.log('ElevenLabs indispo, fallback Web Speech');
        setQuality('webspeech');
        speakWebSpeech(content);
        return;
      }

      const blob = new Blob([buffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.volume = volume;
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setLoading(false);
        setIsPlaying(true);
        audio.play();
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        URL.revokeObjectURL(url);
        onEnd?.();
      };

      audio.onerror = () => {
        setLoading(false);
        setError("Erreur de lecture audio.");
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      // Suivi de progression
      let p = 0;
      const interval = setInterval(() => {
        if (audio.duration) {
          p = (audio.currentTime / audio.duration) * 100;
          setProgress(Math.min(p, 100));
        }
      }, 200);
      progressIntervalRef.current = interval;
    },
    [volume, onEnd, speakWebSpeech]
  );

  // Démarre la lecture
  const startPlayback = useCallback(() => {
    // Construit le texte complet : si audiodescription existe, on commence par la description
    const fullContent = audiodescription
      ? `[Description de l'image] ${audiodescription}. ${text}`
      : text;

    if (quality === 'elevenlabs') {
      playElevenLabs(fullContent);
    } else {
      speakWebSpeech(fullContent);
    }
  }, [text, audiodescription, quality, playElevenLabs, speakWebSpeech]);

  // Lecture auto au changement de page
  useEffect(() => {
    if (autoPlay && pageId !== undefined) {
      // Petit délai pour laisser la page se rendre
      const timer = setTimeout(() => startPlayback(), 600);
      return () => {
        clearTimeout(timer);
        stopAll();
      };
    }
  }, [autoPlay, pageId, startPlayback, stopAll]);

  // Contrôles
  const handlePlayPause = () => {
    if (isPlaying && !isPaused) {
      // Pause
      if (quality === 'webspeech' && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else if (audioRef.current) {
        audioRef.current.pause();
        setIsPaused(true);
      }
    } else if (isPaused) {
      // Resume
      if (quality === 'webspeech') {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else if (audioRef.current) {
        audioRef.current.play();
        setIsPaused(false);
      }
    } else {
      startPlayback();
    }
  };

  const handleStop = () => {
    stopAll();
  };

  const handleForward = () => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const handleBackward = () => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  return (
    <div
      className="w-full rounded-xl bg-slate-900/80 border border-purple-500/15 backdrop-blur-md overflow-hidden"
      role="region"
      aria-label="Lecteur audio. Contrôles de lecture vocale."
    >
      {/* Barre de progression */}
      <div className="h-1.5 bg-slate-800 rounded-full mx-3 mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between p-3 gap-2 flex-wrap">
        {/* Groupe gauche : infos + qualité */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Bouton lecture principal */}
          <button
            onClick={handlePlayPause}
            disabled={loading}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse'
                : 'bg-purple-700/60 hover:bg-purple-600 text-purple-200'
            } disabled:opacity-50`}
            aria-label={
              loading
                ? 'Chargement de la voix…'
                : isPlaying && !isPaused
                ? 'Mettre en pause la lecture'
                : isPaused
                ? 'Reprendre la lecture'
                : 'Lire le texte à voix haute'
            }
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              isPaused ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <span className="text-lg leading-none">⏸</span>
              )
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Badge qualité / type voix */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                quality === 'elevenlabs'
                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
              }`}
              title={
                quality === 'elevenlabs'
                  ? 'Voix naturelle premium (ElevenLabs)'
                  : 'Synthèse vocale du navigateur'
              }
            >
              {quality === 'elevenlabs' ? '🎙️ Voix Naturelle' : '🔊 Synthèse'}
            </span>
          </div>
        </div>

        {/* Groupe droit : contrôles avancés */}
        <div className="flex items-center gap-1.5">
          {/* Skip backward 10s (ElevenLabs only) */}
          {quality === 'elevenlabs' && isPlaying && (
            <>
              <button
                onClick={handleBackward}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                aria-label="Reculer de 10 secondes"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleForward}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                aria-label="Avancer de 10 secondes"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Audiodescription active */}
          {audiodescription && isPlaying && (
            <span className="text-[10px] text-purple-300 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Description visuelle</span>
            </span>
          )}

          {/* Arrêt */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-lg hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all cursor-pointer"
              aria-label="Arrêter la lecture"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Paramètres */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Paramètres audio"
              aria-expanded={showSettings}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl z-50">
                {/* Qualité de voix */}
                <div className="mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Voix
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuality('elevenlabs')}
                      className={`flex-1 text-[10px] px-2 py-1.5 rounded-lg font-semibold transition-all ${
                        quality === 'elevenlabs'
                          ? 'bg-emerald-700 text-emerald-100 border border-emerald-500'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Music className="w-3 h-3 inline mr-1" />
                      Naturelle
                    </button>
                    <button
                      onClick={() => setQuality('webspeech')}
                      className={`flex-1 text-[10px] px-2 py-1.5 rounded-lg font-semibold transition-all ${
                        quality === 'webspeech'
                          ? 'bg-amber-700 text-amber-100 border border-amber-500'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      📢 Standard
                    </button>
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Volume
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                    aria-label="Volume"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
