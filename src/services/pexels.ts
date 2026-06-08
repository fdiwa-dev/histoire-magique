const PEXELS_API_KEY = 'BW5armwGxhTIREj5AVvsBQT719hflS4m5KLWi1ex9XlBCF9rUdDlTCfp';
const PEXELS_BASE = 'https://api.pexels.com/v1';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

type StyleSuffix = Record<string, string>;

const STYLE_SUFFIXES: Record<string, StyleSuffix> = {
  Aquarelle: {
    default: 'watercolor painting soft pastel artistic',
    forest: 'watercolor forest landscape soft pastel dreamy',
    space: 'watercolor space nebula stars soft pastel artistic',
    pirate: 'watercolor ocean sunset sailing soft pastel',
    dragon: 'watercolor fantasy mystical soft pastel painting',
    robot: 'watercolor robot whimsical soft pastel artwork',
  },
  BD: {
    default: 'comic book style colorful vibrant high contrast',
    forest: 'comic jungle adventure vibrant colorful art',
    space: 'comic space superhero colorful pop art',
    pirate: 'comic pirate adventure colorful illustration style',
    dragon: 'comic fantasy dragon vibrant colorful pop art',
    robot: 'comic robot sci-fi colorful vibrant cartoon style',
  },
  'Pixel Art': {
    default: 'vintage retro nostalgic game color blocks',
    forest: 'vintage retro nature pixelated colorful blocks',
    space: 'vintage retro space game colorful blocks',
    pirate: 'vintage retro pirate adventure colorful',
    dragon: 'vintage retro fantasy creature colorful',
    robot: 'vintage retro robot technicolor game',
  },
  Crayon: {
    default: 'pencil sketch drawing artistic texture paper',
    forest: 'pencil sketch forest landscape drawing',
    space: 'pencil sketch space stars drawing artistic',
    pirate: 'pencil sketch pirate ship ocean drawing',
    dragon: 'pencil sketch fantasy dragon creature drawing',
    robot: 'pencil sketch robot mechanical drawing',
  },
  Réaliste: {
    default: 'photograph realistic nature vibrant colors',
    forest: 'enchanted forest magical path sunlight photograph',
    space: 'astronaut space stars realistic photography',
    pirate: 'pirate ship ocean realistic photograph',
    dragon: 'dragon lizard reptile realistic close up photography',
    robot: 'robot technology realistic modern photography',
  },
};

const THEME_KEYWORDS: Record<string, (scene: string, style: string, childName: string) => string> = {
  space: (scene, style, _name) => {
    const suffix = STYLE_SUFFIXES[style]?.space || STYLE_SUFFIXES[style]?.default || '';
    const map: Record<string, string> = {
      cover: `astronaut spacesuit child space ${suffix}`,
      intro: `child looking at stars night sky wonder ${suffix}`,
      launch: `rocket launch fire smoke dramatic sky ${suffix}`,
      moon: `full moon bright night sky ${suffix}`,
      alien: `colorful alien figure close up ${suffix}`,
      earth: `planet earth globe atmosphere ${suffix}`,
      starfall: `starry night sky milky way magical ${suffix}`,
      moral: `child sleeping stars night peaceful ${suffix}`,
    };
    return map[scene] || `space stars planets universe ${suffix}`;
  },
  pirate: (scene, style, _name) => {
    const suffix = STYLE_SUFFIXES[style]?.pirate || STYLE_SUFFIXES[style]?.default || '';
    const map: Record<string, string> = {
      cover: `pirate captain costume adventure ${suffix}`,
      intro: `ocean horizon sunset sea ${suffix}`,
      parrot: `colorful macaw parrot bird ${suffix}`,
      map: `old ancient treasure map parchment ${suffix}`,
      island: `tropical island beach palm trees ${suffix}`,
      cave: `dark cave entrance rocks nature ${suffix}`,
      storm: `ocean waves storm dramatic sky ${suffix}`,
      moral: `sunset beach peaceful ocean ${suffix}`,
    };
    return map[scene] || `pirate ship ocean adventure ${suffix}`;
  },
  dragon: (scene, style, _name) => {
    const suffix = STYLE_SUFFIXES[style]?.dragon || STYLE_SUFFIXES[style]?.default || '';
    const map: Record<string, string> = {
      cover: `dragon figurine mythical creature ${suffix}`,
      nest: `egg in nest warm nature sunlight ${suffix}`,
      hatch: `baby animal hatching egg life cute ${suffix}`,
      sad: `child sad thoughtful emotion ${suffix}`,
      flight: `bird flying mountains clouds freedom ${suffix}`,
      block: `large rock boulder nature landscape ${suffix}`,
      laugh: `child laughing playing meadow happy ${suffix}`,
      bloom: `beautiful flower blooming macro ${suffix}`,
      moral: `sunset mountains silhouette peaceful ${suffix}`,
    };
    return map[scene] || `fantasy dragon mythical creature ${suffix}`;
  },
  robot: (scene, style, _name) => {
    const suffix = STYLE_SUFFIXES[style]?.robot || STYLE_SUFFIXES[style]?.default || '';
    const map: Record<string, string> = {
      cover: `robot toy cute technology ${suffix}`,
      discover: `child discovering nature exploring garden ${suffix}`,
      dream: `child looking out window dreaming ${suffix}`,
      dry: `paintbrush art supplies creative studio ${suffix}`,
      berries: `colorful berries fruit bowls vibrant ${suffix}`,
      paint: `child painting colorful art creating ${suffix}`,
      alive: `magical tree glowing lights fantasy ${suffix}`,
      happy: `child laughing playing garden joy ${suffix}`,
      moral: `child parent creating art together ${suffix}`,
    };
    return map[scene] || `robot technology kids creative ${suffix}`;
  },
  forest: (scene, style, _name) => {
    const suffix = STYLE_SUFFIXES[style]?.forest || STYLE_SUFFIXES[style]?.default || '';
    const map: Record<string, string> = {
      cover: `enchanted forest magical nature beautiful ${suffix}`,
      intro: `child forest path sunlight adventure ${suffix}`,
      squirrel: `cute squirrel acorn forest ${suffix}`,
      river: `small forest river stream water ${suffix}`,
      fox: `beautiful red fox forest wildlife ${suffix}`,
      mushroom: `colorful mushrooms glowing moss forest ${suffix}`,
      fairy: `fairy lights glowing nature magical ${suffix}`,
      dance: `butterflies flowers meadow spring ${suffix}`,
      moral: `child sleeping peaceful nature forest ${suffix}`,
    };
    return map[scene] || `magical forest nature landscape ${suffix}`;
  },
};

const sceneToKeyword = (themeId: string, sceneType: string, style: string, childName: string): string => {
  const keywordFn = THEME_KEYWORDS[themeId];
  if (!keywordFn) {
    return `magical children story ${childName} colorful illustration`;
  }
  const sceneName = sceneType.replace(`${themeId}_`, '');
  return keywordFn(sceneName, style, childName);
};

class PexelsImageProvider {
  private cache = new Map<string, PexelsPhoto>();

  async search(query: string): Promise<PexelsPhoto | null> {
    const cacheKey = query.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${PEXELS_BASE}/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`;
      const res = await fetch(url, {
        headers: { Authorization: PEXELS_API_KEY },
      });

      if (!res.ok) {
        console.warn(`Pexels API error: ${res.status} for query "${query}"`);
        return null;
      }

      const data: PexelsResponse = await res.json();
      if (data.photos.length === 0) {
        console.warn(`Pexels no results for query "${query}"`);
        return null;
      }

      const photo = data.photos[0];
      this.cache.set(cacheKey, photo);
      return photo;
    } catch (err) {
      console.error('Pexels fetch error:', err);
      return null;
    }
  }

  async getPageImage(themeId: string, sceneType: string, childName: string, style: string = 'Réaliste', pageText: string = ''): Promise<{ url: string; photographer: string; photographerUrl: string; alt: string } | null> {
    let query: string;
    if (pageText) {
      // Extraire les mots-clés pertinents du texte de la page (max 60 chars)
      const keywords = pageText
        .replace(/[,.;:!?]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
        .slice(0, 8)
        .join(' ');
      query = `${keywords} children illustration ${style}`;
    } else {
      query = sceneToKeyword(themeId, sceneType, style, childName);
    }
    const photo = await this.search(query);

    if (!photo) return null;

    return {
      url: photo.src.large,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt,
    };
  }

  /** Preload all images for a story in parallel */
  async preloadStoryImages(story: { themeId: string; pages: { sceneType: string }[]; heroName: string; style?: string }): Promise<Map<number, { url: string; photographer: string; photographerUrl: string; alt: string }>> {
    const results = new Map<number, { url: string; photographer: string; photographerUrl: string; alt: string }>();
    const style = story.style || 'Réaliste';
    const queries = story.pages.map((page, idx) => ({
      idx,
      query: sceneToKeyword(story.themeId, page.sceneType, style, story.heroName),
    }));

    // Batch: up to 4 parallel requests
    const batchSize = 4;
    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (q) => {
          const photo = await this.search(q.query);
          if (photo) {
            return {
              idx: q.idx,
              data: { url: photo.src.large, photographer: photo.photographer, photographerUrl: photo.photographer_url, alt: photo.alt },
            };
          }
          return null;
        })
      );

      for (const result of batchResults) {
        if (result) results.set(result.idx, result.data);
      }
    }

    return results;
  }
}

export const pexelsProvider = new PexelsImageProvider();
