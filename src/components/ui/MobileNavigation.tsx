import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface MobileNavigationProps {
  items: NavItem[];
  logo?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  logo,
  title,
  actions,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close the navigation when the window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent scrolling when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      {/* Header with hamburger button */}
      <header className={`bg-blue-600 text-white py-4 px-6 shadow flex justify-between items-center z-40 relative ${className}`}>
        <div className="flex items-center justify-center flex-grow">
          {logo && logo}
          {title && <h1 className="text-xl font-bold ml-2">{title}</h1>}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Optional actions shown in header */}
          <div className="hidden sm:block">{actions}</div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </header>
      
      {/* Mobile navigation overlay */}
      <div 
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden 
          transition-opacity duration-300 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Mobile navigation menu */}
      <nav
        className={`
          fixed top-0 right-0 h-full bg-white w-4/5 max-w-sm z-40 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          overflow-y-auto pt-20 pb-4 flex flex-col
        `}
      >
        <div className="px-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left py-3 px-4 rounded transition-colors duration-300
                    ${item.isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-100'}
                  `}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile actions shown at bottom of navigation */}
        {actions && (
          <div className="mt-auto px-4 py-4 border-t border-gray-200">
            {actions}
          </div>
        )}
      </nav>
    </>
  );
};

export default MobileNavigation; 