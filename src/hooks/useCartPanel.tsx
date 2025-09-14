import { useState, useEffect, useCallback } from 'react';

export const useCartPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    setIsAnimating(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  }, []);

  const togglePanel = useCallback(() => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [isOpen, openPanel, closePanel]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closePanel]);

  return {
    isOpen,
    isAnimating,
    openPanel,
    closePanel,
    togglePanel,
  };
};