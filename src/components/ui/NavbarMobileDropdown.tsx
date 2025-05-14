'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface NavbarMobileDropdownProps {
  label: string;
  items: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavbarMobileDropdown: React.FC<NavbarMobileDropdownProps> = ({
  label,
  items,
  icon,
  className = '',
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleItemClick = () => {
    setIsOpen(false);
    if (onClick) onClick();
  };

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-3 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-base font-medium">{label}</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="py-1 bg-gray-50 dark:bg-gray-900">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                block pl-8 pr-3 py-2 text-sm transition-colors duration-300
                ${pathname === item.href 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
              onClick={handleItemClick}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavbarMobileDropdown; 