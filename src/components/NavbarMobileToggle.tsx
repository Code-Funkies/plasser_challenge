import React from 'react';
import type { NavbarMobileToggleProps } from '../types/navbar.types';

/**
 * NavbarMobileToggle component - Renders hamburger menu for mobile
 * Provides animated hamburger/close icons for mobile navigation toggle
 *
 * @component
 * @param isOpen - Whether the menu is currently expanded
 *
 * @example
 * <NavbarMobileToggle isOpen={menuIsOpen} />
 */
const NavbarMobileToggle: React.FC<NavbarMobileToggleProps> = ({ isOpen }) => {
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="hs-collapse-toggle relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-white/50 text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
        id="hs-base-header-collapse"
        aria-expanded={isOpen}
        aria-controls="hs-base-header"
        aria-label="Toggle navigation"
        data-hs-collapse="#hs-base-header"
      >
        {/* Hamburger Menu Icon */}
        <svg
          className={`hs-collapse-open:hidden ${isOpen ? 'hidden' : ''} size-4`}
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
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>

        {/* Close Icon */}
        <svg
          className={`hs-collapse-open:block ${isOpen ? '' : 'hidden'} shrink-0 size-4`}
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Toggle navigation</span>
      </button>
    </div>
  );
};

export default NavbarMobileToggle;
