import React, { useState } from 'react';
import { StoryParams, AgeGroup, IllustrationStyle, LessonType } from '../types';
import { PencilLine, Sparkles, Smile, Compass, BookOpen, Wand2 } from 'lucide-react';

interface StoryFormProps {
  onSubmit: (params: StoryParams) => void;
  isGenerating: boolean;
}

export default function StoryForm({ onSubmit, isGenerating }: StoryFormProps) {
  const [titleDescription, setTitleDescription] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('5-7');
  const [illustrationStyle, setIllustrationStyle] = useState<IllustrationStyle>('Aquarelle');
  const [lesson, setLesson] = useState<LessonType>('Amitié');

  const [validationError, setValidationError] = useState<string>('');

  // Magical suggested ideas to auto fill description
  const IDEAS = [
    { text: "Un petit dauphin bleu qui apprend à voler dans les nuages", icon: "🐬" },
    { text: "Le dinosaure gourmand à la recherche de la planète en chocolat", icon: "🦖" },
    { text: "Une fée courageuse qui cherche sa boussole d'or magique", icon: "🧚" },
    { text: "Barnabé le petit robot gris qui cherche à peindre le plus beau tableau", icon: "🤖" },
  ];

  const handleQuickIdea = (ideaText: string) => {
    setTitleDescription(ideaText);
    setValidationError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleDescription.trim()) {
      setValidationError("Oups ! S'il vous plaît, décrivez un peu le thème de l'histoire pour lancer le sortilège.");
      return;
    }
    setValidationError('');
    onSubmit({
      titleDescription: titleDescription.trim(),
      childName: childName.trim() || undefined,
      ageGroup,
      illustrationStyle,
      lesson
    });
  };

  return (
    <form
      id="story_personalization_form"
      onSubmit={handleFormSubmit}
      className="w-full bg-slate-900/50 border border-purple-500/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 relative"
    >
      {/* Decorative top arc highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-t-3xl"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center border border-purple-500/30">
          <Wand2 className="w-5 h-5 text-purple-400 animate-pulse" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            Configurez votre histoire
          </h2>
          <p className="text-xs text-slate-400">
            Chaque réglage façonne un livre d'images bespoke unique.
          </p>
        </div>
      </div>

      {/* Input 1: Story Description / Prompt */}
      <div className="mb-6">
        <label htmlFor="description_input" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <PencilLine className="w-4 h-4 text-purple-400" />
            L'idée de l'histoire <span className="text-pink-500">*</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Requis</span>
        </label>
        <textarea
          id="description_input"
          value={titleDescription}
          onChange={(e) => {
            setTitleDescription(e.target.value);
            if (e.target.value) setValidationError('');
          }}
          placeholder="Ex : Un petit lapin curieux qui voyage dans l'espace pour retrouver sa précieuse carotte dorée..."
          rows={3}
          maxLength={180}
          className="w-full px-4 py-3 bg-slate-950 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-sm transition-all resize-none outline-none focus:bg-slate-950/80"
        />

        {/* Suggested Quick buttons */}
        <div className="mt-2.5">
          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-2">
            Besoin d'inspiration ? Cliquez sur une idée :
          </p>
          <div className="flex flex-wrap gap-2">
            {IDEAS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickIdea(idea.text)}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{idea.icon}</span>
                <span className="truncate max-w-[180px] sm:max-w-xs">{idea.text}</span>
              </button>
            ))}
          </div>
        </div>

        {validationError && (
          <p className="text-xs text-pink-400 font-medium mt-2 flex items-center gap-1">
            ⚠️ {validationError}
          </p>
        )}
      </div>

      {/* Split Column layout: Child Name + Age Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Child Name (Optional) */}
        <div>
          <label htmlFor="child_name_input" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-blue-400" />
            Prénom du héros / de l'héroïne
          </label>
          <input
            id="child_name_input"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Léo / Chloé (Optionnel)"
            maxLength={15}
            className="w-full px-4 py-3 bg-slate-950 text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm transition-all outline-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Si omis, nous choisirons un tendre prénom par défaut.
          </p>
        </div>

        {/* Age Level */}
        <div>
          <span className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Âge du petit lecteur
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['2-4', '5-7', '8-10'] as AgeGroup[]).map((group) => (
              <label
                key={group}
                className={`py-3 px-3 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  ageGroup === group
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="age_group_radio"
                  value={group}
                  checked={ageGroup === group}
                  onChange={() => setAgeGroup(group)}
                  className="sr-only"
                />
                <span className="text-sm">{group} ans</span>
                <span className="text-[9px] uppercase font-mono mt-0.5 opacity-85">
                  {group === '2-4' ? 'Éveil' : group === '5-7' ? 'Junior' : 'Explorateur'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Illustration Styles Selection */}
      <div className="mb-6">
        <span className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Style d'illustration artistique de l'IA
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['Aquarelle', 'BD', 'Pixel Art', 'Crayon', 'Réaliste'] as IllustrationStyle[]).map((styleOpt) => {
            const styleBadges: Record<IllustrationStyle, string> = {
              Aquarelle: "🌸 Aquarelle",
              BD: "💥 Style BD",
              "Pixel Art": "👾 Pixel Art",
              Crayon: "✏️ Crayons",
              Réaliste: "🎨 Réaliste"
            };

            const styleDescs: Record<IllustrationStyle, string> = {
              Aquarelle: "Pastels doux",
              BD: "Encre et contrastes",
              "Pixel Art": "Style 8-bit rétro",
              Crayon: "Esquisses fines",
              Réaliste: "Vibrants vecteurs"
            };

            return (
              <label
                key={styleOpt}
                className={`py-2 px-1 text-center rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center min-h-[72px] ${
                  illustrationStyle === styleOpt
                    ? 'bg-emerald-400/15 border-emerald-400 text-emerald-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="illustration_style_radio"
                  value={styleOpt}
                  checked={illustrationStyle === styleOpt}
                  onChange={() => setIllustrationStyle(styleOpt)}
                  className="sr-only"
                />
                <span className="text-xs">{styleBadges[styleOpt]}</span>
                <span className="text-[8px] mt-0.5 opacity-70 font-mono italic">
                  {styleDescs[styleOpt]}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Optional: Story Lesson / Moral */}
      <div className="mb-8">
        <label htmlFor="lesson_select" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Leçon de sagesse ou valeur (à graver à la fin)
        </label>
        <select
          id="lesson_select"
          value={lesson}
          onChange={(e) => setLesson(e.target.value as LessonType)}
          className="w-full px-4 py-3 bg-slate-950 text-slate-300 rounded-xl border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 text-sm outline-none cursor-pointer hover:bg-slate-900"
        >
          <option value="Amitié">🤝 Amitié (Partager les aventures ensemble)</option>
          <option value="Courage">🦁 Courage (Vaincre ses craintes et avancer)</option>
          <option value="Partage">🎁 Partage (Multiplier le bonheur en offrant)</option>
          <option value="Différence">🌈 Différence (Accueillir la diversité avec bienveillance)</option>
          <option value="Aventure">🌍 Aventure (Explorer avec curiosité et respect)</option>
          <option value="Pas de leçon particulière">⭐ Pas de leçon (Une douce et tendre histoire)</option>
        </select>
      </div>

      {/* Create Button with Starry Animation */}
      <button
        id="submit_magic_story_btn"
        type="submit"
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 via-pink-400 to-amber-400 hover:from-purple-400 hover:via-pink-300 hover:to-amber-300 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-purple-500/15 text-sm uppercase tracking-widest cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span>🔮 Créer mon histoire magique</span>
        <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
      </button>

      <div className="text-center mt-3 text-[10px] text-slate-500 font-mono">
        Prend environ 30 secondes en mode d'enchantement IA (Simulé).
      </div>
    </form>
  );
}
