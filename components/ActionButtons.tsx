import React from 'react';
import { TrashIcon, FolderArrowDownIcon, CheckIcon } from './icons.tsx';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  onDelete: () => void;
  onKeep: () => void;
  onMove: () => void;
}

const buttonVariants = {
  hover: { scale: 1.1, y: -4 },
  tap: { scale: 0.95, y: 0 },
};

const ActionButton: React.FC<{
  onClick: () => void;
  className: string;
  size?: 'base' | 'large';
  children: React.ReactElement<{ className?: string }>;
  'aria-label': string;
}> = ({ onClick, className, size = 'large', children, 'aria-label': ariaLabel }) => {
    const sizeClasses = size === 'large' ? 'w-20 h-20' : 'w-16 h-16';
    const iconSize = size === 'large' ? 'w-10 h-10' : 'w-8 h-8';

    return (
        <motion.button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`flex items-center justify-center rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-brand-primary transition-transform ${sizeClasses} ${className}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
        >
            {React.cloneElement(children, { className: `${iconSize} text-white`})}
        </motion.button>
    );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onDelete, onKeep, onMove }) => {
  return (
    <div className="flex justify-around items-center w-full">
      <ActionButton onClick={onKeep} className="bg-green-500 hover:bg-green-400 focus:ring-green-300" aria-label="Foto behalten">
        <CheckIcon />
      </ActionButton>
      <ActionButton onClick={onMove} size="base" className="bg-brand-accent hover:bg-blue-400 focus:ring-blue-300" aria-label="In Album verschieben">
        <FolderArrowDownIcon />
      </ActionButton>
      <ActionButton onClick={onDelete} className="bg-red-600 hover:bg-red-500 focus:ring-red-400" aria-label="Foto löschen">
        <TrashIcon />
      </ActionButton>
    </div>
  );
};

export default ActionButtons;