import type { PhotoCollection, Photo, Album } from '../types.ts';

const createDemoPhotos = (setId: number, count: number): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const url = `https://picsum.photos/id/${(setId * 100) + i}/600/800`;
    return {
      id: `set${setId}-photo-${i + 1}`,
      url: url,
      thumbnailUrl: url,
      filename: `image_s${setId}_${i + 1}.jpg`,
      path: '',
      type: 'image',
      source: 'demo',
      isFavorite: false,
    };
  });
};

const demoData: PhotoCollection[] = [
  {
    id: 'demo-alps',
    name: 'Urlaub in den Alpen',
    coverImage: 'https://picsum.photos/id/1015/600/800',
    photos: createDemoPhotos(1, 12),
    albums: [
      { id: 'alps-album-1', title: 'Wanderungen' },
      { id: 'alps-album-2', title: 'Hüttenabende' },
      { id: 'alps-album-3', title: 'Landschaften' },
    ],
    source: 'demo'
  },
  {
    id: 'demo-paris',
    name: 'Städtetrip nach Paris',
    coverImage: 'https://picsum.photos/id/1011/600/800',
    photos: createDemoPhotos(2, 15),
    albums: [
      { id: 'paris-album-1', title: 'Sehenswürdigkeiten' },
      { id: 'paris-album-2', title: 'Essen & Trinken' },
      { id: 'paris-album-3', title: 'Nachtleben' },
      { id: 'paris-album-4', title: 'Louvre' },
    ],
    source: 'demo'
  },
  {
    id: 'demo-family',
    name: 'Familienfeier 2024',
    coverImage: 'https://picsum.photos/id/103/600/800',
    photos: createDemoPhotos(3, 8),
    albums: [
      { id: 'family-album-1', title: 'Die Gäste' },
      { id: 'family-album-2', title: 'Geschenke' },
    ],
    source: 'demo'
  }
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDemoData = async (): Promise<PhotoCollection[]> => {
  console.log("Simulating: Fetching demo folder data...");
  await simulateDelay(500);
  return Promise.resolve(demoData);
};

export const movePhotoToAlbum = async (photoFilename: string, albumId: string): Promise<void> => {
    console.log(`Simulating: Moving ${photoFilename} to album "${albumId}".`);
    await simulateDelay(200);
    return Promise.resolve();
};

export const deletePhoto = async (photoFilename: string): Promise<void> => {
  console.log(`Simulating: Deleting ${photoFilename}.`);
  await simulateDelay(200);
  return Promise.resolve();
};

export const renamePhoto = async (oldFilename: string, newFilename: string): Promise<void> => {
  console.log(`Simulating: Renaming ${oldFilename} to ${newFilename}.`);
  await simulateDelay(200);
  return Promise.resolve();
};