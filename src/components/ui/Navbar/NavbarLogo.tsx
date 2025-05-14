import React from 'react';
import Link from 'next/link';

interface NavbarLogoProps {
  logo?: React.ReactNode;
  title?: string;
  logoHref?: string;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({
  logo,
  title,
  logoHref = '/',
}) => {
  return (
    <div className="absolute left-0 top-0 h-full w-56 bg-white dark:bg-white transform skew-x-[-20deg] -translate-x-6 shadow-md z-0 flex items-center justify-center">
      {/* Logo container with counter-transform to keep it straight */}
      <div className="transform skew-x-[20deg] flex items-center justify-center">
        <Link href={logoHref} className="flex items-center justify-center group">
          <div className="transform transition-transform group-hover:scale-105">
            {logo}
          </div>
          {title && (
            <h1 className="text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-blue-600 text-gray-800">
              {title}
            </h1>
          )}
        </Link>
      </div>
    </div>
  );
};

export default NavbarLogo; 