import React from 'react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <div className="md:hidden absolute right-4">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center p-2 rounded-md text-current hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="sr-only">
          {isOpen ? "Close menu" : "Open menu"}
        </span>
        <div className="relative w-6 h-6">
          <span
            className={`
              absolute top-0 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out
              ${isOpen ? "rotate-45 top-3" : ""}
            `}
          ></span>
          <span
            className={`
              absolute top-0 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out
              ${isOpen ? "opacity-0" : "top-3"}
            `}
          ></span>
          <span
            className={`
              absolute top-0 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out
              ${isOpen ? "-rotate-45 top-3" : "top-6"}
            `}
          ></span>
        </div>
      </button>
    </div>
  );
};

export default MobileMenuButton; 