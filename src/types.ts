
export type PhotoSource = 'local' | 'demo' | 'google';

export interface Photo {
  id: string; // Eindeutige ID (Pfad, Google-ID, etc.)
  url: string; // URL zum Originalbild/-video
  thumbnailUrl: string; // URL zur kleinen Vorschau
  filename: string;
  path: string; // Relativer Pfad zum Bild (nur für 'local')
  fileHandle?: FileSystemFileHandle; // Nur für 'local'
  type: 'image' | 'video';
  source: PhotoSource;
  isFavorite?: boolean;
}

export interface Album {
  id:string;
  title: string;
}

export interface PhotoCollection {
  id: string;
  name: string;
  coverImage: string;
  photos: Photo[];
  albums: Album[];
  source: PhotoSource;
}

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    google?: any; // Für Google Identity Services
    gapi?: any; // Für Google API Client
  }

  // Ergänzt die fehlenden Iterator-Methoden für die File System Access API.
  interface FileSystemDirectoryHandle {
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemHandle>;
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  }
}
