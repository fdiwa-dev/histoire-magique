import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types';
import StoryIllustration from './StoryIllustrationWithPexels';
import AudioReader from './AudioReader';
import DownloadPDF from './DownloadPDF';
import { ChevronLeft, ChevronRight, BookOpen, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlipbookProps {
  story: Story;
  onRestart: () => void;
  onOpenPayment: (planName: string, price: string) => void;
  /** Mode accessibilité : lecture audio automatique */
  blindMode?: boolean;
  isPremium?: boolean;
}

export default function Flipbook({ story, onRestart, onOpenPayment, blindMode = false, isPremium = false }: FlipbookProps) {
  const [currentPage, setCurrentPage] = useState<number>(0); // 0 = Cover, 1 to 8 = Story pages
  const [readAloudActive, setReadAloudActive] = useState<boolean>(false);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);

  // Simple clean sound synthesis using Web Audio API for a magical magic chime and paper turn sound
  const playSoundEffect = (type: 'page' | 'magic') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'page') {
        // Soft white noise swipe representing paper rustling
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'magic') {
        // High crystal chime
        const now = ctx.currentTime;
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        o1.type = 'triangle';
        o1.frequency.setValueAtTime(880, now); // A5
        o1.frequency.exponentialRampToValueAtTime(1760, now + 0.4); // A6
        
        o2.type = 'sine';
        o2.frequency.setValueAtTime(1109, now); // C#6
        o2.frequency.exponentialRampToValueAtTime(2218, now + 0.4); // C#7
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        o1.connect(gainNode);
        o2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        o1.start();
        o2.start();
        o1.stop(now + 0.55);
        o2.stop(now + 0.55);
      }
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  };

  const [showPremiumPopup, setShowPremiumPopup] = useState<boolean>(false);
  const [premiumDismissed, setPremiumDismissed] = useState<boolean>(false);

  // 🔒 Popup automatique à la page 4 (0-indexed: currentPage === 3)
  useEffect(() => {
    if (currentPage === 3 && !isPremium && !premiumDismissed) {
      setShowPremiumPopup(true);
    }
  }, [currentPage, isPremium, premiumDismissed]);

  const nextPage = () => {
    if (currentPage < story.pages.length) {
      const nextPageData = story.pages[currentPage]; // 0-indexed next
      // 🔒 Blocage : pas de navigation vers une page premium si pas payé
      if (nextPageData?.isPremium && !isPremium) {
        setShowPremiumPopup(true);
        return;
      }
      setCurrentPage((prev) => prev + 1);
      if (currentPage >= 3 && !isPremium) {
        setPremiumDismissed(false); // réactiver le popup à la prochaine page premium
      }
      playSoundEffect('page');
    } else {
      // Completed, play chime
      playSoundEffect('magic');
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      playSoundEffect('page');
    }
  };

  // Simulated Read Aloud (Synthesis)
  const toggleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (readAloudActive) {
        window.speechSynthesis.cancel();
        setReadAloudActive(false);
      } else {
        window.speechSynthesis.cancel();
        if (currentPage > 0) {
          const textToSpeak = story.pages[currentPage - 1].text;
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = 'fr-FR';
          utterance.rate = 0.95;
          utterance.onend = () => setReadAloudActive(false);
          utterance.onerror = () => setReadAloudActive(false);
          window.speechSynthesis.speak(utterance);
          setReadAloudActive(true);
        } else {
          // Speak cover title
          const utterance = new SpeechSynthesisUtterance(story.title);
          utterance.lang = 'fr-FR';
          utterance.onend = () => setReadAloudActive(false);
          window.speechSynthesis.speak(utterance);
          setReadAloudActive(true);
        }
      }
    } else {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  // Copy link to clipboard
  const handleShare = () => {
    try {
      const dummyUrl = `${window.location.origin}/?storyId=${story.id}`;
      navigator.clipboard.writeText(dummyUrl);
      setShowShareNotification(true);
      playSoundEffect('magic');
      setTimeout(() => setShowShareNotification(false), 3500);
    } catch (e) {
      // backup
      alert("Lien d'histoire copié : " + `${window.location.origin}/?storyId=${story.id}`);
    }
  };

  const activePageData = currentPage > 0 ? story.pages[currentPage - 1] : null;

  return (
    <div id="flipbook_container" className="w-full flex flex-col items-center">
      {/* Top action bar */}
      <div id="top_action_bar" className="w-full max-w-5xl flex flex-wrap justify-between items-center gap-4 mb-6 px-4 py-2 bg-slate-900/40 rounded-2xl border border-purple-500/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest font-mono">
            {currentPage === 0 ? "Couverture" : `Page ${currentPage} / ${story.pages.length}`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Read aloud button - déclenche le nouveau AudioReader */}
          <button
            id="read_aloud_btn"
            onClick={toggleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
              readAloudActive
                ? 'bg-amber-500 text-slate-900 animate-pulse shadow-lg shadow-amber-500/20'
                : 'bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {readAloudActive ? "Lecture en cours..." : "M'écouter lire"}
          </button>

          <button
            id="share_button"
            onClick={handleShare}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-500/20 transition-all duration-200 cursor-pointer"
          >
            Partager
          </button>
        </div>
      </div>

      {/* Share Notification Alert */}
      <AnimatePresence>
        {showShareNotification && (
          <motion.div
            id="share_notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-2 bg-emerald-950/90 text-emerald-300 px-4 py-2.5 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10 mb-4 text-xs font-medium backdrop-blur-sm z-50 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Lien d'histoire magique copié dans le presse-papier !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flipbook Layout Main Graphic */}
      <div id="book_layout_canvas" className="w-full max-w-5xl h-[360px] sm:h-[460px] md:h-[520px] relative perspective-1000 mb-8 px-4">
        <AnimatePresence mode="wait">
          {currentPage === 0 ? (
            /* 1. CLOSED BOOK COVER */
            <motion.div
              id="book_cover_view"
              key="cover"
              initial={{ rotateY: -20, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, transition: { duration: 0.6 } }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="w-full h-full max-w-md mx-auto aspect-[3/4] bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 rounded-2xl shadow-2xl shadow-indigo-500/10 border-4 border-amber-400 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden"
              onClick={() => {
                nextPage();
                playSoundEffect('magic');
              }}
            >
              {/* Gold corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl m-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl m-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl m-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl m-1"></div>

              {/* Cover background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_65%)]"></div>

              {/* ✨ Étoiles décoratives flottantes GSAP */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 deco-star"></div>
              <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 deco-star"></div>
              <div className="absolute bottom-20 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 deco-star"></div>
              <div className="absolute top-1/3 right-4 w-2 h-2 bg-amber-300 rounded-full shadow-lg shadow-amber-300/50 deco-star"></div>
              <div className="absolute bottom-1/3 left-3 w-1 h-1 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50 deco-star"></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-emerald-300 rounded-full shadow-lg shadow-emerald-300/50 deco-star"></div>

              <div className="mt-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center border border-amber-400/30 mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wide drop-shadow-md leading-snug px-2">
                  {story.title}
                </h1>
                <p className="text-xs text-purple-200 mt-2 tracking-widest uppercase font-mono italic">
                  Édition Spéciale Premium
                </p>
              </div>

              {/* Cover vector art block */}
              <div className="w-full max-w-[200px] h-[130px] rounded-xl border border-purple-500/20 bg-slate-900/60 overflow-hidden shadow-inner flex items-center justify-center p-2 relative">
                <StoryIllustration
                  seed={story.coverImageSeed}
                  themeId={story.themeId}
                  sceneType={story.pages[0].sceneType}
                  style={story.params.illustrationStyle}
                  childName={story.heroName}
                />
              </div>

              <div className="mb-4">
                <button
                  id="open_book_cover_btn"
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-widest shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  Ouvrir l'histoire <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-purple-300 mt-2 font-mono">
                  Illustré en style <b>{story.params.illustrationStyle}</b>
                </p>
              </div>
            </motion.div>
          ) : (
            /* 2. OPENED DOUBLE-PAGE SPREAD */
            <motion.div
              id="open_spread_view"
              key={`page_${currentPage}`}
              initial={{ rotateY: 15, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full bg-[#faf6ef] text-[#2c221e] rounded-2xl shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden border-t-2 border-r border-b-4 border-l border-orange-100 relative"
            >
              {/* Realistic book spine shadow in the center (desktop only) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/10 via-black/25 to-black/10 z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -ml-[1px] bg-amber-400/30 z-20 pointer-events-none"></div>

              {/* LEFT PAGE: ILLUSTRATION (always filled in on left leaf) */}
              <div id="left_leaf_illustration" className="h-[45%] md:h-full bg-slate-950 flex items-center justify-center relative overflow-hidden p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#eddccb]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10 pointer-events-none"></div>
                
                {/* Visual style backplate wrapper */}
                <div className="w-full h-full max-w-[420px] max-h-[380px] rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400/20 flex justify-center items-center bg-transparent z-10 relative">
                  {activePageData && (
                    <StoryIllustration
                      seed={activePageData.illustrationSeed}
                      themeId={story.themeId}
                      sceneType={activePageData.sceneType}
                      style={story.params.illustrationStyle}
                      childName={story.heroName}
                      pageText={activePageData.text}
                    />
                  )}
                </div>

                {/* Subtitle leaf badge to look like real printed book */}
                <div className="absolute top-2 left-4 z-10 text-[10px] uppercase font-mono font-medium tracking-widest text-slate-300">
                  {story.title}
                </div>

                {activePageData?.isPremium && !isPremium && (
                  <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
                      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <p className="text-amber-400 font-bold text-sm text-center px-4">
                      Contenu Premium
                    </p>
                    <p className="text-slate-400 text-xs text-center px-6">
                      Débloquez toutes les pages et fonctionnalités exclusives
                    </p>
                    <button
                      onClick={() => onOpenPayment('Option PDF HD - Histoire Générée', '9.99')}
                      className="mt-1 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider"
                    >
                      Débloquer
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT PAGE: STORY TEXT AND ACTION OPTIONS */}
              <div id="right_leaf_story_text" className="h-[55%] md:h-full bg-[#fdfaf5] p-6 sm:p-8 md:p-12 flex flex-col justify-between relative">
                {/* Background watermarked pages logo */}
                <div className="absolute bottom-16 right-16 text-amber-500/5 rotate-12 select-none pointer-events-none transition-all">
                  <BookOpen className="w-56 h-56" />
                </div>

                {/* Spine shadows overlays */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>

                <div className="mt-2 flex-grow flex flex-col justify-center">
                  <span className="text-amber-500/30 text-5xl font-serif select-none leading-none -mb-3 block">“</span>
                  <p className="font-sans text-base sm:text-lg md:text-xl font-medium leading-relaxed tracking-wide text-slate-800 antialiased pr-2">
                    {/* Highlight child name inside paragraph in gold bold print */}
                    {activePageData && activePageData.text.split(story.heroName).map((part, index, arr) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < arr.length - 1 && (
                          <span className="text-purple-600 font-extrabold border-b-2 border-purple-200/50 pb-0.5">{story.heroName}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                  <span className="text-amber-500/30 text-5xl font-serif select-none leading-none -mt-3 text-right block">”</span>
                </div>

                {/* Lecteur audio complet avec voix naturelle + audiodescription */}
                {activePageData && (
                  <div className="mb-2">
                    <AudioReader
                      text={activePageData.text}
                      audiodescription={activePageData.descriptionVisuelle}
                      pageId={`${story.id}_p${currentPage}`}
                      autoPlay={blindMode}
                      lang="fr-FR"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-[#eddccb]/60">
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Histoire Magique • {story.params.ageGroup} ans
                  </div>
                  
                  {/* Decorative page number leaf */}
                  <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-xs text-amber-800 font-bold border border-amber-300/30">
                    {currentPage}
                  </div>
                </div>

                {/* Pager Buttons inside the margins representing corners to turn */}
                {/* Bottom Left backturn corner */}
                <button
                  id="corner_prev_btn"
                  onClick={prevPage}
                  className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-amber-400/5 to-amber-400/30 hover:to-amber-400/50 rounded-tr-3xl transition-all duration-300 flex items-center justify-center text-amber-800 shadow-inner group cursor-pointer"
                  title="Page précédente (Coin)"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* Bottom Right nextturn corner */}
                <button
                  id="corner_next_btn"
                  onClick={nextPage}
                  className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-bl from-amber-400/5 to-amber-400/30 hover:to-amber-400/50 rounded-tl-3xl transition-all duration-300 flex items-center justify-center text-amber-800 shadow-inner group cursor-pointer"
                  title="Page suivante (Coin)"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PREMIUM LOCK POPUP */}
      <AnimatePresence>
        {showPremiumPopup && (
          <motion.div
            id="premium_lock_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowPremiumPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-purple-500/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500"></div>
              
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center border border-amber-400/30 mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <h2 className="font-serif text-2xl font-bold text-amber-400 mb-2">
                  La suite est magique ✨
                </h2>
                <p className="text-sm text-slate-300 mb-2">
                  Cette page et les suivantes sont réservées à la version complète.
                </p>
                <p className="text-xs text-slate-400 mb-6 max-w-xs">
                  Soutenez Histoire Magique et débloquez l'intégralité du livre illustré, le PDF haute définition, et la version audio narrée.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowPremiumPopup(false);
                      onOpenPayment('Option PDF HD - Histoire Générée', '9.99');
                    }}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-400/10 transition-all cursor-pointer"
                  >
                    Débloquer l'histoire complète — 9,99 €
                  </button>
                  <button
                    onClick={() => {
                      setShowPremiumPopup(false);
                      setPremiumDismissed(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Continuer à feuilleter les pages gratuites
                  </button>
                </div>

                <p className="text-[9px] text-slate-500 mt-4 font-mono">
                  Paiement sécurisé via Lemon Squeezy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story progression bar / Navigation helpers */}
      <div id="navigation_controls" className="w-full max-w-xl flex flex-col items-center gap-4 px-4">
        {currentPage > 0 && (
          <div className="w-full flex justify-between items-center gap-4">
            <button
              id="navigation_prev_btn"
              onClick={prevPage}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all cursor-pointer border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>

            {/* Simulated progress indicators dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: story.pages.length + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx > 0) {
                      const targetPage = story.pages[idx - 1];
                      if (targetPage?.isPremium && !isPremium) {
                        onOpenPayment('Option PDF HD - Histoire Générée', '9.99');
                        return;
                      }
                    }
                    setCurrentPage(idx);
                    playSoundEffect('page');
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentPage
                      ? 'bg-amber-400 scale-125 ring-2 ring-amber-400/30'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={idx === 0 ? "Couverture" : `Page ${idx}`}
                />
              ))}
            </div>

            {currentPage < story.pages.length ? (
              <button
                id="navigation_next_btn"
                onClick={nextPage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all cursor-pointer shadow-md shadow-amber-400/10"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="story_complete_badge"
                disabled
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-default"
              >
                Finie ! <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
              </button>
            )}
          </div>
        )}

        {/* If Story Complete: Reveal Actions Section */}
        {currentPage === story.pages.length && (
          <motion.div
            id="story_complete_actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-purple-950/70 to-indigo-950/70 rounded-2xl p-6 border border-purple-500/20 text-center flex flex-col items-center mt-2.5 mb-10"
          >
            <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center border border-amber-400/30 mb-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-400 mb-2">
              Une merveilleuse histoire est née !
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
              Félicitations, vous avez donné vie à <b>{story.title}</b>. Pour prolonger la féerie, téléchargez le PDF numérique ou commandez le livre physique de prestige imprimé pour fleurir sa bibliothèque !
            </p>

            {/* Actions grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="w-full flex justify-center">
                <DownloadPDF story={story} />
              </div>

              {/* Pay trigger */}
              <button
                id="pay_book_imprime_btn"
                onClick={() => onOpenPayment("Livre imprimé prestige - " + story.title, "29.99")}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-400/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                📚 Imprimer un vrai livre (29,99€)
              </button>

              <button
                id="share_action_btn"
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs tracking-wide transition-all cursor-pointer"
              >
                🔗 Partager le lien magique
              </button>

              <button
                id="create_new_story_btn"
                onClick={onRestart}
                className="w-full py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/20 font-semibold text-xs tracking-wide transition-all cursor-pointer"
              >
                ✨ Créer une autre histoire
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
