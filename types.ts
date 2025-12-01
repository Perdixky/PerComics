export interface Page {
  id: string;
  url: string;
  pageNumber: number;
}

export interface Chapter {
  id: string;
  title: string; // Acts as folder name
  number: number;
  pages: Page[];
}

export interface Comic {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  status: 'Ongoing' | 'Completed';
  tags: string[];
  chapters: Chapter[];
}

export type ViewState = 'library' | 'details' | 'reader';
