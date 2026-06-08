import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

/**
 * Animations GSAP pour le StoryForm : apparition en cascade des champs.
 */
export function useStoryFormAnimations(formRef: React.RefObject<HTMLFormElement | null>) {
  useGSAP(() => {
    if (!formRef.current) return;

    // Animation d'entrée — chaque groupe de champs apparaît en stagger
    const fields = formRef.current.querySelectorAll(
      '.story-field-group, .story-field-group-row, #submit_magic_story_btn'
    );

    if (fields.length > 0) {
      gsap.fromTo(
        fields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: { each: 0.07, from: 'start' },
          delay: 0.1,
        }
      );
    }

    // Icône du Wand qui pulse doucement
    const wandIcon = formRef.current.querySelector('.magic-wand-icon');
    if (wandIcon) {
      gsap.to(wandIcon, {
        scale: 1.08,
        duration: 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, { scope: formRef, dependencies: [] });
}
