import React, { useState, useEffect, useRef } from 'react';
import type { Photo } from '../types.ts';
import { motion, useMotionValue, useTransform, type Variants } from 'framer-motion';
import { PencilIcon, XMarkIcon, CheckIcon, StarIcon, ArrowsPointingOutIcon } from './icons.tsx';

interface PhotoCardProps {
  photo: Photo;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  swipeToDeleteDirection: 'left' | 'right';
  onRename?: (newName: string) => Promise<Photo>;
  isRenamable?: boolean;
  onToggleFavorite?: () => Promise<void>;
  isProcessingFavorite?: boolean;
  onMiddleClick?: () => void;
}

const FAVORITE_SUFFIX = '_FAV';

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onSwipe, isTop, swipeToDeleteDirection, onRename, isRenamable, onToggleFavorite, isProcessingFavorite, onMiddleClick }) => {
  const x = useMotionValue(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const getBaseName = (filename: string, isFavorite?: boolean) => {
    let name = filename;
    if (isFavorite) {
        const favIndex = name.lastIndexOf(FAVORITE_SUFFIX);
        if (favIndex !== -1) {
            name = name.substring(0, favIndex) + name.substring(favIndex + FAVORITE_SUFFIX.length);
        }
    }
    return name;
  };
  
  const [editedName, setEditedName] = useState(getBaseName(photo.filename, photo.isFavorite));
  const [renameError, setRenameError] = useState('');
  const [isSavingRename, setIsSavingRename] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setEditedName(getBaseName(photo.filename, photo.isFavorite));
    setRenameError('');
  }, [photo]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
        const baseName = getBaseName(photo.filename, photo.isFavorite);
        const dotIndex = baseName.lastIndexOf('.');
        if (dotIndex > 0) {
            inputRef.current.setSelectionRange(0, dotIndex);
        } else {
            inputRef.current.select();
        }
    }
  }, [isEditing, photo.filename, photo.isFavorite]);

  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const rightOpacity = useTransform(x, [20, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number, y: number }, velocity: { x: number, y: number } }) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTop && e.button === 1 && onMiddleClick) {
        e.preventDefault();
        onMiddleClick();
    }
  }

  const handleRenameStart = () => {
    if (isTop) setIsEditing(true);
  };

  const handleRenameCancel = () => {
    setIsEditing(false);
    setEditedName(getBaseName(photo.filename, photo.isFavorite));
    setRenameError('');
  };

  const handleRenameSave = async () => {
    if (!onRename || editedName === getBaseName(photo.filename, photo.isFavorite) || !editedName.trim()) {
      handleRenameCancel();
      return;
    }
    setIsSavingRename(true);
    setRenameError('');
    try {
      await onRename(editedName.trim());
      setIsEditing(false);
    } catch (e: any) {
      setRenameError(e.message || 'Fehler beim Umbenennen.');
    } finally {
      setIsSavingRename(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameSave();
    if (e.key === 'Escape') handleRenameCancel();
  };
  
  const handleToggleFullscreen = () => {
    if (!isTop) return;
    const elem = imgRef.current || videoRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  const cardVariants: Variants = {
    initial: {
      scale: 0.8,
      y: 50,
      opacity: 0,
    },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      x: x.get() > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const rightActionText = swipeToDeleteDirection === 'right' ? 'LÖSCHEN' : 'BEHALTEN';
  const leftActionText = swipeToDeleteDirection === 'left' ? 'LÖSCHEN' : 'BEHALTEN';
  const rightActionStyle = swipeToDeleteDirection === 'right' ? 'text-red-500 border-red-500' : 'text-green-500 border-green-500';
  const leftActionStyle = swipeToDeleteDirection === 'left' ? 'text-red-500 border-red-500' : 'text-green-500 border-green-500';

  const canDrag = isTop;

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        zIndex: isTop ? 10 : 1,
      }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className={`relative w-full h-full shadow-2xl rounded-2xl bg-brand-secondary overflow-hidden ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
        drag={canDrag ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        style={{
          x,
          rotate,
        }}
      >
        {isDragging && photo.type === 'video' && <div className="absolute inset-0 z-10" />}

        {photo.type === 'image' ? (
          <img
            ref={imgRef}
            src={photo.url}
            alt={photo.filename}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <video
            ref={videoRef}
            src={photo.url}
            controls
            autoPlay={false}
            loop={false}
            className="w-full h-full object-contain bg-black"
          />
        )}
        
        <div className="absolute top-3 right-3 z-20 flex gap-2">
            <button
                onClick={handleToggleFullscreen}
                disabled={!isTop}
                aria-label="Vollbild"
                title="Vollbild umschalten"
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowsPointingOutIcon className="w-6 h-6 text-white" />
            </button>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                disabled={photo.source === 'google' || isProcessingFavorite}
                aria-label="Als Favorit markieren"
                title={photo.source === 'google' ? "Favoriten von Google Fotos können hier nicht geändert werden." : "Als Favorit markieren"}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <StarIcon className={`w-6 h-6 ${photo.isFavorite ? 'text-yellow-400' : 'text-white'}`} fill={photo.isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            {isEditing ? (
              <div>
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow bg-gray-800 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                    <button onClick={handleRenameSave} disabled={isSavingRename} className="p-1">
                        <CheckIcon className="w-6 h-6 text-green-500 hover:text-green-400" />
                    </button>
                    <button onClick={handleRenameCancel} className="p-1">
                        <XMarkIcon className="w-6 h-6 text-red-500 hover:text-red-400" />
                    </button>
                </div>
                {renameError && <p className="text-red-400 text-xs mt-1">{renameError}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                    <p className="text-white text-lg font-semibold truncate">{photo.filename}</p>
                    {photo.path && <p className="text-gray-300 text-sm truncate">{photo.path}</p>}
                </div>
                {isRenamable && onRename && (
                    <button onClick={handleRenameStart} aria-label="Dateiname bearbeiten" className="p-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0">
                        <PencilIcon className="w-5 h-5 text-white" />
                    </button>
                )}
              </div>
            )}
          </div>
        </div>

        {canDrag && (
          <>
            <motion.div
              style={{ opacity: rightOpacity }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold border-4 rounded-xl px-4 py-2 pointer-events-none ${rightActionStyle}`}
            >
              {rightActionText}
            </motion.div>
            <motion.div
              style={{ opacity: leftOpacity }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold border-4 rounded-xl px-4 py-2 pointer-events-none ${leftActionStyle}`}
            >
              {leftActionText}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PhotoCard;
