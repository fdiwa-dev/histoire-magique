import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

const COLORS = ['#fbbf24', '#a855f7', '#ec4899', '#22d3ee', '#34d399', '#f97316'];

/**
 * MagicParticles — particules qui apparaissent aléatoirement dans un container.
 * À utiliser comme effet de fond décoratif.
 */
export function MagicParticlesBg({ containerRef, density = 20 }: {
  containerRef: React.RefObject<HTMLElement | null>;
  density?: number;
}) {
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < density; i++) {
      const p = document.createElement('div');
      p.className = 'magic-particle';
      p.style.cssText = `
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
        width: ${3 + Math.random() * 6}px;
        height: ${3 + Math.random() * 6}px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        opacity: 0;
        box-shadow: 0 0 8px currentColor;
      `;
      container.appendChild(p);
      particles.push(p);
      particlesRef.current = particles;

      // Position aléatoire
      gsap.set(p, {
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
      });

      // Animation flottante
      gsap.to(p, {
        opacity: 0.15 + Math.random() * 0.25,
        duration: 0.5,
        delay: Math.random() * 3,
      });

      gsap.to(p, {
        y: `+=${-20 - Math.random() * 40}`,
        x: `+=${(Math.random() - 0.5) * 30}`,
        duration: 4 + Math.random() * 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      });
    }

    return () => {
      particles.forEach(p => {
        gsap.killTweensOf(p);
        p.remove();
      });
      particlesRef.current = [];
    };
  }, [containerRef, density]);

  return null; // rendu purement DOM via ref
}

/**
 * SparkleEffect — étincelles qui explosent au clic sur un élément.
 */
export function useSparkleEffect(ref: React.RefObject<HTMLElement | null>) {
  const createSparkles = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement || document.body;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      spark.className = 'sparkle-effect';
      spark.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        z-index: 9999;
        box-shadow: 0 0 6px currentColor;
      `;
      document.body.appendChild(spark);

      const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 60;

      gsap.set(spark, { x: cx, y: cy, opacity: 1 });
      gsap.to(spark, {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        opacity: 0,
        scale: 0.2,
        duration: 0.6 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => spark.remove(),
      });
    }
  }, [ref]);

  return createSparkles;
}

/**
 * GlowOnHover — halo lumineux qui suit la souris sur un élément.
 */
export function useGlowEffect(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const glow = document.createElement('div');
    glow.className = 'glow-follow';
    glow.style.cssText = `
      position: absolute;
      pointer-events: none;
      border-radius: 50%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
      transform: translate(-50%, -50%);
      top: 0;
      left: 0;
    `;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(glow);

    const show = () => { glow.style.opacity = '1'; };
    const hide = () => { glow.style.opacity = '0'; };
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      gsap.set(glow, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('mousemove', move);

    return () => {
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hide);
      el.removeEventListener('mousemove', move);
      glow.remove();
    };
  }, [ref]);
}
