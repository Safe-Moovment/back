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
export declare function createHealthBiometricData(payload: Partial<HealthBiometricMock>): HealthBiometricMock;
export declare function createDeviceTelemetryData(payload: Partial<DeviceTelemetryMock>): DeviceTelemetryMock;
export declare function createFenceRiskData(payload: Partial<FenceRiskMock>): FenceRiskMock;
