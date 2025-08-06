import React from 'react';
import { CameraIcon, SettingsIcon, ArrowLeftIcon } from './icons';

interface HeaderProps {
  title: string;
  subtitle: string;
  onSettingsClick?: () => void;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onSettingsClick, onBackClick }) => {
  return (
    <div className="text-center relative h-16 flex items-center justify-center">
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="absolute top-1/2 left-0 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-light">{title}</h1>
        <p className="text-gray-400 mt-1">{subtitle}</p>
      </div>
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="absolute top-1/2 right-0 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Einstellungen öffnen"
        >
          <SettingsIcon className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default Header;