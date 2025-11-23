import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import GraphCard from './GraphCard';
import type { RiskSegment } from '../types/segment.types';

interface DiagnosticoProps {
  segment: RiskSegment;
}

/**
 * Diagnostico - Gráficas de análisis de riesgo del tramo
 * Muestra 3 gráficas con ApexCharts para análisis de riesgo
 */
const Diagnostico: React.FC<DiagnosticoProps> = ({ segment }) => {
  // Determinar color del risk score
  const getRiskColor = (score: number): string => {
    if (score < 40) return '#10b981'; // verde
    if (score < 70) return '#f59e0b'; // amarillo
    return '#ef4444'; // rojo
  };

  // Normalización de valores para el gráfico de componentes
  const beta_norm = Math.min(segment.avg_beta / 80, 1);
  const geom_norm = Math.min(segment.max_geom_dev / 15, 1);
  const gpr_norm = segment.gpr_risk_max / 3;
  const defects_norm = segment.defect_density;

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
            offsetY: -5,
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
      colors: [getRiskColor(segment.prediction)],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Risk Index'],
  };

  const gaugeSeries = [segment.prediction];

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
      categories: ['β-Ballast', 'Geom. (mm)', 'Risk GPR', 'Defects'],
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
      name: 'Normalized Contribution',
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
      categories: [`${segment.km_ini.toFixed(3)} - ${segment.km_fin.toFixed(3)} km`],
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
    colors: [getRiskColor(segment.prediction)],
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
      data: [segment.prediction],
    },
  ];

  return (
    <section className="h-full w-full overflow-auto">
      <div className="w-full h-full flex flex-col gap-4 p-4">
        {/* Gráficas principales */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfica 1: Gauge del risk score */}
          <GraphCard title="Sector Risk Score">
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
          <GraphCard title="Risk Componenents (normalized)">
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
          <GraphCard title="Sector Overview (km)">
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

export default Diagnostico;
