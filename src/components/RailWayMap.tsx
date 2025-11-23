import { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Este componente no renderiza nada visual, solo arregla el bug del tamaño
const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    // 1. Forzar un redibujado inmediato al montar
    map.invalidateSize();

    // 2. Esperar un poco (300ms) por si el dashboard hace animaciones de carga
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

// --- TIPOS ---
interface MonitorNode {
  id: string;
  position: [number, number]; // [lat, lng]
  kmPoint: string;            // Kilometraje (ej: Km 120.5)
  status: 'ok' | 'warning' | 'danger';
  temperature: number;        // Temp de la vía
  vibration: number;          // Vibración en Hz
}

// --- COORDENADAS "SEMILLA" (Ruta en Austria - Cerca de Semmering) ---
// Estos son solo los puntos de giro principales. El código generará los nodos intermedios.
const mainTrackPath: [number, number][] = [
  [47.6365, 15.8200], // Punto A (Inicio)
  [47.6380, 15.8250],
  [47.6410, 15.8290],
  [47.6450, 15.8320],
  [47.6490, 15.8350], // Curva
  [47.6520, 15.8310],
  [47.6550, 15.8280], // Punto B (Fin)
];

// --- UTILERÍA PARA GENERAR NODOS MOCK ---
// Esta función simula poner un sensor cada "X" distancia entre los puntos principales
const generateNodes = (path: [number, number][]): MonitorNode[] => {
  const nodes: MonitorNode[] = [];
  let nodeCount = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    
    // Cuántos nodos intermedios queremos por segmento (Simulando cada 100m)
    const segments = 5; 

    for (let j = 0; j < segments; j++) {
      // Interpolación lineal simple para encontrar coordenadas intermedias
      const lat = start[0] + (end[0] - start[0]) * (j / segments);
      const lng = start[1] + (end[1] - start[1]) * (j / segments);
      
      // Simulamos datos aleatorios para cada nodo
      const rand = Math.random();
      let status: 'ok' | 'warning' | 'danger' = 'ok';
      if (rand > 0.85) status = 'warning';
      if (rand > 0.95) status = 'danger';

      nodes.push({
        id: `node-${nodeCount}`,
        position: [lat, lng],
        kmPoint: `${(nodeCount * 0.1).toFixed(1)} Km`, // Suma 100m ficticios
        status: status,
        temperature: Math.floor(20 + Math.random() * 15), // Entre 20 y 35 grados
        vibration: Number((Math.random() * 5).toFixed(2))
      });
      nodeCount++;
    }
  }
  return nodes;
};

// --- FUNCIÓN PARA COLOR SEGÚN ESTADO ---
const getStatusColor = (status: string) => {
  switch (status) {
    case 'danger': return '#dc2626'; // Rojo intenso
    case 'warning': return '#f59e0b'; // Ámbar
    default: return '#10b981';       // Verde esmeralda
  }
};

const RailwayMap = () => {
  // Generamos los nodos una sola vez al cargar
  const sensorNodes = useMemo(() => generateNodes(mainTrackPath), []);
  const centerPosition: LatLngExpression = [47.6450, 15.8300]; // Centro de la vista

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-xl border border-gray-300 relative">
      <MapContainer 
        center={centerPosition} 
        zoom={14} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >

        <MapResizer/>
        {/* Usamos un mapa estilo "Terreno" para que se vean los Alpes */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. LA VÍA DEL TREN (Línea visual) */}
        <Polyline
          positions={mainTrackPath}
          pathOptions={{ 
            color: '#374151', // Gris oscuro (color riel)
            weight: 4, 
            dashArray: '10, 10', // Efecto punteado tipo vía férrea
            opacity: 0.6
          }}
        />

        {/* 2. LOS NODOS (Sensores cada 100m) */}
        {sensorNodes.map((node) => (
          <CircleMarker
            key={node.id}
            center={node.position}
            pathOptions={{
              color: 'white',        // Borde blanco para resaltar
              weight: 1,
              fillColor: getStatusColor(node.status),
              fillOpacity: 0.8,
            }}
            radius={7} // Tamaño del punto
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            {/* Tooltip rápido al pasar el mouse (Nombre del nodo) */}
            <Tooltip direction="bottom" offset={[0, -2]} opacity={0.9}>
              <span className="font-bold">{node.kmPoint}</span>
            </Tooltip>

            {/* Popup con detalle completo del sector */}
            <Popup closeButton={false} className="custom-popup">
              <div className="p-1 min-w-[210px]">
                <div className="flex justify-between items-center mb-2 border-b pb-1">
                  <span className="font-bold text-gray-700">Sector {node.id}</span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded text-white font-bold"
                    style={{ backgroundColor: getStatusColor(node.status) }}
                  >
                    {node.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 items-center">
                  <div>Rail Temperature:</div>
                  <div className="font-mono font-bold text-gray-900">{node.temperature}°C</div>
                  
                  <div>Vibration Measurement:</div>
                  <div className="font-mono font-bold text-gray-900">{node.vibration} Hz</div>
                  
                  <div>Location:</div>
                  <div className="font-mono text-xs">{node.position[0].toFixed(4)}, {node.position[1].toFixed(4)}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Leyenda flotante (Opcional pero útil) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded shadow-md text-xs border border-gray-200">
        <h4 className="font-bold mb-2">Risk Level</h4>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> No Risk </div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Warning </div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600"></span> Danger </div>
      </div>
    </div>
  );
};

export default RailwayMap;