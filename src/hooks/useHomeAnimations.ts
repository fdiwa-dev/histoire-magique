import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Page d'accueil : animations GSAP au scroll et apparitions.
 * À appeler dans App.tsx après le rendu.
 */
export function useHomeAnimations(containerRef: React.RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    if (!containerRef.current) return;

    const c = containerRef.current;

    // Titre héro avec apparition lettre par lettre
    const heroTitle = c.querySelector('#hero_title');
    if (heroTitle) {
      gsap.from(heroTitle, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    // Sous-titre
    const heroSub = c.querySelector('#hero_subtitle');
    if (heroSub) {
      gsap.from(heroSub, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.4,
      });
    }

    // Boutons héro (stagger)
    const heroBtns = c.querySelectorAll('#hero_buttons > *');
    if (heroBtns.length > 0) {
      gsap.from(heroBtns, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.6,
      });
    }

    // Étoiles décoratives flottantes
    gsap.to(c.querySelectorAll('.float-star'), {
      y: -6,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    // Apparition des sections au scroll
    const sections = c.querySelectorAll('[data-scroll-section]');
    sections.forEach((section) => {
      const items = section.querySelectorAll('[data-scroll-item]');
      if (items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    // Section features : cartes
    const features = c.querySelectorAll('#features_grid > [data-scroll-item]');
    if (features.length > 0) {
      gsap.from(features, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: features[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Section pricing
    const plans = c.querySelectorAll('#pricing_grid > [data-scroll-item]');
    if (plans.length > 0) {
      gsap.from(plans, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: plans[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: containerRef, dependencies: [] });
}
