import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import GraphCard from './GraphCard';

/**
 * Tipo de datos para un tramo de riesgo seleccionado
 */
export interface RiskSegment {
  track_id: string;
  km_ini: number;
  km_fin: number;
  avg_beta: number;
  max_geom_dev: number;
  gpr_risk_max: number;
  defect_density: number;
  traffic_class: 'alta' | 'media' | 'baja';
  climate_zone: 'Cálido' | 'Seco' | 'Templado' | 'Frío';
  prediction: number; // risk_score 0-100
}

interface OperativeProps {
  segment?: RiskSegment;
}

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: string;
  colorClass?: string;
}

/**
 * Tarjeta individual de KPI
 */
const KPICard: React.FC<KPICardProps> = ({ label, value, icon, colorClass = 'text-blue-600' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {value}
      </div>
    </div>
  );
};

/**
 * Operative - Panel de detalle de un tramo seleccionado
 * Muestra KPIs y gráficas usando ApexCharts para el análisis de un solo tramo
 */
const Operative: React.FC<OperativeProps> = ({ segment }) => {
  // Datos de ejemplo si no se proporciona un tramo
  const defaultSegment: RiskSegment = {
    track_id: "Linea_MX_01",
    km_ini: 126.40283569641367,
    km_fin: 126.49958298582152,
    avg_beta: 44.191734281695815,
    max_geom_dev: 9.069792131801792,
    gpr_risk_max: 3,
    defect_density: 0.6855886346229533,
    traffic_class: "alta",
    climate_zone: "Frío",
    prediction: 67.17434257324136
  };

  const data = segment || defaultSegment;

  // Determinar color del risk score
  const getRiskColor = (score: number): string => {
    if (score < 40) return '#10b981'; // verde
    if (score < 70) return '#f59e0b'; // amarillo
    return '#ef4444'; // rojo
  };

  const getRiskColorClass = (score: number): string => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Normalización de valores para el gráfico de componentes
  const beta_norm = Math.min(data.avg_beta / 80, 1);
  const geom_norm = Math.min(data.max_geom_dev / 15, 1);
  const gpr_norm = data.gpr_risk_max / 3;
  const defects_norm = data.defect_density;

  // Configuración del gauge (radialBar) para el risk score
  const gaugeOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      fontFamily: 'inherit',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            color: '#6b7280',
            offsetY: 60,
          },
          value: {
            offsetY: 10,
            fontSize: '32px',
            color: '#111827',
            formatter: (val: number) => `${val.toFixed(1)}`,
          },
        },
        track: {
          background: '#e5e7eb',
          strokeWidth: '100%',
        },
      },
    },
    fill: {
      colors: [getRiskColor(data.prediction)],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Índice de riesgo'],
  };

  const gaugeSeries = [data.prediction];

  // Configuración del gráfico de barras horizontales (componentes del riesgo)
  const contributionOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(2),
      offsetX: 30,
      style: {
        fontSize: '11px',
        colors: ['#374151'],
      },
    },
    xaxis: {
      categories: ['β-Ballast', 'Geom. (mm)', 'GPR riesgo', 'Defectos'],
      max: 1,
      labels: {
        formatter: (val: string) => parseFloat(val).toFixed(1),
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    colors: ['#3b82f6'],
    grid: {
      borderColor: '#e5e7eb',
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(1),
      },
    },
  };

  const contributionSeries = [
    {
      name: 'Contribución normalizada',
      data: [beta_norm, geom_norm, gpr_norm, defects_norm],
    },
  ];

  // Configuración del gráfico de perfil del tramo
  const profileOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1),
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: [`${data.km_ini.toFixed(3)} - ${data.km_fin.toFixed(3)} km`],
      labels: {
        style: {
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Risk Score',
        style: {
          fontSize: '12px',
        },
      },
      max: 100,
      labels: {
        formatter: (val: number) => val.toFixed(1),
      },
    },
    colors: [getRiskColor(data.prediction)],
    grid: {
      borderColor: '#e5e7eb',
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)}`,
      },
    },
  };

  const profileSeries = [
    {
      name: 'Risk Score',
      data: [data.prediction],
    },
  ];

  return (
    <section className="h-full w-full overflow-auto">
      <div className="w-full h-full flex flex-col gap-4 p-4">
        {/* Encabezado con información del tramo */}
        <div className="bg-transparent rounded-lg p-4 text-black flex flex-col">
          <h2 className="text-4xl font-bold mb-1 w-max">TRAMO</h2>
          <p className="text-sm opacity-90 w-max">
            {data.track_id} • {data.km_ini.toFixed(3)} km - {data.km_fin.toFixed(3)} km
          </p>
        </div>

        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <KPICard
            label="Risk Score"
            value={data.prediction.toFixed(1)}
            colorClass={getRiskColorClass(data.prediction)}
          />
          <KPICard
            label="β-Ballast promedio"
            value={data.avg_beta.toFixed(2)}
            colorClass="text-indigo-600"
          />
          <KPICard
            label="Desv. geométrica máx. (mm)"
            value={data.max_geom_dev.toFixed(2)}
            colorClass="text-purple-600"
          />
          <KPICard
            label="GPR Risk Max"
            value={data.gpr_risk_max}
            colorClass="text-orange-600"
          />
          <KPICard
            label="Densidad de defectos"
            value={data.defect_density.toFixed(3)}
            colorClass="text-pink-600"
          />
          <KPICard
            label="Clase de tráfico"
            value={data.traffic_class.charAt(0).toUpperCase() + data.traffic_class.slice(1)}
            colorClass="text-teal-600"
          />
          <KPICard
            label="Zona climática"
            value={data.climate_zone}
            colorClass="text-cyan-600"
          />
        </div>

        {/* Gráficas principales */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfica 1: Gauge del risk score */}
          <GraphCard title="Índice de riesgo del tramo">
            <div className="w-full h-full flex items-center justify-center">
              <ReactApexChart
                options={gaugeOptions}
                series={gaugeSeries}
                type="radialBar"
                height="100%"
                width="100%"
              />
            </div>
          </GraphCard>

          {/* Gráfica 2: Componentes del riesgo */}
          <GraphCard title="Componentes del riesgo (normalizados)">
            <div className="w-full h-full flex items-center justify-center">
              <ReactApexChart
                options={contributionOptions}
                series={contributionSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          </GraphCard>
        </div>

        {/* Gráfica 3: Perfil del tramo */}
        <div className="grid gap-4 md:grid-cols-1">
          <GraphCard title="Resumen del tramo (km)">
            <div className="w-full h-full flex items-center justify-center">
              <ReactApexChart
                options={profileOptions}
                series={profileSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          </GraphCard>
        </div>
      </div>
    </section>
  );
};

export default Operative;
