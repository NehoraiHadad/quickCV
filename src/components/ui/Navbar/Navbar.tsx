"use client";

import React from 'react';
import { NavbarProps } from './types';
import useNavbarScroll from '@/hooks/useNavbarScroll';
import useNavbarHeight from '@/hooks/useNavbarHeight';
import useMobileMenu from '@/hooks/useMobileMenu';
import NavbarLogo from './NavbarLogo';
import NavbarDesktopLinks from './NavbarDesktopLinks';
import NavbarMobileMenu from './NavbarMobileMenu';
import MobileMenuButton from './MobileMenuButton';

const Navbar: React.FC<NavbarProps> = ({
  logo,
  title,
  items,
  actions,
  farRightAction,
  sticky = false,
  className = "",
  logoHref = "/",
  children,
}) => {
  const isScrolled = useNavbarScroll(10, sticky);
  useNavbarHeight();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  // Determine navbar container classes
  const navbarClasses = `
    w-full z-50 transition-all duration-300 
    bg-white dark:bg-gray-900 text-gray-800 dark:text-white
    fixed top-0 left-0
    ${isScrolled ? "shadow-md py-1" : "py-2"}
    ${className}
  `;

  return (
    <header className={navbarClasses}>
      <NavbarLogo logo={logo} title={title} logoHref={logoHref} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Empty div to maintain layout spacing where the logo was */}
          <div className="w-44 invisible">
            <div className="h-12"></div>
          </div>

          <NavbarDesktopLinks 
            items={items} 
            actions={actions}
            farRightAction={farRightAction}
          >
            {children}
          </NavbarDesktopLinks>

          <MobileMenuButton isOpen={isOpen} onClick={toggleMenu} />
        </div>
      </div>

      <NavbarMobileMenu
        isOpen={isOpen}
        items={items}
        actions={actions}
        farRightAction={farRightAction}
        onClose={closeMenu}
      >
        {children}
      </NavbarMobileMenu>
    </header>
  );
};

export default Navbar; 