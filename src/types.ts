export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  isFavorite: boolean;
  createdAt: number;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  bookmarkIds: string[];
}

export interface Category {
  id: string;
  name: string;
}