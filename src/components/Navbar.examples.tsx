/**
 * Example: Custom Navbar Implementation
 * This file demonstrates how to customize the Navbar component
 */

import React from 'react';
import Navbar from './Navbar';
import type { NavItem } from '../types/navbar.types';

// Custom Icons (Examples)
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="12" rx="1" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </svg>
);

/**
 * Example: Custom Navbar with additional items
 * This example shows how to create a navbar with custom navigation items
 */
export const CustomNavbarExample: React.FC = () => {
  const customItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: DashboardIcon(),
      isActive: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: SettingsIcon(),
    },
  ];

  const handleLoginClick = () => {
    console.log('User clicked login');
    // Navigate to login page or show login modal
  };

  return (
    <Navbar
      brandName="My App"
      brandHref="/"
      navItems={customItems}
      onLoginClick={handleLoginClick}
    />
  );
};

/**
 * Example: Default Navbar (uses predefined items)
 */
export const DefaultNavbarExample: React.FC = () => {
  return (
    <Navbar
      brandName="The Funkies"
      brandHref="/"
    />
  );
};

export default CustomNavbarExample;
