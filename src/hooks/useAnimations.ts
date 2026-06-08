import { useRef, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Anime l'apparition d'éléments au scroll avec stagger.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, deps: any[] = []) {
  useGSAP(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll('[data-reveal]');
    if (items.length === 0) return;
    
    gsap.from(items, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: ref.current, dependencies: deps });
}

/**
 * Fait flotter des éléments décoratifs (étoiles, sparkles).
 */
export function useFloatAnimation(ref: RefObject<HTMLElement | null>, speed: number = 3) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    
    gsap.to(el, {
      y: -8,
      duration: speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    
    return () => {
      gsap.killTweensOf(el);
    };
  }, [ref, speed]);
}

/**
 * Animation d'entrée pour le flipbook : les pages apparaissent avec un effet de profondeur.
 */
export function usePageEnter(pageRef: RefObject<HTMLDivElement | null>, index: number) {
  useEffect(() => {
    if (!pageRef.current) return;
    
    gsap.fromTo(
      pageRef.current,
      { 
        opacity: 0, 
        rotationY: index % 2 === 0 ? -15 : 15, 
        x: index % 2 === 0 ? -30 : 30,
        transformPerspective: 1200,
      },
      {
        opacity: 1,
        rotationY: 0,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: index * 0.08,
      }
    );
  }, [pageRef, index]);
}

/**
 * Texte qui apparaît lettre par lettre (style storytelling).
 */
export function useTypewriter(ref: RefObject<HTMLElement | null>, text: string, speed: number = 0.03) {
  useEffect(() => {
    if (!ref.current) return;
    
    const el = ref.current;
    el.textContent = '';
    
    const chars = text.split('');
    let i = 0;
    
    const tl = gsap.timeline();
    chars.forEach((char) => {
      tl.to(el, {
        duration: speed,
        onUpdate: () => {
          el.textContent = text.substring(0, Math.floor(i));
          i += 0.3;
        },
      });
    });
    
    tl.to(el, { duration: 0.1, onComplete: () => { el.textContent = text; } });
    
    return () => tl.kill();
  }, [ref, text, speed]);
}

/**
 * Particules magiques (étoiles qui montent et disparaissent).
 */
export function useMagicParticles(containerRef: RefObject<HTMLElement | null>, active: boolean, count: number = 15) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'absolute w-1.5 h-1.5 rounded-full pointer-events-none';
      p.style.cssText = `
        background: ${['#fbbf24', '#a855f7', '#ec4899', '#22d3ee', '#34d399'][Math.floor(Math.random() * 5)]};
        box-shadow: 0 0 6px currentColor;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
      `;
      container.appendChild(p);
      particles.push(p);
      
      gsap.set(p, {
        x: Math.random() * container.offsetWidth,
        y: container.offsetHeight + Math.random() * 50,
        opacity: 0.7 + Math.random() * 0.3,
      });
      
      gsap.to(p, {
        y: -50 - Math.random() * 100,
        x: `+=${(Math.random() - 0.5) * 60}`,
        opacity: 0,
        duration: 2 + Math.random() * 3,
        ease: 'power1.out',
        delay: Math.random() * 2,
        repeat: -1,
        onRepeat: function () {
          gsap.set(p, {
            x: Math.random() * container.offsetWidth,
            y: container.offsetHeight + 10,
            opacity: 0.7 + Math.random() * 0.3,
          });
        },
      });
    }
    
    return () => {
      particles.forEach(p => {
        gsap.killTweensOf(p);
        p.remove();
      });
    };
  }, [containerRef, active, count]);
}

/**
 * Animation d'entrée pour les sections au scroll.
 */
export function useSectionReveal(sectionRef: RefObject<HTMLElement | null>, deps: any[] = []) {
  useGSAP(() => {
    if (!sectionRef.current) return;
    
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: sectionRef.current, dependencies: deps });
}
