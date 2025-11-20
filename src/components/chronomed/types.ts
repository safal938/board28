
export interface Encounter {
  encounter_no: number;
  date: string;
  type: string;
  provider: string;
  diagnosis: string;
  medications: string[];
  notes: string;
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

export interface MedicalData {
  title: string;
  component: string;
  props: {
    encounters: Encounter[];
    medicationTimeline: Medication[];
    labTimeline: LabMetric[];
    keyEvents: KeyEvent[];
  };
}
