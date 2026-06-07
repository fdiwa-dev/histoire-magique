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
  space: (scene, name) => {
    const map: Record<string, string> = {
      cover: `${name} child astronaut space rocket cartoon illustration`,
      intro: `child astronaut floating in space colorful cartoon`,
      launch: `rocket launching into space stars planets`,
      moon: `child on moon surface looking at earth cartoon`,
      alien: `friendly alien character colorful cartoon space`,
      earth: `planet earth from space stars colorful`,
      starfall: `shooting star meteor shower night sky magic`,
      moral: `child sleeping under stars peaceful night`,
    };
    return map[scene] || `${name} space adventure magic colorful illustration for kids`;
  },
  pirate: (scene, name) => {
    const map: Record<string, string> = {
      cover: `${name} pirate captain adventure ship treasure map cartoon`,
      intro: `cute pirate boy or girl with map looking at horizon`,
      parrot: `colorful parrot sitting on pirate shoulder jungle`,
      map: `old treasure map with red X pirate adventure`,
      island: `tropical island with palm trees pirate ship cartoon`,
      cave: `dark cave with treasure chest gold coins glowing`,
      storm: `pirate ship in big storm waves ocean dramatic`,
      moral: `pirate and friends sharing treasure happy sunset`,
    };
    return map[scene] || `pirate adventure ${name} cartoon illustration for kids`;
  },
  dragon: (scene, name) => {
    const map: Record<string, string> = {
      cover: `friendly green dragon with child flying over mountains magical illustration`,
      nest: `dragon egg glowing in nest magic forest`,
      hatch: `baby dragon hatching from egg cute fantasy`,
      sad: `sad dragon with droopy wings in magical forest`,
      flight: `child riding friendly dragon flying above clouds`,
      block: `large stone blocking waterfall stream dragon landscape`,
      laugh: `dragon laughing happy playing with child meadow`,
      bloom: `magical flower blooming moonlight fantasy glow`,
      moral: `dragon and child watching stars night sky friendship`,
    };
    return map[scene] || `magical dragon fantasy ${name} children book illustration`;
  },
  robot: (scene, name) => {
    const map: Record<string, string> = {
      cover: `friendly robot child workshop gears colorful kids illustration`,
      discover: `cute rusty robot discovering world nature colorful`,
      dream: `robot looking out window dreaming of colors`,
      dry: `paintbrushes art supplies on table creative studio`,
      berries: `bowls of colorful fruit puree natural vibrant`,
      paint: `robot painting colorful canvas splashing paint`,
      alive: `magical tree growing from painting glowing leaves fantasy`,
      happy: `happy robot with glowing heart surrounded by flowers`,
      moral: `robot and child creating art together colorful workshop`,
    };
    return map[scene] || `friendly robot adventure ${name} colorful kids art`;
  },
  forest: (scene, name) => {
    const map: Record<string, string> = {
      cover: `enchanted forest with ${name} child magical trees sunlight`,
      intro: `child walking into magical forest with animals cartoon`,
      squirrel: `friendly squirrel holding acorn in forest`,
      river: `small river stream in enchanted forest magic glow`,
      fox: `friendly fox in forest path magical atmosphere`,
      mushroom: `glowing mushrooms in dark enchanted forest`,
      fairy: `fairy with wings sitting on flower in forest`,
      dance: `forest animals dancing in circle magical moonlight`,
      moral: `child sleeping in forest surrounded by glowing animals`,
    };
    return map[scene] || `magical forest ${name} children story illustration`;
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
