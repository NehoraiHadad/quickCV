import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarMobileDropdown from '../NavbarMobileDropdown';
import { NavItem } from './types';

interface NavbarMobileMenuProps {
  isOpen: boolean;
  items: NavItem[];
  actions?: React.ReactNode;
  farRightAction?: React.ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isOpen,
  items,
  actions,
  farRightAction,
  children,
  onClose,
}) => {
  const pathname = usePathname();

  // Extract dropdown components and other children
  const navDropdowns: React.ReactElement[] = [];
  const otherChildren: React.ReactElement[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props.items) {
      navDropdowns.push(child);
    } else if (React.isValidElement(child)) {
      otherChildren.push(child);
    }
  });

  return (
    <>
      {/* Mobile Navigation Menu */}
      <div
        className={`
          md:hidden fixed top-[calc(var(--navbar-height,3rem))] left-0 w-full overflow-y-auto transition-all duration-300 ease-in-out z-50
          ${isOpen ? "max-h-[calc(100vh-var(--navbar-height,3rem))] opacity-100" : "max-h-0 opacity-0"}
          bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700
        `}
      >
        {/* Mobile actions first */}
        {actions && (
          <div className="p-4 flex justify-center">
            {actions}
          </div>
        )}

        {/* Mobile dropdowns */}
        {navDropdowns.length > 0 && (
          <div className="p-2">
            {navDropdowns.map((dropdown, index) => (
              <NavbarMobileDropdown
                key={index}
                label={dropdown.props.label}
                items={dropdown.props.items}
                onClick={onClose}
                className="py-2"
              />
            ))}
          </div>
        )}

        {/* Links */}
        <div className="p-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                block px-3 py-3 rounded-md text-base transition-colors duration-300
                ${
                  pathname === item.href
                    ? "font-semibold text-blue-600 border-l-2 border-blue-600 pl-2.5"
                    : "font-medium text-blue-500 hover:text-blue-700 pl-3"
                }
              `}
              onClick={onClose}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Far Right Action (e.g., Exit button) at the bottom */}
        {farRightAction && (
          <div className="p-4 flex justify-center">
            {farRightAction}
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      <div
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-25 z-40" : "opacity-0 pointer-events-none -z-10"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
};

export default NavbarMobileMenu; 