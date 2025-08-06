import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { KeyIcon } from './icons.tsx';

interface GoogleApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, clientId: string) => void;
}

const GoogleApiModal: React.FC<GoogleApiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');

  const handleSave = () => {
    if (apiKey.trim() && clientId.trim()) {
      onSave(apiKey.trim(), clientId.trim());
    }
  };

  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "-50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } },
    exit: { y: "50px", opacity: 0 }
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
            className="bg-brand-secondary rounded-xl w-full max-w-lg p-6"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-6">
                <div className="bg-brand-accent p-3 rounded-full mr-4">
                    <KeyIcon className="w-6 h-6 text-white"/>
                </div>
                <h2 className="text-2xl font-bold text-brand-light">Google API-Zugangsdaten</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Bitte geben Sie Ihren Google API-Schlüssel und Ihre Client-ID ein, um auf Google Fotos zuzugreifen. Diese finden Sie in Ihrer <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">Google Cloud Console</a>.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">API-Schlüssel</label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ihren API-Schlüssel hier einfügen"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-300 mb-1">Client-ID</label>
                <input
                  type="text"
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Ihre Client-ID hier einfügen"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim() || !clientId.trim()}
                className="px-6 py-2 rounded-md bg-brand-accent hover:bg-blue-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                Speichern & Verbinden
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoogleApiModal;
