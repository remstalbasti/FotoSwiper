import React, { useRef, useEffect } from 'react';
import type { PhotoCollection } from '../types';
import { motion, type Variants } from 'framer-motion';
import Header from './Header';
import { PlayCircleIcon, StarIcon } from './icons';

interface PhotoGridProps {
  collection: PhotoCollection;
  onSelectPhoto: (index: number) => void;
  onBack: () => void;
  lastViewedIndex?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
    },
  },
};

const PhotoGrid: React.FC<PhotoGridProps> = ({ collection, onSelectPhoto, onBack, lastViewedIndex }) => {
  const itemRefs = useRef(new Map<string, HTMLDivElement | null>());

  useEffect(() => {
    if (lastViewedIndex && lastViewedIndex > 0 && collection.photos.length > 0) {
      // Clamp index to be safe. If user swiped all photos, scroll to last one.
      const indexToScroll = Math.min(lastViewedIndex, collection.photos.length - 1);
      const photoId = collection.photos[indexToScroll]?.id;
      if (!photoId) return;
      
      const element = itemRefs.current.get(photoId);

      if (element) {
        // Timeout ensures that the scroll happens after render and animations.
        setTimeout(() => {
            element.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }, 100);
      }
    }
  }, []); // Eslint-disable-line react-hooks/exhaustive-deps. We want this to run only once on mount.


  return (
    <div className="flex flex-col h-full w-full">
      <header className="w-full max-w-5xl mx-auto px-4">
         <Header 
            title={collection.name}
            subtitle={`${collection.photos.length} Medien zum Sortieren`}
            onBackClick={onBack}
         />
      </header>
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {collection.photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              ref={node => {
                if (node) {
                  itemRefs.current.set(photo.id, node);
                } else {
                  itemRefs.current.delete(photo.id);
                }
              }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-brand-secondary group shadow-md"
              onClick={() => onSelectPhoto(index)}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.filename}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                loading="lazy"
              />
              {photo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
                      <PlayCircleIcon className="w-12 h-12 text-white opacity-80 drop-shadow-lg" />
                  </div>
              )}
              {photo.isFavorite && (
                 <div className="absolute top-1 right-1 p-1 bg-black/50 rounded-full pointer-events-none">
                    <StarIcon className="w-4 h-4 text-yellow-400" fill="currentColor" />
                 </div>
              )}
              {photo.path && (
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                  <p className="text-white text-xs truncate text-center px-1">{photo.path}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default PhotoGrid;