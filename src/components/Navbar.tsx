import React from 'react';
import { Link } from 'react-router-dom';

// Data icon
const DataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="me-2">
    <rect x="3" y="11" width="4" height="7" rx="1"/>
    <rect x="9" y="7" width="4" height="11" rx="1"/>
    <rect x="15" y="4" width="4" height="14" rx="1"/>
  </svg>
);
// Reports icon
const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="me-2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M8 9h8M8 13h6M8 17h4"/>
  </svg>
);
// Search icon
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  onLoginClick?: () => void;
}

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

const Navbar: React.FC<NavbarProps> = ({ brandName, brandHref, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-black py-2 px-4 rounded-3xl shadow-lg mt-1">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo y hamburguesa */}
        <div className="flex items-center gap-4">
          <Link to={brandHref || '/'} className="flex items-center justify-center h-12 px-6 rounded-full bg-transparent border-2 border-[#FEC900] shadow font-extrabold text-white text-xl tracking-wide transition-all hover:scale-105 focus:outline-none mr-2">
            {brandName || 'Plasser'}
          </Link>
          {/* Hamburguesa solo en móvil */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-white hover:bg-[#FEC900] hover:text-[#003576] transition-all focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {/* Icono hamburguesa */}
            <svg className={menuOpen ? 'hidden' : 'block'} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            {/* Icono cerrar */}
            <svg className={menuOpen ? 'block' : 'hidden'} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Centered nav buttons (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="flex items-center px-5 py-2 rounded-full bg-neutral-900 text-white font-medium text-base shadow-sm hover:bg-[#FEC900] hover:text-[#003576] transition-all focus:outline-none gap-2">
            <DataIcon />
            Monitoring
          </Link>
          <Link to="/report" className="flex items-center px-5 py-2 rounded-full bg-neutral-900 text-white font-medium text-base shadow-sm hover:bg-[#FEC900] hover:text-[#003576] transition-all focus:outline-none gap-2">
            <ReportsIcon />
            Reports
          </Link>
        </div>

        {/* Right side: search + user */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-white font-semibold text-sm leading-tight">Peter</span>
              <span className="text-neutral-400 text-xs">@Plasser-User</span>
            </div>
            <div className="relative">
              <span className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-600 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-xs text-white rounded-full border-2 border-black flex items-center justify-center font-bold" style={{fontSize:'0.75rem',lineHeight:'1.25rem'}}>2</span>
            </div>
          </div>
        </div>
      </nav>
      {/* Menú móvil */}
      <div className={`md:hidden transition-all duration-300 ${menuOpen ? 'max-h-40 mt-2' : 'max-h-0 overflow-hidden'} w-full`}> 
        <div className="flex flex-col gap-2 bg-black rounded-xl px-2 pb-2">
          <Link to="/" className="flex items-center px-5 py-2 rounded-full bg-neutral-900 text-white font-medium text-base shadow-sm hover:bg-neutral-800 transition-all focus:outline-none gap-2">
            <DataIcon />
            Data
          </Link>
          <Link to="/report" className="flex items-center px-5 py-2 rounded-full bg-neutral-900 text-white font-medium text-base shadow-sm hover:bg-neutral-800 transition-all focus:outline-none gap-2">
            <ReportsIcon />
            Reports
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
