import React from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  title?: string;
  items: NavItem[];
  actions?: React.ReactNode;
  farRightAction?: React.ReactNode;
  sticky?: boolean;
  className?: string;
  logoHref?: string;
  children?: React.ReactNode;
} 