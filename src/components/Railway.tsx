import React from "react";

const NODES = 10;

const Railway: React.FC = () => {
  const startX = 150;
  const startY = 40;
  const endX = 150;
  const endY = 360;

  // Función para obtener el color basado en el valor (0 = azul, 1 = rojo)
  const getColorByValue = (value: number) => {
    if (value < 0.1) return "#3b82f6"; // Azul
    if (value < 0.25) return "#19ef24ff"; // Verde
    if (value < 0.5) return "#fbbf24"; // Amarillo
    if (value < 0.75) return "#f97316"; // Naranja
    return "#ef4444"; // Rojo
  };

  // Calcular las posiciones de los nodos (línea vertical)
  const nodes = Array.from({ length: NODES }, (_, i) => {
    const t = i / (NODES - 1);
    const value = Math.random();
    const color = getColorByValue(value);
    return {
      x: startX + t * (endX - startX),
      y: startY + t * (endY - startY),
      id: i,
      value: value.toFixed(2),
      color: color,
    };
  });

  return (
    <div className="w-100% h-[700px] border border-gray-200 rounded-lg flex items-center justify-center bg-gradient-to-b from-slate-50 to-white shadow-sm">
      <svg width="100%" height="100%" viewBox="0 0 300 400" className="px-8">
        {/* Línea ferroviaria vertical sólida */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#d1d5db"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Nodos cuadrados */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Cuadrado del nodo con color dinámico */}
            <rect
              x={node.x - 16}
              y={node.y - 16}
              width="32"
              height="32"
              fill="white"
              stroke={node.color}
              strokeWidth="2"
              rx="4"
            />
            {/* Valor dentro del cuadrado con color dinámico */}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="700"
              fill={node.color}
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Railway;
