'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import { NavItem } from './types';

interface NavbarDropdownProps {
  label: string;
  items: NavItem[];
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  alignment?: 'left' | 'right';
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
  label,
  items,
  icon,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  alignment = 'right',
}) => {
  const pathname = usePathname();

  // Determine if any dropdown item is active
  const hasActiveItem = items.some(item => pathname === item.href);

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {({ open }) => (
        <>
          <Menu.Button
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300
              ${hasActiveItem 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-800 dark:text-gray-200'}
              ${open 
                ? 'bg-gray-100 dark:bg-gray-800' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${buttonClassName}
            `}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
            <svg
              className={`ml-2 h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items
              className={`
                absolute z-50 mt-1 w-56 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                ${alignment === 'left' ? 'left-0' : 'right-0'}
                ${dropdownClassName}
              `}
            >
              <div className="py-1">
                {items.map((item, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={`
                          group flex items-center px-4 py-2 text-sm
                          ${pathname === item.href 
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                            : active 
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'}
                        `}
                      >
                        {item.icon && (
                          <span className={`
                            mr-3 h-5 w-5
                            ${pathname === item.href 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'}
                          `}>
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NavbarDropdown; 