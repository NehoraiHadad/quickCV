/**
 * Utility functions for Navbar styling
 * 
 * Note: This file is kept for backward compatibility but most functions
 * have been deprecated in favor of direct Tailwind classes in components.
 */

// These type definitions are kept for backward compatibility
export type NavbarVariant = "default" | "transparent" | "colored";
export type NavbarColorScheme = "blue" | "gray" | "custom";

// This is a deprecated utility - keeping for backward compatibility
export const getNavbarColorSchemeClasses = (): string => {
  console.warn('getNavbarColorSchemeClasses is deprecated');
  return "bg-white dark:bg-gray-900 text-gray-800 dark:text-white";
};

// This is a deprecated utility - keeping for backward compatibility
export const getActiveLinkClasses = (): string => {
  console.warn('getActiveLinkClasses is deprecated');
  return "font-semibold text-blue-600 border-b-2 border-blue-600";
};

// This is a deprecated utility - keeping for backward compatibility
export const getInactiveLinkHoverClasses = (): string => {
  console.warn('getInactiveLinkHoverClasses is deprecated');
  return "font-medium text-gray-700 hover:text-blue-600";
}; 