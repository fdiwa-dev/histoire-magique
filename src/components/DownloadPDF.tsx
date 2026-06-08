import React, { useState } from 'react';
import { Story } from '../types';
import { FileText, Loader2, Check } from 'lucide-react';

interface DownloadPDFProps {
  story: Story;
}

/**
 * Télécharge l'histoire au format PDF.
 * Récupère les SVG depuis le DOM du flipbook (éléments #pdf-capture-*)
 * ou les génère via html2canvas sur les pages existantes.
 */
export default function DownloadPDF({ story }: DownloadPDFProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setDone(false);
    setError(null);

    try {
      const mod = await import('html2pdf.js');
      const html2pdf = mod.default || (mod as any).html2pdf || (mod as any);
      const filename = `${story.title.replace(/[^a-zA-Z0-9\u00C0-\u024F\s-]/g, '').trim().replace(/\s+/g, '_')}.pdf`;

      // Conteneur temporaire pour le rendu PDF — visible mais hors écran
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;z-index:-1;';
      container.innerHTML = getPDFHTML(story);
      document.body.appendChild(container);

      // Attendre que les polices et styles s'appliquent
      await new Promise((r) => setTimeout(r, 500));

      // Générer le PDF avec html2pdf
      const opt = {
        margin:       0,
        filename,
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#0f172a', logging: false },
        jsPDF:        { unit: 'px', format: [800, 1100], orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error('PDF error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
          done
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl'
        } disabled:opacity-60 disabled:cursor-wait`}
        aria-label="Télécharger l'histoire au format PDF"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Génération PDF...</>
        ) : done ? (
          <><Check className="w-4 h-4" /> Téléchargé !</>
        ) : (
          <><FileText className="w-4 h-4" /> Télécharger PDF ({story.pages.length} pages)</>
        )}
      </button>
      {error && (
        <p className="text-[10px] text-red-400 mt-1 text-center">
          ⚠️ Erreur : {error}
        </p>
      )}
    </>
  );
}

/** Génère le HTML complet pour le PDF (texte + SVG) */
function getPDFHTML(story: Story): string {
  const themeBg: Record<string, string> = {
    space: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0c0a3e 100%)',
    pirate: 'linear-gradient(180deg, #0f172a 0%, #172554 50%, #0c4a6e 100%)',
    dragon: 'linear-gradient(180deg, #0f172a 0%, #2e1065 50%, #1c1917 100%)',
    robot: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #2e1065 100%)',
    forest: 'linear-gradient(180deg, #0f172a 0%, #064e3b 50%, #166534 100%)',
  };
  const theme = story.themeId || story.pages[0]?.sceneType?.split('_')[0] || 'forest';

  let pagesHTML = '';

  // Couverture
  pagesHTML += `
    <div class="pdf-p" style="background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 50%,#2e1065 100%);border:3px solid #a855f7;justify-content:center;">
      <div class="pdf-title">${escapeHTML(story.title)}</div>
      <div class="pdf-subtitle">Une histoire illustrée pour ${escapeHTML(story.heroName || 'toi')}</div>
      <div class="pdf-meta">Âge : ${story.params?.ageGroup || '-'} · Style : ${story.params?.illustrationStyle || 'Réaliste'}</div>
      <div class="pdf-label">✨ Histoire Magique</div>
    </div>`;

  // Pages
  story.pages.forEach((p, i) => {
    const bg = themeBg[theme] || themeBg.forest;
    pagesHTML += `
      <div class="pdf-p" style="background:${bg}">
        <div class="pdf-num">${i + 1} / ${story.pages.length}</div>
        <div class="pdf-text">${escapeHTML(p.text)}</div>
        <div class="pdf-meta" style="color:#475569;margin-top:16px;">${escapeHTML(p.descriptionVisuelle || '')}</div>
      </div>`;
  });

  return `
    <style>
      .pdf-book { width:800px; padding:0; margin:0; background:#0f172a; color:#e2e8f0; font-family:Georgia,serif; }
      .pdf-p { width:800px; min-height:1100px; padding:40px 50px; box-sizing:border-box; page-break-after:always; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; position:relative; }
      .pdf-title { font-size:34px; font-weight:bold; color:#fbbf24; text-align:center; text-shadow:0 2px 12px rgba(251,191,36,0.3); margin-bottom:8px; }
      .pdf-subtitle { font-size:18px; color:#c4b5fd; text-align:center; margin-bottom:6px; }
      .pdf-meta { font-size:13px; color:#64748b; text-align:center; }
      .pdf-label { position:absolute; bottom:20px; font-size:12px; color:#475569; letter-spacing:2px; text-transform:uppercase; }
      .pdf-num { position:absolute; bottom:20px; right:30px; font-size:13px; color:#475569; }
      .pdf-text { font-size:24px; line-height:1.8; text-align:center; max-width:660px; margin:auto; color:#f1f5f9; }
    </style>
    <div class="pdf-book">${pagesHTML}</div>`;
}

function escapeHTML(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
