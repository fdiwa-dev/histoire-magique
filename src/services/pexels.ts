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

const THEME_KEYWORDS: Record<string, (scene: string, childName: string) => string> = {
  space: (_scene, _name) => {
    // Generic queries by scene type — Pexels has great space/astronaut photos
    const map: Record<string, string> = {
      cover: 'astronaut costume child space adventure orange background',
      intro: 'child looking at stars night sky wonder',
      launch: 'rocket launch fire smoke dramatic sky',
      moon: 'full moon bright night sky landscape',
      alien: 'colorful toy alien figure close up',
      earth: 'planet earth from space blue atmosphere',
      starfall: 'starry night sky milky way landscape magical',
      moral: 'child sleeping under starry night peaceful',
    };
    return map[_scene] || 'space stars planets nebula colorful universe';
  },
  pirate: (_scene, _name) => {
    const map: Record<string, string> = {
      cover: 'pirate costume child playing adventure outdoors',
      intro: 'child looking at ocean horizon sunset adventure',
      parrot: 'colorful macaw parrot sitting on branch',
      map: 'old ancient treasure map parchment paper close up',
      island: 'tropical island beach palm trees turquoise water',
      cave: 'dark cave entrance rocks nature landscape',
      storm: 'big ocean waves storm dramatic dark sky',
      moral: 'sunset beach golden hour peaceful ocean',
    };
    return map[_scene] || 'pirate ship ocean adventure tropical';
  },
  dragon: (_scene, _name) => {
    const map: Record<string, string> = {
      cover: 'dragon toy figurine mythical creature close up',
      nest: 'egg in nest nature warm sunlight',
      hatch: 'baby chicken hatching egg new life cute',
      sad: 'child sad disappointed rainy window',
      flight: 'bird flying above mountains clouds freedom',
      block: 'large boulder rock nature landscape river',
      laugh: 'child laughing happy playing meadow sunlight',
      bloom: 'beautiful flower blooming close up magical light',
      moral: 'sunset mountains friends silhouette peaceful',
    };
    return map[_scene] || 'fantasy dragon mythical creature colorful art';
  },
  robot: (_scene, _name) => {
    const map: Record<string, string> = {
      cover: 'robot toy colorful cute modern technology',
      discover: 'child discovering nature curious exploring garden',
      dream: 'child looking out window thoughtful dreaming',
      dry: 'paintbrush art supplies creative studio desk',
      berries: 'colorful fresh berries fruit bowls vibrant',
      paint: 'child painting colorful art creativity studio',
      alive: 'magical tree glowing lights fantasy forest',
      happy: 'happy child laughing playing colorful garden',
      moral: 'child and parent creating art together workshop',
    };
    return map[_scene] || 'robot technology kids play creative learning';
  },
  forest: (_scene, _name) => {
    const map: Record<string, string> = {
      cover: 'enchanted forest magical path sunlight trees nature',
      intro: 'child walking in forest path sunlight adventure',
      squirrel: 'cute squirrel holding acorn in forest nature',
      river: 'small forest river stream clear water nature',
      fox: 'beautiful red fox in forest wildlife nature',
      mushroom: 'colorful mushrooms glowing moss forest floor',
      fairy: 'fairy lights glowing in dark forest magical',
      dance: 'butterfly flower meadow spring colorful nature',
      moral: 'child sleeping peaceful nature forest bed',
    };
    return map[_scene] || 'magical forest nature beautiful landscape';
  },
};

const sceneToKeyword = (themeId: string, sceneType: string, childName: string): string => {
  const keywordFn = THEME_KEYWORDS[themeId];
  if (!keywordFn) {
    return `magical children story ${childName} colorful illustration`;
  }
  const sceneName = sceneType.replace(`${themeId}_`, '');
  return keywordFn(sceneName, childName);
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

  async getPageImage(themeId: string, sceneType: string, childName: string): Promise<{ url: string; photographer: string; photographerUrl: string; alt: string } | null> {
    const query = sceneToKeyword(themeId, sceneType, childName);
    const photo = await this.search(query);

    if (!photo) return null;

    return {
      url: photo.src.medium,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt,
    };
  }

  /** Preload all images for a story in parallel */
  async preloadStoryImages(story: { themeId: string; pages: { sceneType: string }[]; heroName: string }): Promise<Map<number, { url: string; photographer: string; photographerUrl: string; alt: string }>> {
    const results = new Map<number, { url: string; photographer: string; photographerUrl: string; alt: string }>();
    const queries = story.pages.map((page, idx) => ({
      idx,
      query: sceneToKeyword(story.themeId, page.sceneType, story.heroName),
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
              data: { url: photo.src.medium, photographer: photo.photographer, photographerUrl: photo.photographer_url, alt: photo.alt },
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
