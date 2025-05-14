'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = 'bg-blue-600 text-white',
  inactiveClassName = 'hover:bg-gray-100 dark:hover:bg-gray-800',
  exact = true,
  onClick,
}) => {
  const pathname = usePathname();
  
  // Check if the link is active
  const isActive = exact
    ? pathname === href
    : pathname?.startsWith(href) && href !== '/';
  
  // Combine the classes
  const linkClasses = `
    px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300
    ${className}
    ${isActive ? activeClassName : inactiveClassName}
  `;
  
  return (
    <Link 
      href={href} 
      className={linkClasses}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavbarLink; 