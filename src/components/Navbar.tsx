import React from 'react';
import NavLink from './NavLink';
import NavbarMobileToggle from './NavbarMobileToggle';
import type { NavItem, NavbarProps } from '../types/navbar.types';

// SVG Icons
const HomeIcon = () => (
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
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const AccountIcon = () => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const WorkIcon = () => (
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
    <path d="M12 12h.01" />
    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <path d="M22 13a18.15 18.15 0 0 1-20 0" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
);

const BlogIcon = () => (
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
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </svg>
);

const LoginIcon = () => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/**
 * Navbar component - Main navigation bar with responsive design
 * Features:
 * - Responsive design (mobile hamburger menu)
 * - Customizable brand name and items
 * - Preline.js integration for collapse functionality
 * - Accessibility features (ARIA labels, semantic HTML)
 *
 * @param brandName - Brand/logo text (default: "Brand")
 * @param brandHref - Brand link URL (default: "#")
 * @param navItems - Array of navigation items (default: predefined items)
 * @param onLoginClick - Callback for login button click
 */
const Navbar: React.FC<NavbarProps> = ({
  brandName = 'Brand',
  brandHref = '#',
  navItems,
  onLoginClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Default navigation items
  const defaultNavItems: NavItem[] = [
    { id: 'landing', label: 'Landing', href: '#', icon: HomeIcon(), isActive: true },
    { id: 'account', label: 'Account', href: '#', icon: AccountIcon() },
    { id: 'work', label: 'Work', href: '#', icon: WorkIcon() },
    { id: 'blog', label: 'Blog', href: '#', icon: BlogIcon() },
  ];

  const items = navItems || defaultNavItems;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-blue-600">
      <nav className="relative max-w-5xl w-full md:flex md:items-center md:justify-between md:gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo w/ Collapse Button */}
        <div className="flex items-center justify-between">
          <a
            href={brandHref}
            className="flex-none font-semibold text-xl text-white focus:outline-hidden focus:opacity-80"
            aria-label="Brand"
          >
            {brandName}
          </a>

          {/* Mobile Toggle Button */}
          <div onClick={handleMenuToggle}>
            <NavbarMobileToggle isOpen={isMenuOpen} />
          </div>
        </div>

        {/* Navigation Menu */}
        <div
          id="hs-base-header"
          className={`hs-collapse ${isMenuOpen ? '' : 'hidden'} overflow-hidden transition-all duration-300 basis-full grow md:block`}
          aria-labelledby="hs-base-header-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">
              {/* Navigation Links */}
              {items.map((item) => (
                <NavLink
                  key={item.id}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={item.isActive}
                  isMobile={true}
                />
              ))}

              {/* Login Button Group */}
              <div className="relative flex flex-wrap items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-white/30 before:-translate-y-1/2">
                <button
                  onClick={onLoginClick}
                  type="button"
                  className="p-2 w-full flex items-center text-sm text-white/80 hover:text-white focus:outline-hidden focus:text-white cursor-pointer"
                  aria-label="Log in"
                >
                  <LoginIcon />
                  <span className="ms-3 md:ms-2">Log in</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
