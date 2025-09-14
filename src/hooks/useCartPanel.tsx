import { useState, useCallback, useEffect } from 'react';

export const useCartPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  }, []);

  const togglePanel = useCallback(() => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [isOpen, openPanel, closePanel]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closePanel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return {
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
  };
};