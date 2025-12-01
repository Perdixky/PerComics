import { Comic, Chapter, Page } from './types';

// Helper to generate pages for a chapter
// Simulates: /ComicName/ChapterName/1.jpg
const generatePages = (chapterId: string, count: number): Page[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${chapterId}-page-${i + 1}`,
    pageNumber: i + 1,
    // Using Picsum to simulate the image file. 
    // In a real app, this would be: `/${comicId}/${chapterName}/${i + 1}.jpg`
    url: `https://picsum.photos/800/1200?random=${Math.random()}`
  }));
};

const generateChapters = (comicId: string, start: number, end: number): Chapter[] => {
  const chapters: Chapter[] = [];
  for (let i = start; i <= end; i++) {
    const chapterId = `${comicId}-ch-${i}`;
    chapters.push({
      id: chapterId,
      number: i,
      title: `Chapter ${i}`, // This represents the folder name
      pages: generatePages(chapterId, 12 + Math.floor(Math.random() * 8)) // 12-20 pages per chapter
    });
  }
  return chapters.reverse(); // Newest first
};

export const MOCK_COMICS: Comic[] = [
  {
    id: 'solo-leveling',
    title: 'Shadow Monarch',
    author: 'Chugong',
    coverUrl: 'https://picsum.photos/600/900?random=1',
    description: 'In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.',
    status: 'Completed',
    tags: ['Action', 'Fantasy', 'Adventure'],
    chapters: generateChapters('solo-leveling', 1, 15)
  },
  {
    id: 'one-piece',
    title: 'Pirate King Legends',
    author: 'Eiichiro Oda',
    coverUrl: 'https://picsum.photos/600/900?random=2',
    description: 'Gol D. Roger was known as the "Pirate King", the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world.',
    status: 'Ongoing',
    tags: ['Adventure', 'Comedy', 'Shonen'],
    chapters: generateChapters('one-piece', 1000, 1010)
  },
  {
    id: 'berserk',
    title: 'Black Swordsman',
    author: 'Kentaro Miura',
    coverUrl: 'https://picsum.photos/600/900?random=3',
    description: 'Guts, known as the Black Swordsman, seeks sanctuary from the demonic forces that pursue him and his woman, and vengeance against the man who branded him as an unholy sacrifice.',
    status: 'Ongoing',
    tags: ['Dark Fantasy', 'Horror', 'Seinen'],
    chapters: generateChapters('berserk', 1, 10)
  },
  {
    id: 'spy-family',
    title: 'Secret Family',
    author: 'Tatsuya Endo',
    coverUrl: 'https://picsum.photos/600/900?random=4',
    description: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.',
    status: 'Ongoing',
    tags: ['Comedy', 'Action', 'Slice of Life'],
    chapters: generateChapters('spy-family', 1, 25)
  }
];