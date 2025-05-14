import { useState, useEffect } from 'react';

/**
 * Hook to handle navbar scroll state
 * @param threshold Scroll position threshold to trigger state change
 * @param enabled Whether the scroll effect is enabled
 * @returns Current scroll state
 */
export const useNavbarScroll = (threshold = 10, enabled = true): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, enabled]);

  return isScrolled;
};

export default useNavbarScroll; 