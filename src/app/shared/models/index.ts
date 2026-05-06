export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  date: Date;
  featured?: boolean;
}

export interface Photo {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

export interface FileNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  children?: FileNode[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  volume: number;
  notifications: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PaletteCommand {
  id: string;
  label: string;
  description: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
}
