import React from 'react';
import { KPICard } from './KPICard';
import type { RiskSegment } from '../types/segment.types';

interface OperativeProps {
  segment: RiskSegment;
}

/**
 * Operative - Panel de detalle de un tramo seleccionado
 * Muestra tarjetas de KPIs con las métricas principales del tramo
 */
const Operative: React.FC<OperativeProps> = ({ segment }) => {
  const getRiskColorClass = (score: number): string => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <section className="h-full w-full overflow-auto">
      <div className="w-full h-full flex flex-col gap-4 p-4">
        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <KPICard
            label="Risk Score"
            value={segment.prediction.toFixed(1)}
            colorClass={getRiskColorClass(segment.prediction)}
          />
          <KPICard
            label="β-Ballast promedio"
            value={segment.avg_beta.toFixed(2)}
            colorClass="text-indigo-600"
          />
          <KPICard
            label="Desv. geométrica máx. (mm)"
            value={segment.max_geom_dev.toFixed(2)}
            colorClass="text-purple-600"
          />
          <KPICard
            label="GPR Risk Max"
            value={segment.gpr_risk_max}
            colorClass="text-orange-600"
          />
          <KPICard
            label="Densidad de defectos"
            value={segment.defect_density.toFixed(3)}
            colorClass="text-pink-600"
          />
          <KPICard
            label="Clase de tráfico"
            value={segment.traffic_class.charAt(0).toUpperCase() + segment.traffic_class.slice(1)}
            colorClass="text-teal-600"
          />
          <KPICard
            label="Zona climática"
            value={segment.climate_zone}
            colorClass="text-cyan-600"
          />
        </div>
      </div>
    </section>
  );
};

export default Operative;
