import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  ZoomIn,
  Type,
  Keyboard,
  Ear,
  Moon,
  Sun,
  Check,
} from 'lucide-react';

interface AccessibilitySettings {
  /** Mode non-voyant : lecture audio automatique + descriptions visuelles */
  blindMode: boolean;
  /** Taille du texte agrandie */
  largeText: boolean;
  /** Contraste élevé */
  highContrast: boolean;
  /** Espacement des caractères (dyslexie) */
  extraSpacing: boolean;
  /** Navigation au clavier améliorée */
  keyboardMode: boolean;
}

interface AccessibilityControlsProps {
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  blindMode: false,
  largeText: false,
  highContrast: false,
  extraSpacing: false,
  keyboardMode: false,
};

export type { AccessibilitySettings };

export default function AccessibilityControls({
  onSettingsChange,
}: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Applique les classes CSS au body
  useEffect(() => {
    const body = document.body;
    const root = document.getElementById('housing_app');

    if (root) {
      root.classList.toggle('text-xl', settings.largeText);
      root.classList.toggle('text-2xl', settings.largeText);
      root.classList.toggle('leading-relaxed', settings.extraSpacing);
      root.classList.toggle('tracking-wider', settings.extraSpacing);
      root.classList.toggle('high-contrast', settings.highContrast);
      
      // Blind mode : cache les images décoratives
      const decorElements = root.querySelectorAll('.decorative-only');
      decorElements.forEach((el) => {
        if (settings.blindMode) {
          (el as HTMLElement).style.display = 'none';
        } else {
          (el as HTMLElement).style.display = '';
        }
      });
    }

    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const toggle = (key: keyof AccessibilitySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bouton flottant d'accessibilité */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
          settings.blindMode
            ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
            : isOpen
            ? 'bg-purple-600 text-white shadow-purple-500/30'
            : 'bg-slate-800 text-slate-300 hover:bg-purple-700 hover:text-white'
        }`}
        aria-label={
          isOpen ? 'Fermer le panneau d\'accessibilité' : 'Ouvrir le panneau d\'accessibilité'
        }
        aria-expanded={isOpen}
      >
        {settings.blindMode ? (
          <Ear className="w-6 h-6" />
        ) : (
          <Eye className="w-6 h-6" />
        )}
      </button>

      {/* Panneau d'accessibilité */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-72 bg-slate-900 border border-purple-500/20 rounded-2xl p-4 shadow-2xl backdrop-blur-md"
          role="dialog"
          aria-label="Paramètres d'accessibilité"
        >
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            Accessibilité
          </h3>

          <div className="space-y-2">
            {/* Mode non-voyant - PRIORITAIRE */}
            <ToggleOption
              icon={<Ear className="w-4 h-4" />}
              label="Lecture audio automatique"
              description="Pour enfants non-voyants : narration automatique + description des illustrations"
              active={settings.blindMode}
              onClick={() => toggle('blindMode')}
              highlight
            />

            {/* Grand texte */}
            <ToggleOption
              icon={<ZoomIn className="w-4 h-4" />}
              label="Texte agrandi"
              description="Augmente la taille du texte"
              active={settings.largeText}
              onClick={() => toggle('largeText')}
            />

            {/* Contraste élevé */}
            <ToggleOption
              icon={<Sun className="w-4 h-4" />}
              label="Contraste élevé"
              description="Améliore la lisibilité"
              active={settings.highContrast}
              onClick={() => toggle('highContrast')}
            />

            {/* Espacement dyslexie */}
            <ToggleOption
              icon={<Type className="w-4 h-4" />}
              label="Espacement large"
              description="Aide à la lecture (dyslexie)"
              active={settings.extraSpacing}
              onClick={() => toggle('extraSpacing')}
            />

            {/* Navigation clavier */}
            <ToggleOption
              icon={<Keyboard className="w-4 h-4" />}
              label="Navigation clavier"
              description="Touche Tab + Enter pour feuilleter"
              active={settings.keyboardMode}
              onClick={() => toggle('keyboardMode')}
            />
          </div>

          {/* Info ARIA active */}
          {settings.blindMode && (
            <div className="mt-3 bg-amber-900/30 border border-amber-500/20 rounded-lg p-2.5">
              <p className="text-[10px] text-amber-300 leading-relaxed">
                🎧 Mode non-voyant activé. Le texte est lu automatiquement à chaque page. 
                Les descriptions des illustrations sont incluses dans la narration.
                Utilisez les touches ← → pour naviguer entre les pages.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── Sous-composant Toggle ──

interface ToggleOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}

function ToggleOption({
  icon,
  label,
  description,
  active,
  onClick,
  highlight,
}: ToggleOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
        active
          ? highlight
            ? 'bg-amber-600/20 border border-amber-500/30'
            : 'bg-purple-600/20 border border-purple-500/30'
          : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
      }`}
      role="switch"
      aria-checked={active}
    >
      <div
        className={`p-1.5 rounded-lg ${
          active
            ? highlight
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-purple-500/20 text-purple-400'
            : 'bg-slate-800 text-slate-500'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold ${
              active ? 'text-slate-100' : 'text-slate-400'
            }`}
          >
            {label}
          </span>
          {active && (
            <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </button>
  );
}
