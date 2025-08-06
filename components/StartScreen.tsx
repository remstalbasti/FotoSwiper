import React, { useState } from 'react';
import type { PhotoCollection } from '../types.ts';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FolderIcon, ComputerDesktopIcon, GooglePhotosIcon } from './icons.tsx';
import LicenseModal from './LicenseModal.tsx';

interface StartScreenProps {
  collections: PhotoCollection[];
  onSelectCollection: (collectionName: string) => void;
  onSelectLocalFolder: () => void;
  onConnectGooglePhotos: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const StartScreen: React.FC<StartScreenProps> = ({ collections, onSelectCollection, onSelectLocalFolder, onConnectGooglePhotos }) => {
  const [showDemos, setShowDemos] = useState(false);
  const [isLicenseModalOpen, setLicenseModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-light mb-4">Willkommen beim Foto-Swiper</h1>
            <div className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto space-y-4">
                <p>
                  Sortieren Sie Ihre Fotos einfach und schnell. Laden Sie einen Ordner, wischen Sie zum Löschen oder Behalten und organisieren Sie alles in Alben.
                </p>
                <p className="bg-brand-secondary p-4 rounded-lg border border-gray-600">
                    <span className="font-bold text-brand-accent">Profi-Tipp:</span> In der Einzelbildansicht können Sie mit einem <span className="font-semibold text-white">Mittelklick der Maus</span> ein Foto sofort in das zuletzt verwendete Album verschieben. Das beschleunigt das Sortieren von vielen zusammengehörigen Bildern enorm!
                </p>
            </div>
          </motion.div>

          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
          >
            <button
                onClick={onSelectLocalFolder}
                className="w-full bg-brand-accent hover:bg-blue-400 text-white font-bold py-6 px-8 rounded-xl shadow-lg flex items-center justify-center gap-4 text-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <ComputerDesktopIcon className="w-8 h-8" />
                <span>Lokalen Ordner öffnen</span>
            </button>
          </motion.div>
          
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
                onClick={onConnectGooglePhotos}
                className="flex items-center gap-3 py-2 px-5 rounded-lg bg-brand-secondary hover:bg-gray-600 transition-colors"
            >
                <GooglePhotosIcon className="w-6 h-6" />
                <span>Mit Google Fotos verbinden</span>
            </button>
            <button
                onClick={() => setShowDemos(!showDemos)}
                className="flex items-center gap-3 py-2 px-5 rounded-lg bg-brand-secondary hover:bg-gray-600 transition-colors"
            >
                <FolderIcon className="w-6 h-6 text-brand-accent" />
                <span>{showDemos ? 'Demos ausblenden' : 'Demos ausprobieren'}</span>
            </button>
          </motion.div>
          
          <AnimatePresence>
            {showDemos && (
                <motion.div
                    className="w-full mt-12 max-w-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-2xl font-bold text-center text-brand-light mb-6">Demo-Ordner</h3>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {collections.map((collection) => (
                            <motion.div
                                key={collection.name}
                                className="bg-brand-secondary rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                                onClick={() => onSelectCollection(collection.name)}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="h-48 w-full overflow-hidden">
                                  <img src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="p-5">
                                  <div className="flex items-center gap-3">
                                    <FolderIcon className="w-6 h-6 text-brand-accent" />
                                    <h2 className="text-xl font-bold text-brand-light truncate">{collection.name}</h2>
                                  </div>
                                  <p className="text-gray-400 mt-2">{collection.photos.length} Fotos</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      <footer className="w-full text-center text-gray-500 text-sm py-2 flex-shrink-0">
        <span>Version 1.1.0</span>
        <span className="mx-2">|</span>
        <button onClick={() => setLicenseModalOpen(true)} className="hover:text-brand-accent underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
          Lizenz
        </button>
      </footer>

      <LicenseModal 
        isOpen={isLicenseModalOpen} 
        onClose={() => setLicenseModalOpen(false)} 
      />
    </div>
  );
};

export default StartScreen;
