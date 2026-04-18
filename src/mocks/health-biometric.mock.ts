export interface ClinicalMetrics {
  temperature: number;
  heart_rate: number;
  respiratory_rate: number;
  rumination_min_day: number;
  hydration_count: number;
}

export interface BehavioralAnalysis {
  activity_level: number;
  lying_ratio: number;
  anomaly_score: number;
}

export interface HealthBiometricMock {
  animal_id: string;
  tag_name: string;
  breed: string;
  age_months: number;
  clinical_metrics: ClinicalMetrics;
  behavioral_analysis: BehavioralAnalysis;
  his_score: number;
  status: "critical" | "warning" | "stable";
}

export interface DeviceBattery {
  level: number;
  status: "critical" | "low" | "normal";
  solar_charging: boolean;
}

export interface DeviceConnectivity {
  protocol: "LoRaWAN" | "LTE" | "NB-IoT";
  rssi: number;
  last_sync_mode: "Store & Forward" | "Real-time";
  gateway_id: string;
}

export interface DeviceTelemetryMock {
  device_id: string;
  hardware_version: string;
  battery: DeviceBattery;
  connectivity: DeviceConnectivity;
  alerts_count: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TerrainRiskPoint {
  coordinate: GeoPoint;
  elevation_m: number;
  slope_degree: number;
  risk_type: "steep_slope" | "flood_zone" | "unstable_ground";
  action: "audio_stimulus" | "reroute" | "human_review";
}

export interface FenceRiskMock {
  fence_id: string;
  status: "active" | "inactive";
  geofence_polygon: GeoPoint[];
  terrain_risk_map: TerrainRiskPoint[];
}

function assertNonNull<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing required field: ${fieldName}`);
  }
  return value;
}

export function createHealthBiometricData(
  payload: Partial<HealthBiometricMock>,
): HealthBiometricMock {
  return {
    animal_id: assertNonNull(payload.animal_id, "animal_id"),
    tag_name: assertNonNull(payload.tag_name, "tag_name"),
    breed: assertNonNull(payload.breed, "breed"),
    age_months: assertNonNull(payload.age_months, "age_months"),
    clinical_metrics: {
      temperature: assertNonNull(payload.clinical_metrics?.temperature, "clinical_metrics.temperature"),
      heart_rate: assertNonNull(payload.clinical_metrics?.heart_rate, "clinical_metrics.heart_rate"),
      respiratory_rate: assertNonNull(payload.clinical_metrics?.respiratory_rate, "clinical_metrics.respiratory_rate"),
      rumination_min_day: assertNonNull(payload.clinical_metrics?.rumination_min_day, "clinical_metrics.rumination_min_day"),
      hydration_count: assertNonNull(payload.clinical_metrics?.hydration_count, "clinical_metrics.hydration_count"),
    },
    behavioral_analysis: {
      activity_level: assertNonNull(payload.behavioral_analysis?.activity_level, "behavioral_analysis.activity_level"),
      lying_ratio: assertNonNull(payload.behavioral_analysis?.lying_ratio, "behavioral_analysis.lying_ratio"),
      anomaly_score: assertNonNull(payload.behavioral_analysis?.anomaly_score, "behavioral_analysis.anomaly_score"),
    },
    his_score: assertNonNull(payload.his_score, "his_score"),
    status: assertNonNull(payload.status, "status"),
  };
}

export function createDeviceTelemetryData(
  payload: Partial<DeviceTelemetryMock>,
): DeviceTelemetryMock {
  return {
    device_id: assertNonNull(payload.device_id, "device_id"),
    hardware_version: assertNonNull(payload.hardware_version, "hardware_version"),
    battery: {
      level: assertNonNull(payload.battery?.level, "battery.level"),
      status: assertNonNull(payload.battery?.status, "battery.status"),
      solar_charging: assertNonNull(payload.battery?.solar_charging, "battery.solar_charging"),
    },
    connectivity: {
      protocol: assertNonNull(payload.connectivity?.protocol, "connectivity.protocol"),
      rssi: assertNonNull(payload.connectivity?.rssi, "connectivity.rssi"),
      last_sync_mode: assertNonNull(payload.connectivity?.last_sync_mode, "connectivity.last_sync_mode"),
      gateway_id: assertNonNull(payload.connectivity?.gateway_id, "connectivity.gateway_id"),
    },
    alerts_count: assertNonNull(payload.alerts_count, "alerts_count"),
  };
}

export function createFenceRiskData(
  payload: Partial<FenceRiskMock>,
): FenceRiskMock {
  return {
    fence_id: assertNonNull(payload.fence_id, "fence_id"),
    status: assertNonNull(payload.status, "status"),
    geofence_polygon: assertNonNull(payload.geofence_polygon, "geofence_polygon").map(
      (point, index) => ({
        lat: assertNonNull(point?.lat, `geofence_polygon[${index}].lat`),
        lng: assertNonNull(point?.lng, `geofence_polygon[${index}].lng`),
      }),
    ),
    terrain_risk_map: assertNonNull(payload.terrain_risk_map, "terrain_risk_map").map(
      (risk, index) => ({
        coordinate: {
          lat: assertNonNull(risk?.coordinate?.lat, `terrain_risk_map[${index}].coordinate.lat`),
          lng: assertNonNull(risk?.coordinate?.lng, `terrain_risk_map[${index}].coordinate.lng`),
        },
        elevation_m: assertNonNull(risk?.elevation_m, `terrain_risk_map[${index}].elevation_m`),
        slope_degree: assertNonNull(risk?.slope_degree, `terrain_risk_map[${index}].slope_degree`),
        risk_type: assertNonNull(risk?.risk_type, `terrain_risk_map[${index}].risk_type`),
        action: assertNonNull(risk?.action, `terrain_risk_map[${index}].action`),
      }),
    ),
  };
}
