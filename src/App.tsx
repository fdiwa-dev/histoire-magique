import React, { useState, useRef, useCallback } from 'react';
import { Story, StoryParams } from './types';
import { generateStory, EXAMPLE_STORIES } from './data/stories';
import StoryForm from './components/StoryForm';
import LoadingScreen from './components/LoadingScreen';
import Flipbook from './components/Flipbook';

import FirebaseAuth from './components/FirebaseAuth';
import { useAuth } from './lib/AuthContext';
import AccessibilityControls, { type AccessibilitySettings } from './components/AccessibilityControls';
import { Sparkles, ArrowRight, BookOpen, Star, HelpCircle, Heart, Mail, ShieldCheck, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHomeAnimations } from './hooks/useHomeAnimations';
import StoryIllustration from './components/StoryIllustration';
import MagicMusicPlayer from './components/MagicMusicPlayer';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export default function App() {
  const { premium: authPremium, user } = useAuth();
  // Admin bypass : si l'email admin est connecté, premium = true
  const userPremium = authPremium || (user?.email === 'fdiwaassisstantbot@gmail.com');
  const [appState, setAppState] = useState<'HOME' | 'LOADING' | 'STORY'>('HOME');
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

  // Payment modal state
  const [paymentPlan, setPaymentPlan] = useState<string>('');
  const [paymentPrice, setPaymentPrice] = useState<string>('');
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  // Accessibilité
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    blindMode: false,
    largeText: false,
    highContrast: false,
    extraSpacing: false,
    keyboardMode: false,
  });

  const handleAccessibilityChange = useCallback((settings: AccessibilitySettings) => {
    setAccessibility(settings);
  }, []);

  const configuratorRef = useRef<HTMLDivElement>(null);

  const handleStartCreation = (params: StoryParams) => {
    try {
      setAppState('LOADING');
      const story = generateStory(params);
      if (!story || !story.pages || story.pages.length === 0) {
        throw new Error('Histoire générée vide');
      }
      setGeneratedStory(story);
    } catch (e) {
      console.error('Erreur handleStartCreation:', e);
      alert('Erreur : ' + (e as Error).message + '. Utilisation du mode secours.');
      const fallback = generateStory({
        titleDescription: 'Un chevalier courageux',
        childName: params.childName || 'Enfant',
        ageGroup: params.ageGroup || '5-7',
        illustrationStyle: 'rl',
        lesson: 'courage'
      });
      setGeneratedStory(fallback);
      setAppState('STORY'); // skip loader
    }
  };

  const handleLoadingComplete = () => {
    setAppState('STORY');
  };

  const handleRestart = () => {
    setAppState('HOME');
    setGeneratedStory(null);
    // Smooth scroll back to form
    setTimeout(() => {
      configuratorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerPaymentFlow = (planName: string, price: string) => {
    const LINKS: Record<string, string> = {
      "Option PDF HD - Histoire Générée": "https://miniqueue.lemonsqueezy.com/checkout/buy/6178d682-2bbb-496d-b993-e3b40fa307f3",
      "Formule Livre Imprimé Cartonné": "https://miniqueue.lemonsqueezy.com/checkout/buy/eecc1ed4-0cb8-4621-969b-56513010ab5f",
      "Pack Duo Impérial (2 Livres)": "https://miniqueue.lemonsqueezy.com/checkout/buy/2f5abf23-a73a-4730-8a7a-23c1540285ea",
    };
    const url = LINKS[planName];
    if (url) {
      // Fallback : si window.open est bloqué, on redirige la page
      const w = window.open(url, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        window.location.href = url;
      }
    }
  };

  // Mock testimonies data in French
  const TESTIMONIALS = [
    {
      name: "Aurélie M.",
      role: "Maman de Chloé (4 ans)",
      quote: "Histoire Magique est devenu le compagnon indispensable de notre rituel du coucher. Chloé adore voir son prénom dans le livre et l'illustration style Aquarelle est d'une tendresse inouïe.",
      rating: 5,
      avatarInitials: "AM"
    },
    {
      name: "Sébastien C.",
      role: "Papa de Raphaël (7 ans)",
      quote: "J'ai commandé la version imprimée prestige pour l'anniversaire de mon fils. La qualité de la couverture rigide et l'éclat des couleurs vectorielles méritent amplement 5 étoiles ! Un cadeau fantastique.",
      rating: 5,
      avatarInitials: "SC"
    },
    {
      name: "Yasmine K.",
      role: "Maman de Sirine (9 ans)",
      quote: "Le générateur a parfaitement capturé l'univers des robots proposé par ma fille Sirine. La morale sur la Différence était très touchante. Nous recommandons vivement !",
      rating: 5,
      avatarInitials: "YK"
    }
  ];

  // Réf container pour les animations GSAP
  const appRef = useRef<HTMLDivElement>(null);
  useHomeAnimations(appRef);

  return (
    <div id="housing_app" ref={appRef} className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* MAGICAL FIXED STARS DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-yellow-300 rounded-full float-star"></div>
        <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 bg-purple-400 rounded-full float-star"></div>
        <div className="absolute bottom-[20%] left-[8%] w-1 h-1 bg-blue-300 rounded-full float-star"></div>
        <div className="absolute bottom-[45%] right-[25%] w-2 h-2 bg-pink-400 rounded-full float-star opacity-50"></div>
      </div>

      {/* HEADER NAVIGATION */}
      <header id="app_header" className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={handleRestart}>
          <img src="/histoire-magique/logo-hm.svg" alt="Histoire Magique" className="w-10 h-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
          <span className="font-serif text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-100 via-purple-300 to-amber-300 bg-clip-text text-transparent tracking-wide leading-none">
            Histoire Magique
          </span>
        </div>

        <div className="flex items-center gap-3">
          <FirebaseAuth />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Thème Twilight</span>
          </div>

          <button
            id="nav_cta_btn"
            onClick={scrollToConfigurator}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Nouveau Livre
          </button>
        </div>
      </header>

      {/* RENDER DYNAMIC CORE STATES VIEWPORTS */}
      <main id="app_main_content" className="relative z-10">
        <AnimatePresence mode="wait">
          {appState === 'HOME' && (
            <motion.div
              id="home_state_view"
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* 1. HERO SECTION */}
              <section id="hero_section" data-scroll-section className="max-w-7xl mx-auto px-6 pt-12 pb-20 text-center flex flex-col items-center relative">
                {/* Floating alert discount highlight */}
                <div id="hero_badge" data-scroll-item className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enchantez sa bibliothèque dès ce soir</span>
                </div>

                <h1 id="hero_title" data-scroll-item className="font-serif text-4xl sm:text-5xl md:text-6xl font-black max-w-4xl tracking-tight leading-tight text-white select-none">
                  L'histoire parfaite pour votre enfant, <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">en 30 secondes</span>
                </h1>
                
                <p id="hero_subtitle" data-scroll-item className="font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mt-6 leading-relaxed">
                  Personnalisez un conte merveilleux à son nom avec des leçons de morale sur-mesure et des styles d'illustrations uniques. Créez un prototype de livre virtuel à feuilleter instantanément !
                </p>

                <div id="hero_buttons" className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    id="hero_cta_btn"
                    onClick={scrollToConfigurator}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-400 to-amber-400 hover:from-purple-400 hover:via-pink-300 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-purple-500/15 transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Créez votre conte gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#exemples"
                    className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all w-full sm:w-auto flex items-center justify-center gap-1.5"
                  >
                    Voir des exemples
                  </a>
                </div>

                {/* Micro social proof under banner */}
                <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span>Noté <b>4.9/5</b> par plus de 10 000 parents enchantés</span>
                </div>
              </section>

              {/* 2. SPECIFIC SECTION "COMMENT ÇA MARCHE" */}
              <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 bg-slate-950/60 border-t border-slate-900 relative">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                    Comment naît la magie ?
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Trois étapes simples pour éveiller d’incroyables récits illustrés.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div id="step_1_card" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 relative flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20 mb-4 text-lg">
                      1
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">Décrivez son univers</h3>
                    <p className="text-xs text-slate-400 leading-relaxed pr-2">
                      Saisissez une esquisse d'idée de conte, le prénom de l'enfant, son groupe d'âge et une clé de sagesse à lui transmettre pour sceller un dénouement fort.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div id="step_2_card" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 relative flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold border border-pink-500/20 mb-4 text-lg">
                      2
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">L'IA tisse la magie</h3>
                    <p className="text-xs text-slate-400 leading-relaxed pr-2">
                      Notre algorithme bienveillant assemble un conte interactif d'environ 8 à 10 pages, puis trace des peintures vectorielles selon l'esthétique artistique de votre préférence.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div id="step_3_card" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 relative flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20 mb-4 text-lg">
                      3
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">Lisez ou Commandez</h3>
                    <p className="text-xs text-slate-400 leading-relaxed pr-2">
                      Feuilletez le flipbook interactif gratuitement sur écran ! Téléchargez le PDF numérique de haute définition ou recevez un magnifique livre papier broché à l'adresse de votre choix.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. EXPERIENCE FORM CONFIGURATOR PANEL */}
              <section id="configurateur" data-scroll-section ref={configuratorRef} className="max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
                <div className="text-center mb-8">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Atelier à Sortilèges</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-slate-100">
                    Saisissez vos ingrédients
                  </h2>
                </div>
                <StoryForm onSubmit={handleStartCreation} isGenerating={false} />
              </section>

              {/* 4. SPECIFIC SECTION "EXEMPLES" */}
              <section id="exemples" className="max-w-7xl mx-auto px-6 py-20 bg-slate-950/60 border-t border-slate-900 scroll-mt-24">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                    Histoires récemment façonnées
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Franchissez le seuil de livres créés par d’autres parents et observez la variété des illustrations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {EXAMPLE_STORIES.map((ex, index) => (
                    <div
                      key={index}
                      id={`example_card_${index}`}
                      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
                      onClick={() => {
                        handleStartCreation({
                          titleDescription: ex.description,
                          childName: "Théo",
                          ageGroup: "5-7",
                          illustrationStyle: ex.style as any,
                          lesson: ex.lesson as any
                        });
                      }}
                    >
                      {/* Stylized custom SVG display mockup representing illustrated examples */}
                      <div className="w-full aspect-[4/3] bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden border-b border-slate-800">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${ex.color} opacity-40`} />
                        <div className="w-full h-full max-w-[220px] max-h-[170px] overflow-hidden rounded-xl border border-slate-800 shadow-md">
                          <StoryIllustration
                            seed={ex.imageSeed}
                            themeId={ex.imageSeed.startsWith('space') ? 'space' : ex.imageSeed.startsWith('robot') ? 'robot' : 'forest'}
                            sceneType={ex.imageSeed.startsWith('space') ? 'space_intro' : ex.imageSeed.startsWith('robot') ? 'robot_paint' : 'forest_intro'}
                            style={ex.style as any}
                          />
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <h4 className="font-serif text-xl font-bold text-slate-250 pr-1 group-hover:text-amber-400 transition-colors">
                              {ex.title}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                              {ex.age}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            {ex.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-800/60">
                          <span className="text-[10px] font-mono text-slate-400">
                            Morale : <b>{ex.lesson}</b>
                          </span>
                          <span className="text-purple-400 font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Lancer la démo <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. SPECIFIC SECTION "POURQUOI NOUS" */}
              <section id="why_us" data-scroll-section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 relative">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                    Pourquoi choisir Histoire Magique ?
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    L'excellence littéraire et technologique au service du bonheur de votre enfant.
                  </p>
                </div>

                <div id="features_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div data-scroll-item id="feature_1" className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/10 transition-all flex flex-col">
                    <div className="text-2xl mb-3 font-bold select-none text-purple-400">🎯</div>
                    <h4 className="font-serif text-base font-bold text-slate-100 mb-2">100% Personnalisé</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      L'enfant devient le héros officiel de l'aventure. Les histoires s'alignent sur son groupe d'âge pour une lecture facile et adaptée.
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div data-scroll-item id="feature_2" className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/10 transition-all flex flex-col">
                    <div className="text-2xl mb-3 font-bold select-none text-amber-400">⚡</div>
                    <h4 className="font-serif text-base font-bold text-slate-100 mb-2">Génération Flash</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Seulement 30 secondes d’attente au berceau de l’IA magique pour feuilleter tout le livre d'images de n'importe quel appareil mobile ou PC.
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div data-scroll-item id="feature_3" className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/10 transition-all flex flex-col">
                    <div className="text-2xl mb-3 font-bold select-none text-emerald-400">🌸</div>
                    <h4 className="font-serif text-base font-bold text-slate-100 mb-2">Art Dédié Bespoke</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choisissez parmi 5 styles artistiques. Les illustrations sont dessinées spécifiquement à chaque page pour donner du relief aux paysages et personnages.
                    </p>
                  </div>
                  {/* Card 4 */}
                  <div data-scroll-item id="feature_4" className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/10 transition-all flex flex-col">
                    <div className="text-2xl mb-3 font-bold select-none text-blue-400">⭐</div>
                    <h4 className="font-serif text-base font-bold text-slate-100 mb-2">Valeurs Fortes</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Chaque ouvrage se termine sur une leçon de sagesse marquante (Amitié, Courage, Partage, Différence) choisie par le parent.
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. SPECIFIC SECTION "TÉMOIGNAGES" */}
              <section id="temoignages" className="max-w-7xl mx-auto px-6 py-20 bg-slate-950/60 border-t border-slate-900 relative">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                    Les retours des lecteurs
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Plus de 10 000 parents conquis à travers la France entière.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((t, index) => (
                    <div key={index} id={`testimonial_card_${index}`} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/85 relative flex flex-col justify-between">
                      <div>
                        {/* Rating stars */}
                        <div className="flex items-center text-amber-400 gap-0.5 mb-4">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                          ))}
                        </div>
                        
                        <p className="text-xs text-slate-300 italic leading-relaxed pr-1">
                          “ {t.quote} ”
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800/60">
                        {/* Custom initials avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/25 to-indigo-500/25 border border-purple-500/30 font-bold text-xs text-purple-300 flex items-center justify-center shrink-0">
                          {t.avatarInitials}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-200">{t.name}</h5>
                          <span className="text-[10px] text-slate-500 font-mono block">{t.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. SPECIFIC SECTION "PRIX" */}
              <section id="prix" data-scroll-section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 scroll-mt-24">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                    Tarifs clairs, sans abonnement
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Lisez en ligne gratuitement ou commandez de splendides souvenirs imprimés.
                  </p>
                </div>

                <div id="pricing_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                  {/* Plan 1 */}
                  <div data-scroll-item id="pricing_plan_1" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full font-mono uppercase font-bold">Flipbook de démo</span>
                      <h4 className="font-serif text-xl font-bold text-slate-200 mt-3">Écran Gratuit</h4>
                      <div className="text-2xl font-extrabold text-slate-200 mt-2 mb-4">0 €</div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        Idéal pour tester des descriptions d'histoires illimitées et feuilleter directement à l'écran.
                      </p>
                    </div>
                    <div>
                      <ul className="text-[11px] text-slate-400 space-y-2.5 mb-6 pr-1">
                        <li>• Lecture sur pc / tablette / mobile</li>
                        <li>• Choix des leçons et des âges</li>
                        <li>• Illustrations en basse définition</li>
                        <li>• Partage par lien URL inclus</li>
                      </ul>
                      <button
                        id="select_free_plan_btn"
                        onClick={scrollToConfigurator}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-all cursor-pointer"
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>

                  {/* Plan 2 */}
                  <div data-scroll-item id="pricing_plan_2" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-1 rounded-full font-mono uppercase font-bold">Prestige Numérique</span>
                      <h4 className="font-serif text-xl font-bold text-slate-200 mt-3">PDF Haute Définition</h4>
                      <div className="text-2xl font-extrabold text-slate-200 mt-2 mb-4">9,99 €</div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        Idéal pour archiver les histoires ou les imprimer soi-même sur papier couché.
                      </p>
                    </div>
                    <div>
                      <ul className="text-[11px] text-slate-400 space-y-2.5 mb-6">
                        <li>• Toutes les fonctionnalités du gratuit</li>
                        <li>• Fichier PDF de haute précision</li>
                        <li>• Illustrations vectorielles en 4K</li>
                        <li>• Aucun filigrane Histoire Magique</li>
                      </ul>
                      <button
                        id="select_pdf_plan_btn"
                        onClick={() => triggerPaymentFlow("Option PDF HD - Histoire Générée", "9.99")}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-all cursor-pointer"
                      >
                        Acheter l'option
                      </button>
                    </div>
                  </div>

                  {/* Plan 3 - Highlighted Best Seller */}
                  <div data-scroll-item id="pricing_plan_3" className="bg-slate-900/70 p-6 rounded-2xl border-2 border-amber-400 relative flex flex-col justify-between hover:scale-[1.01] transition-all shadow-xl shadow-amber-400/5">
                    {/* Best-seller visual tag */}
                    <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-400 text-slate-950 font-mono font-bold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-md">
                      Le Cadeau Préféré 👑
                    </div>

                    <div>
                      <span className="text-[10px] bg-amber-400/20 text-amber-400 px-2 py-1 rounded-full font-mono uppercase font-bold">Livre Physique Prestige</span>
                      <h4 className="font-serif text-xl font-bold text-slate-100 mt-3">Livre Imprimé</h4>
                      <div className="text-2xl font-extrabold text-amber-400 mt-2 mb-4">29,99 €</div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-6">
                        Un authentique livre relié cartonné rigide, format poche carrée, digne des plus grands éditeurs.
                      </p>
                    </div>
                    <div>
                      <ul className="text-[11px] text-slate-300 space-y-2.5 mb-6">
                        <li>• Toutes les fonctionnalités du gratuit</li>
                        <li>• Couverture rigide satinée anti-rayures</li>
                        <li>• Véritable papier d'art 170g labellisé</li>
                        <li>• Dédicace personnalisée de l'auteur</li>
                        <li>• Livraison offerte sous 4 jours ouvrés</li>
                      </ul>
                      <button
                        id="select_printed_plan_btn"
                        onClick={() => triggerPaymentFlow("Formule Livre Imprimé Cartonné", "29.99")}
                        className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold uppercase transition-all cursor-pointer shadow-lg shadow-amber-400/10"
                      >
                        Commander
                      </button>
                    </div>
                  </div>

                  {/* Plan 4 */}
                  <div data-scroll-item id="pricing_plan_4" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div>
                      <span className="text-[10px] bg-indigo-900/40 text-indigo-300 px-2 py-1 rounded-full font-mono uppercase font-bold">Pack Fratrie Complice</span>
                      <h4 className="font-serif text-xl font-bold text-slate-200 mt-3">Pack Duo Impérial</h4>
                      <div className="text-2xl font-extrabold text-slate-200 mt-2 mb-4">39,99 €</div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        Deux livres imprimés distincts personnalisés, pour gâter des frères, sœurs ou cousins.
                      </p>
                    </div>
                    <div>
                      <ul className="text-[11px] text-slate-400 space-y-2.5 mb-6">
                        <li>• 2 livres physiques cartonnés distincts</li>
                        <li>• Deux dédicaces indépendantes</li>
                        <li>• Deux univers au libre choix</li>
                        <li>• Retranscription PDF HD offerte</li>
                        <li>• Livraison offerte sous 4 jours</li>
                      </ul>
                      <button
                        id="select_pack_plan_btn"
                        onClick={() => triggerPaymentFlow("Pack Duo Impérial (2 Livres)", "39.99")}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-all cursor-pointer"
                      >
                        Saisir le pack
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {appState === 'LOADING' && (
            <motion.div
              id="loading_state_view"
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto py-16"
            >
              <LoadingScreen onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {appState === 'STORY' && generatedStory && (
            <motion.div
              id="story_state_view"
              key="story"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-7xl mx-auto px-6 py-6"
            >
              <div className="flex justify-between items-center mb-6">
                <button
                  id="nav_back_home_btn"
                  onClick={handleRestart}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-100 transition-colors uppercase tracking-widest font-mono cursor-pointer"
                >
                  ← Retourner à l'atelier
                </button>
                <span className="text-xs text-slate-500 font-mono">
                  Style : <b className="text-amber-400">{generatedStory.params.illustrationStyle}</b>
                </span>
              </div>

              {/* Renders interactive flipbook panel */}
              <Flipbook
                story={generatedStory}
                onRestart={handleRestart}
                onOpenPayment={triggerPaymentFlow}
                blindMode={accessibility.blindMode}
                isPremium={userPremium}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <footer id="app_footer" className="bg-slate-950 border-t border-slate-900 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-serif text-lg font-bold text-slate-100 tracking-wide">
                Histoire Magique
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
              Notre ambition est d'enchanter le rituel de lecture du coucher en rapprochant les parents et les enfants autour d’ouvrages personnalisés singuliers, porteurs d’amour et de douces sagesses.
            </p>

            <div className="flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Norme de sécurité RGPD</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-600" />
                <span>Façonné avec amour</span>
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-[#a855f7] font-bold mb-4">Découvrez</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#configurateur" className="hover:text-slate-200 transition-colors">Notre Atelier</a></li>
              <li><a href="#exemples" className="hover:text-slate-200 transition-colors">Exemples de Livres</a></li>
              <li><a href="#prix" className="hover:text-slate-200 transition-colors">Leçons de Sagesse</a></li>
              <li><a href="#prix" className="hover:text-slate-200 transition-colors font-semibold text-amber-400">Tarifs & Prix</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-[#a855f7] font-bold mb-4">Contact & Légal</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="mailto:support@histoiremagique.fr" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> support@histoiremagique.fr
              </a></li>
              <li><span className="text-slate-500">Mentions Légales (Fictives)</span></li>
              <li><span className="text-slate-500">Charte de Confidentialité</span></li>
              <li><span className="text-slate-500">© 2026 Histoire Magique Inc.</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom footer credit line */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono tracking-widest">
          CONÇU PAR VOTRE CODE GÉNÉRATOR DE CONFIANCE EN GIRONDE • VERSION 1.2
        </div>
      </footer>

      {/* 🎵 Music Player */}
      <MagicMusicPlayer appState={appState} />

      {/* Panneau d'accessibilité flottant pour tous les états */}
      <AccessibilityControls onSettingsChange={handleAccessibilityChange} />


    </div>
  );
}
