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
export declare const healthBiometricMock: HealthBiometricMock;
