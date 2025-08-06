import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowLeftIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDirection: 'left' | 'right';
  onDirectionChange: (direction: 'left' | 'right') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentDirection, onDirectionChange }) => {
  const [view, setView] = useState<'main' | 'help'>('main');
  // Richtung für die Animation: 1 bedeutet, neue Ansicht kommt von rechts, -1 von links
  const [animationDirection, setAnimationDirection] = useState(1);

  const handleNavigateToHelp = () => {
    setAnimationDirection(1);
    setView('help');
  };

  const handleNavigateToMain = () => {
    setAnimationDirection(-1);
    setView('main');
  };

  const handleClose = () => {
    // Ansicht beim Schließen des Modals zurücksetzen (nach der Animation)
    setTimeout(() => setView('main'), 300);
    onClose();
  };

  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "-50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 100 } },
    exit: { y: "50px", opacity: 0, transition: { duration: 0.2 } },
  };
  
  const viewVariants: Variants = {
    initial: (direction: number) => ({ x: `${direction * 100}%`, opacity: 0 }),
    animate: { x: '0%', opacity: 1, transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 } },
    exit: (direction: number) => ({ x: `${direction * -100}%`, opacity: 0, transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 } }),
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
            className="bg-brand-secondary rounded-xl w-full max-w-lg p-6 flex flex-col overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh', minHeight: '420px' }}
          >
            <AnimatePresence mode="wait" custom={animationDirection}>
              {view === 'main' ? (
                <motion.div
                  key="main"
                  custom={animationDirection}
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex-1 flex flex-col min-h-0"
                >
                  <h2 className="text-2xl font-bold mb-6 text-brand-light">Einstellungen</h2>
                  <div className="space-y-4 flex-grow">
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
                    <div className="pt-4">
                      <button onClick={handleNavigateToHelp} className="text-brand-accent hover:underline">
                        Hilfe & Funktionen anzeigen
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                    >
                      Schließen
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="help"
                  custom={animationDirection}
                  variants={viewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full flex-1 flex flex-col min-h-0"
                >
                  <div className="flex items-center mb-4 flex-shrink-0">
                      <button onClick={handleNavigateToMain} className="p-2 -ml-2 mr-2 text-gray-400 hover:text-white transition-colors" aria-label="Zurück zu den Einstellungen">
                          <ArrowLeftIcon className="w-6 h-6" />
                      </button>
                      <h2 className="text-2xl font-bold text-brand-light">Hilfe & Funktionen</h2>
                  </div>
                  <div className="flex-grow overflow-y-auto pr-2 -mr-4 text-gray-300 space-y-4 text-base">
                      <p>Hier ist eine Übersicht über alle Funktionen der App.</p>

                      <div>
                          <h3 className="text-lg font-semibold text-brand-light mb-2">1. Fotos laden</h3>
                          <ul className="list-disc list-inside space-y-1 pl-2">
                              <li><span className="font-semibold">Lokaler Ordner:</span> Wählen Sie einen Ordner auf Ihrem Computer aus. Die App liest alle unterstützten Bilder und Videos aus dem Hauptordner und allen Unterordnern.</li>
                              <li><span className="font-semibold">Google Fotos:</span> Verbinden Sie sich mit Ihrem Google-Konto, um die neuesten 50 Fotos zu laden. Lösch-Aktionen archivieren die Fotos in Google Fotos in einem "Swiper-Archiv"-Album.</li>
                              <li><span className="font-semibold">Demo-Ordner:</span> Probieren Sie die App mit vorinstallierten Beispielbildern aus, ohne eigene Dateien laden zu müssen.</li>
                          </ul>
                      </div>

                      <div>
                          <h3 className="text-lg font-semibold text-brand-light mb-2">2. Die Wisch-Ansicht (Swiper)</h3>
                           <ul className="list-disc list-inside space-y-1 pl-2">
                              <li><span className="font-semibold">Wischen (Swipen):</span> Wischen Sie ein Foto nach links oder rechts, um es zu behalten oder zu löschen (konfigurierbar in den Einstellungen).</li>
                              <li><span className="font-semibold">Aktionsknöpfe:</span> Nutzen Sie die Knöpfe unten für die Aktionen: Grün (Behalten), Rot (Löschen), Blau (Verschieben).</li>
                              <li><span className="font-semibold">Verschieben:</span> Der blaue Ordner-Knopf öffnet eine Liste aller Alben (Unterordner) zum Verschieben des Fotos.</li>
                              <li><span className="font-semibold">Umbenennen:</span> Klicken Sie auf das Stift-Symbol, um die Datei umzubenennen (nur bei lokalen Dateien).</li>
                              <li><span className="font-semibold">Favoriten:</span> Klicken Sie auf den Stern oben rechts, um eine lokale Datei als Favorit zu markieren (fügt `_FAV` zum Dateinamen hinzu).</li>
                              <li><span className="font-semibold">Vollbild:</span> Das Vergrößern-Symbol oben rechts zeigt das Medium im ablenkungsfreien Vollbildmodus.</li>
                          </ul>
                      </div>
                      
                      <div>
                          <h3 className="text-lg font-semibold text-brand-light mb-2">3. Profi-Tipps für schnelles Arbeiten</h3>
                          <ul className="list-disc list-inside space-y-1 pl-2">
                              <li><span className="font-semibold">Super-Verschieben:</span> Klicken Sie mit der mittleren Maustaste auf ein Foto, um es sofort in das zuletzt verwendete Album zu verschieben.</li>
                              <li><span className="font-semibold">Tastatur-Shortcuts:</span> Beim Umbenennen `Enter` zum Speichern und `Escape` zum Abbrechen verwenden.</li>
                          </ul>
                      </div>
                      
                      <div>
                          <h3 className="text-lg font-semibold text-brand-light mb-2">4. Einstellungen</h3>
                           <p>Im Einstellungsmenü können Sie die Wisch-Richtung für die Lösch-Aktion festlegen. Ihre Auswahl wird für zukünftige Sitzungen gespeichert.</p>
                      </div>
                  </div>
                   <div className="flex justify-end gap-4 mt-6 flex-shrink-0">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                    >
                      Schließen
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;