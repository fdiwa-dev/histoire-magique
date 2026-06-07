import React, { useState, useEffect, useRef } from 'react';
import { IllustrationStyle } from '../types';
import StoryIllustration from './StoryIllustration';
import { pexelsProvider } from '../services/pexels';
import { Loader2 } from 'lucide-react';

interface PexelsImageProps {
  seed: string;
  themeId: string;
  sceneType: string;
  style: IllustrationStyle;
  className?: string;
  childName?: string;
}

export default function StoryIllustrationWithPexels({
  seed,
  themeId,
  sceneType,
  style,
  className = '',
  childName = 'Léo',
}: PexelsImageProps) {
  const [pexelsUrl, setPexelsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUseFallback(false);

    pexelsProvider
      .getPageImage(themeId, sceneType, childName, style)
      .then((img) => {
        if (cancelled) return;
        if (img) {
          setPexelsUrl(img.url);
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setUseFallback(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [themeId, sceneType, childName, style]);

  if (loading) {
    return (
      <div className="relative w-full h-full min-h-[280px] flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-indigo-900/20 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (useFallback || !pexelsUrl) {
    return (
      <StoryIllustration
        seed={seed}
        themeId={themeId}
        sceneType={sceneType}
        style={style}
        className={className}
        childName={childName}
      />
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[280px] overflow-hidden rounded-lg ${className}`}>
      <img
        src={pexelsUrl}
        alt={`Illustration pour ${childName} : ${sceneType}`}
        className="w-full h-full object-cover rounded-lg shadow-md"
        loading="lazy"
      />
      {/* Small attribution — required by Pexels terms */}
      <a
        href="https://www.pexels.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-1 right-2 text-[9px] text-white/50 hover:text-white/80 bg-black/30 px-1.5 py-0.5 rounded transition-colors"
      >
        Photos provided by Pexels
      </a>
    </div>
  );
}
