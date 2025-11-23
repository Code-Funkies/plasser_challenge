import React from 'react';
import type { NavLinkProps } from '../types/navbar.types';

/**
 * NavLink component - Renders individual navigation links
 * Provides a reusable, accessible link component for navigation
 *
 * @component
 * @param href - URL destination
 * @param label - Display text
 * @param icon - Optional SVG icon
 * @param isActive - Whether this link is the current page
 * @param isMobile - Whether rendering on mobile view
 *
 * @example
 * const icon = <HomeIcon />;
 * <NavLink
 *   href="/"
 *   label="Home"
 *   icon={icon}
 *   isActive={true}
 *   isMobile={false}
 * />
 */
const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon,
  isActive = false,
  isMobile = false,
}) => {
  const baseClasses = 'p-2 flex items-center text-sm focus:outline-hidden';
  const colorClasses = isActive
    ? 'text-white'
    : 'text-white/80 hover:text-white';
  const iconClasses = icon ? 'shrink-0 size-4 me-3 md:me-2' : '';
  const iconVisibility = isMobile ? 'block md:hidden' : 'hidden';

  return (
    <a
      href={href}
      className={`${baseClasses} ${colorClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && <div className={`${iconClasses} ${iconVisibility}`}>{icon}</div>}
      {label}
    </a>
  );
};

export default NavLink;
