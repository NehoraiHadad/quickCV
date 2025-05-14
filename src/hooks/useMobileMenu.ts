import { useState, useEffect } from 'react';

/**
 * Hook to manage mobile menu state
 * Handles body scroll locking and responsive resizing
 * @returns Mobile menu state and toggle function
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isOpen,
    toggleMenu: () => setIsOpen(!isOpen),
    closeMenu: () => setIsOpen(false)
  };
};

export default useMobileMenu; 