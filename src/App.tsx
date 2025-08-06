import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import type { PhotoCollection, Photo, Album } from './types';
import * as photoService from './services/mockPhotoService';
import * as googlePhotosService from './services/googlePhotosService';

import StartScreen from './components/StartScreen';
import PhotoGrid from './components/PhotoGrid';
import SwiperView from './components/SwiperView';
import GoogleApiModal from './components/GoogleApiModal';

type View = 'start' | 'grid' | 'swiper';

const THUMBNAIL_MAX_SIZE = 250;
const FAVORITE_SUFFIX = '_FAV';

async function getDirectoryHandleByPath(root: FileSystemDirectoryHandle, path: string, create = false): Promise<FileSystemDirectoryHandle> {
    let current = root;
    const parts = path.split('/').filter(p => p);
    for (const part of parts) {
        current = await current.getDirectoryHandle(part, { create });
    }
    return current;
}


async function generateImageThumbnail(file: File): Promise<string> {
  try {
    const imageBitmap = await createImageBitmap(file, { resizeWidth: THUMBNAIL_MAX_SIZE, resizeHeight: THUMBNAIL_MAX_SIZE, resizeQuality: 'low' });
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch (e) {
    console.warn(`Konnte kein Thumbnail für ${file.name} erstellen:`, e);
    return URL.createObjectURL(file); // Fallback auf Original-URL
  }
}

async function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;

    const cleanup = () => {
        URL.revokeObjectURL(url);
    };

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      let { videoWidth: width, videoHeight: height } = video;
      if (!width || !height) {
          cleanup();
          return resolve(URL.createObjectURL(file)); // Fallback
      }

      if (width > height) {
        if (width > THUMBNAIL_MAX_SIZE) {
          height = height * (THUMBNAIL_MAX_SIZE / width);
          width = THUMBNAIL_MAX_SIZE;
        }
      } else {
        if (height > THUMBNAIL_MAX_SIZE) {
          width = width * (THUMBNAIL_MAX_SIZE / height);
          height = THUMBNAIL_MAX_SIZE;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        return resolve(URL.createObjectURL(file)); // Fallback
      }
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      cleanup();
      resolve(dataUrl);
    };

    video.onerror = () => {
      console.warn(`Konnte kein Video-Thumbnail für ${file.name} erstellen.`);
      cleanup();
      resolve(URL.createObjectURL(file)); // Fallback
    };
    
    setTimeout(() => {
        cleanup();
        resolve(URL.createObjectURL(file));
    }, 5000); // Timeout to prevent hanging
  });
}


const App: React.FC = () => {
  const [view, setView] = useState<View>('start');
  const [demoCollections, setDemoCollections] = useState<PhotoCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<PhotoCollection | null>(null);
  const [swiperInitialIndex, setSwiperInitialIndex] = useState(0);
  const [lastViewedPhotoIndex, setLastViewedPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [localDirectoryHandle, setLocalDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  
  const [isGoogleSignedIn, setGoogleSignedIn] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [isGoogleApiModalOpen, setGoogleApiModalOpen] = useState(false);
  
  const [swipeToDeleteDirection, setSwipeToDeleteDirection] = useState<'left' | 'right'>(() => {
    const savedDirection = localStorage.getItem('swipeToDeleteDirection');
    return (savedDirection === 'left' || savedDirection === 'right') ? savedDirection : 'left';
  });

  useEffect(() => {
    localStorage.setItem('swipeToDeleteDirection', swipeToDeleteDirection);
  }, [swipeToDeleteDirection]);


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setStatusMessage(null);
        setError(null);
        const folders = await photoService.getDemoData();
        setDemoCollections(folders);
      } catch (e) {
        setError("Fehler beim Laden der App-Daten.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);
  
  const fetchGooglePhotos = useCallback(async () => {
    try {
        setIsLoading(true);
        setStatusMessage("Lade neueste Fotos und Alben...");
        setError(null);
        const [photos, albums] = await Promise.all([
            googlePhotosService.getRecentPhotos(50),
            googlePhotosService.getAlbums()
        ]);

        const googleCollection: PhotoCollection = {
            id: 'google-photos-recent',
            name: 'Neueste Google Fotos',
            coverImage: photos.find(p => p.isFavorite)?.url || photos[0]?.url || '',
            photos,
            albums,
            source: 'google'
        };

        setSelectedCollection(googleCollection);
        setSwiperInitialIndex(0);
        setStatusMessage(null);
        setView('swiper');

    } catch (e: any) {
        console.error("Google Photos Abruf fehlgeschlagen", e);

        let errorMessage = "Abruf von Google Fotos fehlgeschlagen.";
        let errorDetails: any = null;

        if (e.result && e.result.error) {
            errorDetails = e.result.error;
        } else if (typeof e.body === 'string') {
            try {
                const body = JSON.parse(e.body);
                if (body.error) errorDetails = body.error;
            } catch (parseError) { /* Fehler beim Parsen ignorieren */ }
        } else if (e.code && e.message) {
            errorDetails = e;
        }

        if (errorDetails) {
            if (errorDetails.code === 403) {
                 if (errorDetails.message && (errorDetails.message.includes('not been used') || errorDetails.message.includes('is not enabled'))) {
                     errorMessage = 'Fehler: Die Google Photos Library API ist für Ihr Projekt nicht aktiviert. Bitte gehen Sie zur Google Cloud Console, aktivieren Sie die API und versuchen Sie es erneut.';
                 } else {
                     errorMessage = 'Zugriff verweigert (403). Bitte stellen Sie sicher, dass die "Photos Library API" in Ihrem Google Cloud Projekt aktiviert ist und die OAuth-Konfiguration korrekt ist.';
                 }
            } else {
                 errorMessage += ` (API Fehler: ${errorDetails.code} - ${errorDetails.message || 'Unbekannter Fehler'})`;
            }
        } else if (e.message) {
            errorMessage += ` (${e.message})`;
        }
        
        setError(errorMessage);
        setView('start');
    } finally {
        setIsLoading(false);
        setStatusMessage(null);
    }
  }, []);

  useEffect(() => {
      if(isGoogleSignedIn) {
        fetchGooglePhotos();
      }
  }, [isGoogleSignedIn, fetchGooglePhotos]);


  const handleSelectDemoCollection = (collectionName: string) => {
    const collection = demoCollections.find(f => f.name === collectionName);
    if (collection) {
      setSelectedCollection(collection);
      setLocalDirectoryHandle(null);
      setView('grid');
    }
  };
  
  const connectToGoogle = useCallback(async (key: string, id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setStatusMessage("Initialisiere Google-Dienste...");
      await googlePhotosService.init(key, id, (signedIn) => {
        setGoogleSignedIn(signedIn);
        if(!signedIn) {
          setIsLoading(false);
          setStatusMessage(null);
        }
      });
      setStatusMessage("Bitte im Popup-Fenster bei Google anmelden...");
      googlePhotosService.signIn();
    } catch(e: any) {
      setError(e.message || "Verbindung mit Google fehlgeschlagen.");
      setIsLoading(false);
      setStatusMessage(null);
    }
  }, []);

  const handleConnectGooglePhotos = () => {
      if (!googleApiKey || !googleClientId) {
          setGoogleApiModalOpen(true);
      } else {
          connectToGoogle(googleApiKey, googleClientId);
      }
  };
  
  const handleSaveGoogleApiKeys = (apiKey: string, clientId: string) => {
      setGoogleApiKey(apiKey);
      setGoogleClientId(clientId);
      setGoogleApiModalOpen(false);
      connectToGoogle(apiKey, clientId);
  };

  const handleSelectLocalFolder = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        alert("Dein Browser unterstützt diese Funktion leider nicht. Probiere es mit Chrome oder Edge.");
        return;
      }

      const directoryHandle = await window.showDirectoryPicker();
      setIsLoading(true);
      setStatusMessage("Lese Ordner & erstelle Vorschaubilder...");
      setError(null);

      const photos: Photo[] = [];
      const albums: Album[] = [];
      const fileExtensions = /\.(jpg|jpeg|png|webp|gif|mp4|mov|avi|mkv|webm)$/i;
      const videoExtensions = /\.(mp4|mov|avi|mkv|webm)$/i;

      const scanDirectory = async (dirHandle: FileSystemDirectoryHandle, currentPath: string) => {
        for await (const entry of dirHandle.values()) {
          const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

          if (entry.kind === 'file' && fileExtensions.test(entry.name)) {
            const fileHandle = entry as FileSystemFileHandle;
            const file = await fileHandle.getFile();
            const isVideo = videoExtensions.test(entry.name);
            const isFavorite = entry.name.includes(`${FAVORITE_SUFFIX}.`);
            const thumbnailUrl = isVideo ? await generateVideoThumbnail(file) : await generateImageThumbnail(file);
            const photo: Photo = {
              id: newPath + file.lastModified,
              url: URL.createObjectURL(file),
              thumbnailUrl: thumbnailUrl,
              filename: entry.name,
              path: currentPath,
              fileHandle: fileHandle,
              type: isVideo ? 'video' : 'image',
              source: 'local',
              isFavorite,
            };
            photos.push(photo);
          } else if (entry.kind === 'directory') {
            if (entry.name !== 'swiptrash') {
                const album: Album = {
                    id: newPath,
                    title: newPath,
                };
                albums.push(album);
            }
            await scanDirectory(entry as FileSystemDirectoryHandle, newPath);
          }
        }
      };

      await scanDirectory(directoryHandle, "");
      
      photos.sort((a, b) => (a.path + '/' + a.filename).localeCompare(b.path + '/' + b.filename));
      albums.sort((a, b) => a.title.localeCompare(b.title));

      const coverPhotoUrl = photos.find(p => p.type === 'image')?.thumbnailUrl || photos[0]?.thumbnailUrl || '';

      const folderData: PhotoCollection = {
        id: directoryHandle.name,
        name: directoryHandle.name,
        coverImage: coverPhotoUrl,
        photos,
        albums,
        source: 'local',
      };

      setSelectedCollection(folderData);
      setLocalDirectoryHandle(directoryHandle);
      setStatusMessage(null);
      setView('grid');

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log("Benutzer hat Ordnerauswahl abgebrochen.");
      } else {
        setError("Fehler beim Öffnen des Ordners.");
        console.error(error);
      }
    } finally {
        setIsLoading(false);
        setStatusMessage(null);
    }
  };

  const handleSelectPhoto = (photoIndex: number) => {
    setSwiperInitialIndex(photoIndex);
    setView('swiper');
  };
  
  const handleBack = (currentIndex?: number) => {
    if (view === 'swiper') {
      if (typeof currentIndex === 'number') {
        setLastViewedPhotoIndex(currentIndex);
      }
       if (selectedCollection?.source === 'google') {
          googlePhotosService.signOut();
          setSelectedCollection(null);
          setView('start');
       } else {
          setView('grid');
       }
    } else if (view === 'grid') {
      if (localDirectoryHandle && selectedCollection) {
        selectedCollection.photos.forEach(p => {
          URL.revokeObjectURL(p.url)
          if (p.thumbnailUrl.startsWith('blob:')) {
            URL.revokeObjectURL(p.thumbnailUrl)
          }
        });
      }
      setSelectedCollection(null);
      setLocalDirectoryHandle(null);
      setLastViewedPhotoIndex(0);
      setView('start');
    }
  };

  const handleCreateAlbum = async (albumName: string): Promise<void> => {
      if (selectedCollection?.source !== 'local' || !localDirectoryHandle) {
          throw new Error("Album-Erstellung ist nur für lokale Ordner möglich.");
      }
      try {
          const parts = albumName.split('/').filter(p => p);
          let currentHandle = localDirectoryHandle;
          for(const part of parts) {
            currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
          }

          setSelectedCollection(prev => {
              if (!prev) return null;
              const newAlbum: Album = { id: albumName, title: albumName };
              if (prev.albums.some(a => a.id === albumName)) return prev;
              return { ...prev, albums: [...prev.albums, newAlbum].sort((a,b) => a.title.localeCompare(b.title)) };
          });
      } catch (e) {
          console.error("Fehler beim Erstellen des Albums:", e);
          throw e;
      }
  };

  const moveLocalPhoto = async (photo: Photo, targetPath: string) => {
      if (!localDirectoryHandle || !photo.fileHandle) {
          throw new Error("Lokaler Kopiervorgang nicht möglich.");
      }
      const sourceDirHandle = await getDirectoryHandleByPath(localDirectoryHandle, photo.path);
      const targetDirHandle = await getDirectoryHandleByPath(localDirectoryHandle, targetPath, true);
      
      const newFileHandle = await targetDirHandle.getFileHandle(photo.filename, { create: true });
      const writable = await newFileHandle.createWritable();
      const fileData = await photo.fileHandle.getFile();
      await writable.write(fileData);
      await writable.close();
      
      await sourceDirHandle.removeEntry(photo.filename);
  }

  const handleDeletePhoto = async (photo: Photo): Promise<void> => {
      switch (photo.source) {
          case 'local':
              await moveLocalPhoto(photo, 'swiptrash');
              break;
          case 'google':
              await googlePhotosService.archivePhoto(photo.id);
              break;
          case 'demo':
              await photoService.deletePhoto(photo.filename);
              break;
      }
      setSelectedCollection(prev => {
        if (!prev) return null;
        if (photo.source === 'local') {
          URL.revokeObjectURL(photo.url);
          if (photo.thumbnailUrl.startsWith('blob:')) {
            URL.revokeObjectURL(photo.thumbnailUrl);
          }
        }
        return { ...prev, photos: prev.photos.filter(p => p.id !== photo.id) };
      });
  };

  const handleMovePhotoToAlbum = async (photo: Photo, albumId: string): Promise<void> => {
       switch (photo.source) {
          case 'local':
              await moveLocalPhoto(photo, albumId);
              break;
          case 'google':
              await googlePhotosService.addPhotoToAlbum(photo.id, albumId);
              break;
          case 'demo':
              await photoService.movePhotoToAlbum(photo.filename, albumId);
              break;
       }
       setSelectedCollection(prev => {
          if (!prev) return null;
          return {
              ...prev,
              photos: prev.photos.map(p => 
                  p.id === photo.id ? { ...p, path: albumId } : p
              )
          };
       });
  };

  const handleRenamePhoto = async (photo: Photo, newName: string): Promise<Photo> => {
    let updatedPhoto: Photo;

    let favoritePart = '';
    let baseFilename = photo.filename;
    if (photo.isFavorite) {
        const favIndex = photo.filename.lastIndexOf(FAVORITE_SUFFIX);
        if (favIndex !== -1) {
            baseFilename = photo.filename.substring(0, favIndex);
            favoritePart = FAVORITE_SUFFIX;
        }
    }

    const oldExtension = baseFilename.includes('.') ? baseFilename.substring(baseFilename.lastIndexOf('.')) : '';
    let newBaseName = newName.includes('.') ? newName.substring(0, newName.lastIndexOf('.')) : newName;
    if (!newBaseName.trim()) {
        throw new Error("Dateiname darf nicht leer sein.");
    }
    newName = newBaseName.trim() + favoritePart + oldExtension;

    if (newName === photo.filename) return photo;

    switch (photo.source) {
      case 'local':
        if (!localDirectoryHandle || !photo.fileHandle) {
          throw new Error("Lokales Umbenennen nicht möglich.");
        }
        const parentDirHandle = await getDirectoryHandleByPath(localDirectoryHandle, photo.path);
        try {
          await parentDirHandle.getFileHandle(newName);
          throw new Error(`Datei "${newName}" existiert bereits.`);
        } catch (e: any) {
          if (e.name !== 'NotFoundError') throw e;
        }
        const newFileHandle = await parentDirHandle.getFileHandle(newName, { create: true });
        const writable = await newFileHandle.createWritable();
        const fileData = await photo.fileHandle.getFile();
        await writable.write(fileData);
        await writable.close();
        await parentDirHandle.removeEntry(photo.filename);
        updatedPhoto = { ...photo, filename: newName, fileHandle: newFileHandle };
        break;
      
      case 'demo':
        await photoService.renamePhoto(photo.filename, newName);
        updatedPhoto = { ...photo, filename: newName };
        break;
      
      case 'google':
        throw new Error("Umbenennen von Google Fotos wird nicht unterstützt.");

      default:
          throw new Error("Unbekannte Fotoquelle.");
    }

    setSelectedCollection(prev => {
      if (!prev) return null;
      const newPhotos = prev.photos.map(p => (p.id === photo.id ? updatedPhoto : p));
      return { ...prev, photos: newPhotos };
    });

    return updatedPhoto;
  };
  
  const handleToggleFavorite = async (photo: Photo): Promise<void> => {
    let updatedPhoto: Photo;

    const extensionIndex = photo.filename.lastIndexOf('.');
    const baseName = photo.filename.substring(0, extensionIndex);
    const extension = photo.filename.substring(extensionIndex);

    const newName = photo.isFavorite
      ? baseName.replace(FAVORITE_SUFFIX, '')
      : `${baseName}${FAVORITE_SUFFIX}${extension}`;
    
    switch(photo.source) {
      case 'local':
        if (!localDirectoryHandle || !photo.fileHandle) {
            throw new Error("Lokales Umbenennen nicht möglich.");
        }
        const parentDirHandle = await getDirectoryHandleByPath(localDirectoryHandle, photo.path);
        
        // Re-use logic from rename: create new file, copy data, delete old file
        const newFileHandle = await parentDirHandle.getFileHandle(newName, { create: true });
        const writable = await newFileHandle.createWritable();
        const fileData = await photo.fileHandle.getFile();
        await writable.write(fileData);
        await writable.close();
        await parentDirHandle.removeEntry(photo.filename);

        updatedPhoto = { ...photo, filename: newName, fileHandle: newFileHandle, isFavorite: !photo.isFavorite };
        break;
      
      case 'demo':
        // Just simulate the change for demo purposes
        updatedPhoto = { ...photo, filename: newName, isFavorite: !photo.isFavorite };
        break;

      case 'google':
      default:
        throw new Error("Favoriten können nur für lokale oder Demo-Dateien geändert werden.");
    }

    // Update the state
    setSelectedCollection(prev => {
      if (!prev) return null;
      const newPhotos = prev.photos.map(p => (p.id === photo.id ? updatedPhoto : p));
      return { ...prev, photos: newPhotos };
    });
  };

  const viewVariants: Variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  const renderContent = () => {
    if (isLoading || error || statusMessage) {
      return <div className="flex items-center justify-center h-full"><p className="text-center text-lg">{error || statusMessage || 'Lade...'}</p></div>;
    }

    switch (view) {
      case 'start':
        return (
          <motion.div key="start" variants={viewVariants} initial="initial" animate="animate" exit="exit">
            <StartScreen
              collections={demoCollections}
              onSelectCollection={handleSelectDemoCollection}
              onSelectLocalFolder={handleSelectLocalFolder}
              onConnectGooglePhotos={handleConnectGooglePhotos}
             />
          </motion.div>
        );
      case 'grid':
        return selectedCollection ? (
          <motion.div key="grid" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="h-full">
            <PhotoGrid
              collection={selectedCollection}
              onSelectPhoto={handleSelectPhoto}
              onBack={() => handleBack()}
              lastViewedIndex={lastViewedPhotoIndex}
            />
          </motion.div>
        ) : null;
      case 'swiper':
        return selectedCollection ? (
          <motion.div key="swiper" className="w-full h-full" variants={viewVariants} initial="initial" animate="animate" exit="exit">
            <SwiperView
              key={selectedCollection.id}
              collection={selectedCollection}
              initialIndex={swiperInitialIndex}
              onBack={handleBack}
              isLocal={selectedCollection.source === 'local'}
              onCreateAlbum={handleCreateAlbum}
              onDeletePhoto={handleDeletePhoto}
              onMovePhotoToAlbum={handleMovePhotoToAlbum}
              onRenamePhoto={handleRenamePhoto}
              onToggleFavorite={handleToggleFavorite}
              swipeToDeleteDirection={swipeToDeleteDirection}
              onDirectionChange={setSwipeToDeleteDirection}
            />
          </motion.div>
        ) : null;
      default:
        return <p>Ungültiger Zustand</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-primary text-brand-light font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
       <GoogleApiModal
          isOpen={isGoogleApiModalOpen}
          onClose={() => setGoogleApiModalOpen(false)}
          onSave={handleSaveGoogleApiKeys}
       />
    </div>
  );
};

export default App;