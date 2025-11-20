
import { MedicalData } from './types';

// Provide an initial empty state to prevent crashes before data is fetched
export const INITIAL_DATA: MedicalData = {
  title: "Loading...",
  component: "MedicationTimeline",
  props: {
    encounters: [],
    medicationTimeline: [],
    labTimeline: [],
    keyEvents: []
  }
};
