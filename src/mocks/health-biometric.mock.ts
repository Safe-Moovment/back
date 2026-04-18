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

export const healthBiometricMock: HealthBiometricMock = {
  animal_id: "COW-042",
  tag_name: "Bessie",
  breed: "Holstein",
  age_months: 24,
  clinical_metrics: {
    temperature: 39.6,
    heart_rate: 88,
    respiratory_rate: 32,
    rumination_min_day: 380,
    hydration_count: 6,
  },
  behavioral_analysis: {
    activity_level: 0.08,
    lying_ratio: 0.9,
    anomaly_score: 0.84,
  },
  his_score: 28,
  status: "critical",
};

export const deviceTelemetryMock: DeviceTelemetryMock = {
  device_id: "LORA-7782",
  hardware_version: "V3-Solar",
  battery: {
    level: 15,
    status: "critical",
    solar_charging: false,
  },
  connectivity: {
    protocol: "LoRaWAN",
    rssi: -115,
    last_sync_mode: "Store & Forward",
    gateway_id: "BASE-STATION-01",
  },
  alerts_count: 3,
};
