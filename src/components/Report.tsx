import React, { useState, useEffect } from 'react';
import PdfViewer from './PdfViewer';

/**
 * A custom hook to check if the screen width matches a media query.
 * @param {string} query - The media query string (e.g., '(max-width: 768px)').
 * @returns {boolean} - True if the query matches, false otherwise.
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * Report page component to display ticket and PDF viewer placeholders.
 */
const Report: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 1080px)');

  const gridContainerStyle: React.CSSProperties = {
    display: 'grid',
    gap: '1.5rem',
    // On desktop, use a 2-column layout. On mobile, switch to a 1-column layout.
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    // Adjust height for mobile to allow content to flow.
    height: isMobile ? 'auto' : 'auto',
  };

  const mapStyle: React.CSSProperties = {
    // On mobile, the map will be in the first row. On desktop, it spans both rows.
    gridColumn: isMobile ? '1' : '1',
    gridRow: isMobile ? '1' : '1',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? '40vh' : 'auto', // Ensure map has a minimum height on mobile
  };

  return (
    <section style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <div style={gridContainerStyle}>
        {/* Left Column: Ticket */}
        <div style={mapStyle}>
          <p style={{ color: '#6b7280' }}>Ticket Component Placeholder</p>
        </div>

        {/* Right Column: PDF */}
        <div style={{ padding: '0', height: '100%' }}>
          {/* <p style={{ color: '#6b7280' }}>PDF Viewer Component Placeholder</p> */}
          <PdfViewer pdfUrl='/document2.pdf'/>
        </div>
      </div>
    </section>
  );
};

export default Report;