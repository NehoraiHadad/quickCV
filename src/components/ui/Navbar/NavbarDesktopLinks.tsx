import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './types';

interface NavbarDesktopLinksProps {
  items: NavItem[];
  children?: React.ReactNode;
  actions?: React.ReactNode;
  farRightAction?: React.ReactNode;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  items,
  children,
  actions,
  farRightAction,
}) => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center w-full">
      {/* Left section: Actions */}
      <div className="flex-initial flex justify-start">
        {actions && <div>{actions}</div>}
      </div>

      {/* Middle section: Dropdowns */}
      <div className="flex-grow flex justify-center">
        {children}
      </div>

      {/* Right section: Links and FarRightAction */}
      <div className="flex-initial flex justify-end items-center">
        <nav className="flex items-center space-x-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                px-3 py-1.5 text-sm transition-colors duration-300
                ${pathname === item.href 
                  ? "font-semibold text-blue-600 border-b-2 border-blue-600" 
                  : "font-medium text-blue-500 hover:text-blue-700"
                }
              `}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        {farRightAction && <div className="ml-4">{farRightAction}</div>}
      </div>
    </div>
  );
};

export default NavbarDesktopLinks; 