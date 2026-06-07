export type AgeGroup = '2-4' | '5-7' | '8-10';

export type IllustrationStyle = 'Aquarelle' | 'BD' | 'Pixel Art' | 'Crayon' | 'Réaliste';

export type LessonType = 'Amitié' | 'Courage' | 'Partage' | 'Différence' | 'Aventure' | 'Pas de leçon particulière';

export interface StoryParams {
  titleDescription: string;
  childName?: string;
  ageGroup: AgeGroup;
  illustrationStyle: IllustrationStyle;
  lesson: LessonType;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationSeed: string;
  backgroundClass: string;
  sceneType: string;
  descriptionVisuelle: string; // description audio pour les enfants non-voyants
}

export interface Story {
  id: string;
  title: string;
  params: StoryParams;
  pages: StoryPage[];
  heroName: string;
  coverImageSeed: string;
  themeId: string;
}

export interface ExampleStory {
  title: string;
  description: string;
  age: string;
  style: string;
  lesson: string;
  imageSeed: string;
  color: string;
}
