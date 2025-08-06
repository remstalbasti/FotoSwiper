import React, { useState } from 'react';
import type { Album } from '../types.ts';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albums: Album[];
  onMove: (albumId: string) => void;
  onCreateAlbum?: (albumName: string) => Promise<void>;
  isLocal?: boolean;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ isOpen, onClose, albums, onMove, onCreateAlbum, isLocal }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleMoveClick = () => {
    if (selectedAlbum) {
      onMove(selectedAlbum);
    }
  };

  const handleCreateClick = async () => {
    if (!newAlbumName.trim() || !onCreateAlbum) return;
    setIsSaving(true);
    try {
        await onCreateAlbum(newAlbumName.trim());
        setSelectedAlbum(newAlbumName.trim());
        setNewAlbumName("");
        setIsCreating(false);
    } catch(e) {
        alert("Album konnte nicht erstellt werden. Vielleicht existiert der Ordner bereits.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedAlbum(null);
    setIsCreating(false);
    setNewAlbumName("");
    onClose();
  };

  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div
            className="bg-brand-secondary rounded-xl w-full max-w-md p-6"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-brand-light">In Album verschieben</h2>

            {isLocal && onCreateAlbum && (
              <AnimatePresence>
                {isCreating ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newAlbumName}
                            onChange={(e) => setNewAlbumName(e.target.value)}
                            placeholder="Name des neuen Albums"
                            className="flex-grow bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateClick}
                            disabled={!newAlbumName.trim() || isSaving}
                            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? '...' : 'OK'}
                        </button>
                    </div>
                  </motion.div>
                ) : (
                   <div className="mb-4">
                     <button onClick={() => setIsCreating(true)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-brand-accent">
                         + Neues Album erstellen
                     </button>
                   </div>
                )}
              </AnimatePresence>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {albums.length === 0 && !isCreating && (
                   <p className="text-gray-400 p-3">Keine Alben (Ordner) gefunden.</p>
              )}
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedAlbum === album.id ? 'bg-brand-accent' : 'hover:bg-gray-600'}`}
                >
                  <input
                    type="radio"
                    id={album.id}
                    name="album"
                    value={album.id}
                    checked={selectedAlbum === album.id}
                    onChange={() => setSelectedAlbum(album.id)}
                    className="hidden"
                  />
                  <label htmlFor={album.id} className="w-full cursor-pointer text-lg">{album.title}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleMoveClick}
                disabled={!selectedAlbum}
                className="px-6 py-2 rounded-md bg-brand-accent hover:bg-blue-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                Verschieben
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlbumModal;