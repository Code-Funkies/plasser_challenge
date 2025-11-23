import React from 'react';

/**
 * Navigation item configuration
 * @interface NavItem
 * @property {string} id - Unique identifier for the navigation item
 * @property {string} label - Display text for the link
 * @property {string} href - URL destination for the link
 * @property {React.ReactNode} [icon] - Optional SVG icon component
 * @property {boolean} [isActive] - Whether this link represents the current page
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

/**
 * Navigation link properties
 * @interface NavLinkProps
 */
export interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
}

/**
 * Mobile toggle button properties
 * @interface NavbarMobileToggleProps
 */
export interface NavbarMobileToggleProps {
  isOpen: boolean;
}

/**
 * Main navbar component properties
 * @interface NavbarProps
 * @property {string} [brandName] - Brand/logo text (default: "Brand")
 * @property {string} [brandHref] - Brand link URL (default: "#")
 * @property {NavItem[]} [navItems] - Array of navigation items
 * @property {() => void} [onLoginClick] - Callback function for login button click
 */
export interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  navItems?: NavItem[];
  onLoginClick?: () => void;
}
