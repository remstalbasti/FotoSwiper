import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Photo, Album, PhotoCollection } from '../types.ts';
import Header from './Header.tsx';
import PhotoCard from './PhotoCard.tsx';
import ActionButtons from './ActionButtons.tsx';
import SettingsModal from './SettingsModal.tsx';
import AlbumModal from './AlbumModal.tsx';

interface SwiperViewProps {
  collection: PhotoCollection;
  initialIndex: number;
  onBack: (currentIndex: number) => void;
  isLocal: boolean;
  onCreateAlbum: (albumName: string) => Promise<void>;
  onDeletePhoto: (photo: Photo) => Promise<void>;
  onMovePhotoToAlbum: (photo: Photo, albumId: string) => Promise<void>;
  onRenamePhoto: (photo: Photo, newName: string) => Promise<Photo>;
  onToggleFavorite: (photo: Photo) => Promise<void>;
  swipeToDeleteDirection: 'left' | 'right';
  onDirectionChange: (direction: 'left' | 'right') => void;
}

const SwiperView: React.FC<SwiperViewProps> = ({ 
    collection, 
    initialIndex, 
    onBack, 
    isLocal, 
    onCreateAlbum,
    onDeletePhoto,
    onMovePhotoToAlbum,
    onRenamePhoto,
    onToggleFavorite,
    swipeToDeleteDirection,
    onDirectionChange,
}) => {
  const { photos, albums } = collection;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAlbumModalOpen, setAlbumModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [lastUsedAlbumId, setLastUsedAlbumId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


  const removeTopCard = () => {
    setCurrentIndex(prev => prev + 1);
  };
  
  const handleKeep = () => {
    if (isProcessing || currentIndex >= photos.length) return;
    console.log(`Behalten: ${photos[currentIndex].filename}`);
    removeTopCard();
  };

  const handleDelete = async () => {
    if (isProcessing || currentIndex >= photos.length) return;
    const photo = photos[currentIndex];

    setIsProcessing(true);
    try {
      await onDeletePhoto(photo);
      console.log(`Gelöscht: ${photo.filename}`);
      // Das manuelle Vorrücken der Karte ist nicht mehr nötig.
      // Der Parent-Component entfernt das Foto, der Re-Render zeigt die nächste Karte.
    } catch(e) {
      console.error("Löschen fehlgeschlagen, Karte wird nicht entfernt.", e);
      alert(`Das Foto ${photo.filename} konnte nicht gelöscht/archiviert werden.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveToAlbum = async (albumId: string) => {
    if (isProcessing || currentIndex >= photos.length) return;
    const photo = photos[currentIndex];
    
    setIsProcessing(true);
    try {
      await onMovePhotoToAlbum(photo, albumId);
      console.log(`Verschoben: ${photo.filename} nach Album ${albumId}`);
      
      setLastUsedAlbumId(albumId);
      const albumTitle = albums.find(a => a.id === albumId)?.title || albumId;
      setFeedbackMessage(`Verschoben nach: ${albumTitle}`);
      setTimeout(() => setFeedbackMessage(null), 3000);

      setAlbumModalOpen(false);
      removeTopCard();
    } catch(e) {
       console.error("Verschieben fehlgeschlagen.", e);
       alert(`Das Foto ${photo.filename} konnte nicht verschoben werden.`);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleMiddleClickMove = () => {
    if (isProcessing || currentIndex >= photos.length) return;
  
    if (lastUsedAlbumId) {
      handleMoveToAlbum(lastUsedAlbumId);
    } else {
      setAlbumModalOpen(true);
    }
  };

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (isProcessing || currentIndex >= photos.length) return;
    if (direction === swipeToDeleteDirection) {
      await handleDelete();
    } else {
      handleKeep();
    }
  }, [swipeToDeleteDirection, currentIndex, photos, isProcessing, handleDelete, handleKeep]);

  const handleRename = async (newName: string): Promise<Photo> => {
    if (isProcessing || currentIndex >= photos.length) {
      throw new Error("Aktion derzeit nicht möglich.");
    }
    const photoToRename = photos[currentIndex];
    setIsProcessing(true);
    try {
      const updatedPhoto = await onRenamePhoto(photoToRename, newName);
      console.log(`Umbenannt: ${photoToRename.filename} zu ${updatedPhoto.filename}`);
      return updatedPhoto;
    } catch (e) {
      console.error("Umbenennen fehlgeschlagen.", e);
      throw e; // Re-throw to be caught by the card component
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFavoriteClick = async () => {
    if (isProcessing || currentIndex >= photos.length || isTogglingFavorite) return;
    const photo = photos[currentIndex];
    if (photo.source === 'google') return;

    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(photo);
    } catch(e) {
      console.error("Favorit-Status konnte nicht geändert werden.", e);
      alert(`Der Favorit-Status für ${photo.filename} konnte nicht geändert werden.`);
    } finally {
      setIsTogglingFavorite(false);
    }
  };


  const currentPhoto = photos[currentIndex];
  const nextPhoto = photos[currentIndex + 1];
  const isRenamable = currentPhoto?.source === 'local' || currentPhoto?.source === 'demo';


  return (
    <div className="flex flex-col h-full bg-brand-primary p-4 md:p-6 lg:p-8">
      <header className="w-full max-w-lg mx-auto mb-4">
        <Header 
          title="Foto-Swiper"
          subtitle={collection.name}
          onSettingsClick={() => setSettingsModalOpen(true)}
          onBackClick={() => onBack(currentIndex)}
        />
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="relative w-full h-full max-w-sm max-h-[70vh] aspect-[3/4]">
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-2xl">
              <p className="text-white text-xl">Verarbeite...</p>
            </div>
          )}
          {photos.length > 0 && (
            <AnimatePresence>
              {currentIndex < photos.length ? (
                <>
                  {nextPhoto && (
                    <PhotoCard
                      key={nextPhoto.id}
                      photo={nextPhoto}
                      onSwipe={() => {}}
                      isTop={false}
                      swipeToDeleteDirection={swipeToDeleteDirection}
                      isRenamable={false}
                    />
                  )}
                  {currentPhoto && (
                    <PhotoCard
                      key={currentPhoto.id}
                      photo={currentPhoto}
                      onSwipe={handleSwipe}
                      isTop={true}
                      swipeToDeleteDirection={swipeToDeleteDirection}
                      onRename={handleRename}
                      isRenamable={isRenamable}
                      onToggleFavorite={handleToggleFavoriteClick}
                      isProcessingFavorite={isTogglingFavorite}
                      onMiddleClick={handleMiddleClickMove}
                    />
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <h2 className="text-2xl">Alle Fotos sortiert!</h2>
                  <p>Gehen Sie zurück, um eine andere Quelle auszuwählen.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <footer className="w-full max-w-lg mx-auto mt-4">
        {currentIndex < photos.length && !isProcessing && (
          <ActionButtons
            onDelete={handleDelete}
            onKeep={handleKeep}
            onMove={() => setAlbumModalOpen(true)}
          />
        )}
      </footer>

      <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-5 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {feedbackMessage}
            </motion.div>
          )}
      </AnimatePresence>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentDirection={swipeToDeleteDirection}
        onDirectionChange={onDirectionChange}
      />
      
      <AlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setAlbumModalOpen(false)}
        albums={albums}
        onMove={handleMoveToAlbum}
        onCreateAlbum={isLocal ? onCreateAlbum : undefined}
        isLocal={isLocal}
      />
    </div>
  );
};

export default SwiperView;