import React, { useState, useEffect } from "react";
import Operative from "./Operative";
import type { RiskSegment, InferenceResponse, Tamping } from "../types/segment.types";
import Diagnostico from "./Diagnostico";
import RailwayMap from "./RailWayMap";

const API_ENDPOINT = "http://localhost:8000/api/inference";

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

  // Estados para la API
  const [riskSegments, setRiskSegments] = useState<RiskSegment[]>([]);
  const [tampings, setTampings] = useState<Tamping[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number>(0);

  // Fetch data from API
  useEffect(() => {
    const fetchInferenceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data: InferenceResponse = await response.json();
        
        setRiskSegments(data.risks);
        setTampings(data.tampings);
        
        // Seleccionar el primer segmento por defecto
        if (data.risks.length > 0) {
          setSelectedSegmentIndex(0);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Uknown error when trying to load the data";
        setError(errorMessage);
        console.error("Error when fetching inference data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInferenceData();
  }, []);

  // Obtener el segmento seleccionado
  const selectedSegment = riskSegments[selectedSegmentIndex];

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

  // Renderizado con manejo de estados
  if (loading) {
    return (
      <section
        style={{
          padding: "1.5rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          padding: "1.5rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-white rounded-lg shadow-md p-6 max-w-md">
            <span className="material-symbols-outlined text-red-600 text-5xl mb-4">Error</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error when trying to load the data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!selectedSegment) {
    return (
      <section
        style={{
          padding: "1.5rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-white rounded-lg shadow-md p-6">
            <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">Inbox</span>
            <p className="text-gray-600 font-medium">There's no available data</p>
          </div>
        </div>
      </section>
    );
  }

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
          {/* <p style={{ color: "#6b7280" }}>Map Component Placeholder</p> */}
          {/* <div className="col-span-1 lg:col-span-1 bg-white p-4 rounded-xl shadow-sm h-[600px]">  */}
            <RailwayMap />
            
        {/* </div> */}
        </div>

        {/* Right Column: Diagnostico */}
        <div style={{ padding: "0", height: "100%" }}>
          <div>
            {/* Encabezado con información del tramo y botones de navegación */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="bg-transparent rounded-lg p-4 text-black flex flex-col">
                <h2 className="text-4xl font-bold mb-1 w-max">SECTOR</h2>
                <p className="text-sm opacity-90 w-max">
                  {selectedSegment.track_id} • {selectedSegment.km_ini.toFixed(3)}{" "}
                  km - {selectedSegment.km_fin.toFixed(3)} km
                </p>
              </div>

              {/* Botones de navegación */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedSection("diagnostic")}
                  className={`flex items-center justify-center h-12 px-6 rounded-full font-semibold text-base tracking-wide transition-all focus:outline-none cursor-pointer gap-2 ${
                    selectedSection === "diagnostic"
                      ? "bg-black text-white shadow-lg"
                      : "bg-white text-gray-500 shadow hover:text-gray-700 hover:shadow-md"
                  }`}
                >
                  <span className="material-symbols-outlined">Analytics</span>
                  <span>Diagnostics</span>
                </button>
                <button
                  onClick={() => setSelectedSection("operative")}
                  className={`flex items-center justify-center h-12 px-6 rounded-full font-semibold text-base tracking-wide transition-all focus:outline-none cursor-pointer gap-2 ${
                    selectedSection === "operative"
                      ? "bg-black text-white shadow-lg"
                      : "bg-white text-gray-500 shadow hover:text-gray-700 hover:shadow-md"
                  }`}
                >
                  <span className="material-symbols-outlined">Monitoring</span>
                  <span>Operative</span>
                </button>
              </div>
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
