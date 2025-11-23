import React, { useState, useEffect } from "react";
import Operative from "./Operative";
import type { RiskSegment } from "../types/segment.types";
import Diagnostico from "./Diagnostico";

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

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

/**
 * A reusable dashboard component to display a map and information.
 */
const Dashboard: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 1080px)");
  const [selectedSection, setSelectedSection] = useState<
    "diagnostic" | "operative"
  >("diagnostic");

  // Datos del tramo seleccionado
  const selectedSegment: RiskSegment = {
    track_id: "Linea_MX_01",
    km_ini: 126.40283569641367,
    km_fin: 126.49958298582152,
    avg_beta: 44.191734281695815,
    max_geom_dev: 9.069792131801792,
    gpr_risk_max: 3,
    defect_density: 0.6855886346229533,
    traffic_class: "alta",
    climate_zone: "Frío",
    prediction: 67.17434257324136,
  };

  const gridContainerStyle: React.CSSProperties = {
    display: "grid",
    gap: "1.5rem",
    // On desktop, use a 2-column layout. On mobile, switch to a 1-column layout.
    gridTemplateColumns: isMobile ? "1fr" : "0.4fr 1fr",
    // Adjust height for mobile to allow content to flow.
    height: isMobile ? "auto" : "auto",
  };

  const mapStyle: React.CSSProperties = {
    // On mobile, the map will be in the first row. On desktop, it spans both rows.
    gridColumn: isMobile ? "1" : "1",
    gridRow: isMobile ? "1" : "1",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isMobile ? "40vh" : "auto", // Ensure map has a minimum height on mobile
  };

  return (
    <section
      style={{
        padding: "1.5rem",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
      }}
    >
      <div style={gridContainerStyle}>
        {/* Left Column: Map */}
        <div style={mapStyle}>
          <p style={{ color: "#6b7280" }}>Map Component Placeholder</p>
        </div>

        {/* Right Column: Diagnostico */}
        <div style={{ padding: "0", height: "100%" }}>
          <div>
            {/* Encabezado con información del tramo */}
            <div className="bg-transparent rounded-lg p-4 text-black flex flex-col mb-4">
              <h2 className="text-4xl font-bold mb-1 w-max">TRAMO</h2>
              <p className="text-sm opacity-90 w-max">
                {selectedSegment.track_id} • {selectedSegment.km_ini.toFixed(3)}{" "}
                km - {selectedSegment.km_fin.toFixed(3)} km
              </p>
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setSelectedSection("diagnostic")}
                className={`flex items-center justify-center h-12 px-6 rounded-full font-semibold text-base tracking-wide transition-all focus:outline-none cursor-pointer gap-2 ${
                  selectedSection === "diagnostic"
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-500 shadow hover:text-gray-700 hover:shadow-md"
                }`}
              >
                <span className="material-symbols-outlined">analytics</span>
                <span>Diagnostico</span>
              </button>
              <button
                onClick={() => setSelectedSection("operative")}
                className={`flex items-center justify-center h-12 px-6 rounded-full font-semibold text-base tracking-wide transition-all focus:outline-none cursor-pointer gap-2 ${
                  selectedSection === "operative"
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-500 shadow hover:text-gray-700 hover:shadow-md"
                }`}
              >
                <span className="material-symbols-outlined">monitoring</span>
                <span>Operativo</span>
              </button>
            </div>

            {selectedSection === "diagnostic" && (
              <Diagnostico segment={selectedSegment} />
            )}
            {selectedSection === "operative" && (
              <Operative segment={selectedSegment} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
