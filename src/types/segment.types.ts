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

/**
 * Tipo de datos para una traviesa individual (tamping)
 */
export interface Tamping {
  track_id: string;
  km: number;
  sleeper_id: number;
  beta_ballast: number;
  gpr_risk: number;
  geom_dev: number;
  sleeper_type: string;
  obstacle_flag: number;
  past_defects_count: number;
  noise_zone: number;
  prediction: number;
}

/**
 * Tipo de datos para la respuesta completa de la API
 */
export interface InferenceResponse {
  tampings: Tamping[];
  risks: RiskSegment[];
}

