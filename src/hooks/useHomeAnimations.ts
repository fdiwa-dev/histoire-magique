import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Animations de la page d'accueil avec GSAP + ScrollTrigger.
 */
export function useHomeAnimations(containerRef: React.RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    if (!containerRef.current) return;

    const c = containerRef.current;

    // ========================
    // HERO : séquence d'entrée
    // ========================

    // Badge
    const badge = c.querySelector('#hero_badge');
    if (badge) {
      gsap.fromTo(
        badge,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }

    // Titre
    const title = c.querySelector('#hero_title');
    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }

    // Sous-titre
    const subtitle = c.querySelector('#hero_subtitle');
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.5 }
      );
    }

    // Boutons héro
    const heroBtns = c.querySelectorAll('#hero_buttons > *');
    if (heroBtns.length > 0) {
      gsap.fromTo(
        heroBtns,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12, delay: 0.7 }
      );
    }

    // ========================
    // Étoiles flottantes
    // ========================
    gsap.to(c.querySelectorAll('.float-star'), {
      y: -6,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.3, from: 'random' },
    });

    // ========================
    // Sections au scroll
    // ========================
    const sections = c.querySelectorAll('[data-scroll-section]');
    sections.forEach((section) => {
      const items = section.querySelectorAll('[data-scroll-item]');
      if (items.length === 0) return;

      // Initialiser en invisible (important : gsap.set AVANT fromTo)
      gsap.set(items, { opacity: 0, y: 30, scale: 0.97 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: { each: 0.1, from: 'start' },
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });

    // ========================
    // Section "Pourquoi Nous" (features)
    // ========================
    const featuresGrid = c.querySelector('#features_grid');
    if (featuresGrid) {
      const featureCards = featuresGrid.querySelectorAll('[data-scroll-item]');
      if (featureCards.length > 0) {
        gsap.set(featureCards, { opacity: 0, y: 30, scale: 0.95 });
        gsap.to(featureCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { each: 0.08, from: 'start' },
          scrollTrigger: {
            trigger: featuresGrid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

    // ========================
    // Section Prix
    // ========================
    const pricingGrid = c.querySelector('#pricing_grid');
    if (pricingGrid) {
      const planCards = pricingGrid.querySelectorAll('[data-scroll-item]');
      if (planCards.length > 0) {
        gsap.set(planCards, { opacity: 0, y: 30, scale: 0.95 });
        gsap.to(planCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { each: 0.1, from: 'start' },
          scrollTrigger: {
            trigger: pricingGrid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }

  }, { scope: containerRef, dependencies: [] });
}
