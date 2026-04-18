"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceTelemetryMock = exports.healthBiometricMock = void 0;
exports.healthBiometricMock = {
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
exports.deviceTelemetryMock = {
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
//# sourceMappingURL=health-biometric.mock.js.map