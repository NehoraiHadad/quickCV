import { useEffect } from 'react';

/**
 * Hook to manage navbar height CSS variable
 * Updates the --navbar-height CSS variable based on the header element's height
 */
export const useNavbarHeight = () => {
  useEffect(() => {
    const setNavbarHeight = () => {
      const navbarElement = document.querySelector("header");
      if (navbarElement) {
        const height = navbarElement.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${height}px`
        );
      }
    };

    setNavbarHeight();
    window.addEventListener("resize", setNavbarHeight);
    window.addEventListener("scroll", setNavbarHeight);
    
    return () => {
      window.removeEventListener("resize", setNavbarHeight);
      window.removeEventListener("scroll", setNavbarHeight);
    };
  }, []);
};

export default useNavbarHeight; 