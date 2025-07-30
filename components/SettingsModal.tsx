import React from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDirection: 'left' | 'right';
  onDirectionChange: (direction: 'left' | 'right') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentDirection, onDirectionChange }) => {
  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } },
    exit: { y: "100vh", opacity: 0 }
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
          onClick={onClose}
        >
          <motion.div
            className="bg-brand-secondary rounded-xl w-full max-w-md p-6"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-brand-light">Einstellungen</h2>

            <div className="space-y-4">
              <p className="text-gray-300">Aktion für Wischen:</p>
              
              <div
                onClick={() => onDirectionChange('right')}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors border-2 ${currentDirection === 'right' ? 'bg-brand-accent border-brand-accent' : 'border-gray-700 hover:bg-gray-600'}`}
              >
                 <label className="w-full cursor-pointer text-lg">Rechts wischen zum Löschen</label>
              </div>

              <div
                onClick={() => onDirectionChange('left')}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors border-2 ${currentDirection === 'left' ? 'bg-brand-accent border-brand-accent' : 'border-gray-700 hover:bg-gray-600'}`}
              >
                <label className="w-full cursor-pointer text-lg">Links wischen zum Löschen</label>
              </div>

            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Schließen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;