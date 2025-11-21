
export interface Encounter {
  encounter_no: number;
  date: string;
  type: string;
  provider: string;
  diagnosis?: string;
  medications: string[];
  notes?: string;
  impression?: string;
  differential_diagnosis?: string[];
  chief_complaint?: string;
}

export interface Medication {
  name: string;
  startDate: string;
  endDate?: string;
  dose: string;
  indication: string;
}

export interface LabValue {
  t: string;
  value: number;
}

export interface LabMetric {
  biomarker: string;
  unit: string;
  values: LabValue[];
  referenceRange?: {
    min: number;
    max: number;
  };
}

export interface KeyEvent {
  event: string;
  t: string;
  note: string;
}

export interface RiskPoint {
  t: string;
  riskScore: number;
  factors: string[];
}

export interface CausalNode {
  title: string;
  description: string;
  stage?: string;
}

export interface Problem {
    name: string;
    status: string;
}

export interface PatientData {
    patient: {
        name: string;
        date_of_birth: string;
        age: number;
        sex: string;
        age_at_first_encounter: number;
        identifiers: {
            mrn: string;
        };
    };
    riskLevel: string;
    primaryDiagnosis: string;
    problem_list: Problem[];
}

export interface MedicalData {
  title: string;
  component: string;
  props: {
    encounters: Encounter[];
    medicationTimeline: Medication[];
    labTimeline: LabMetric[];
    keyEvents: KeyEvent[];
    riskTimeline?: RiskPoint[];
    causalChain?: CausalNode[];
  };
  patientData?: PatientData;
}
