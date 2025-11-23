/**
 * Navbar Component - Navigation Bar with Responsive Design
 *
 * Este componente proporciona una barra de navegación responsive que se adapta
 * a diferentes tamaños de pantalla. Incluye:
 *
 * Features:
 * ✓ Diseño responsive con menú hamburguesa en móvil
 * ✓ Integración con Preline.js para animaciones smooth
 * ✓ Componentes reutilizables (NavLink, NavbarMobileToggle)
 * ✓ Accesibilidad: ARIA labels, semantic HTML
 * ✓ TypeScript para type safety
 * ✓ Customizable: brand, items, callbacks
 *
 * Usage Example:
 * ```tsx
 * import Navbar from './components/Navbar';
 *
 * function App() {
 *   const handleLoginClick = () => {
 *     // Handle login
 *   };
 *
 *   const customItems = [
 *     { id: 'home', label: 'Home', href: '/', icon: HomeIcon() },
 *     { id: 'about', label: 'About', href: '/about', icon: AboutIcon() },
 *   ];
 *
 *   return (
 *     <Navbar
 *       brandName="My App"
 *       brandHref="/"
 *       navItems={customItems}
 *       onLoginClick={handleLoginClick}
 *     />
 *   );
 * }
 * ```
 *
 * Props:
 * - brandName?: string - Brand/logo text (default: "Brand")
 * - brandHref?: string - Brand link URL (default: "#")
 * - navItems?: NavItem[] - Array of navigation items
 * - onLoginClick?: () => void - Callback for login button click
 *
 * NavItem Interface:
 * - id: string - Unique identifier for the item
 * - label: string - Display text
 * - href: string - URL destination
 * - icon?: React.ReactNode - Optional SVG icon
 * - isActive?: boolean - Whether this link is the current page
 *
 * Styling:
 * - Tailwind CSS classes for responsive design
 * - Custom Preline.js collapse behavior
 * - Mobile-first approach
 * - Accessibility-friendly focus states
 *
 * Dependencies:
 * - React 19+
 * - Tailwind CSS 4+
 * - Preline.js 3+
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  navItems?: NavItem[];
  onLoginClick?: () => void;
}
