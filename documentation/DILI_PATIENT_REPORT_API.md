# DILI Diagnostic & Patient Report API Endpoints

This document describes the new API endpoints for creating DILI Diagnostic Panels and Patient Reports on the MedForce AI board.

## Table of Contents
- [DILI Diagnostic Panel](#dili-diagnostic-panel)
- [Patient Report](#patient-report)
- [Zone Configuration](#zone-configuration)
- [Example Usage](#example-usage)

---

## DILI Diagnostic Panel

### Endpoint
```
POST /api/dili-diagnostic
```

### Description
Creates a new DILI (Drug-Induced Liver Injury) Diagnostic Panel on the board with comprehensive pattern recognition, causality analysis, severity assessment, and management recommendations.

### Request Body

```json
{
  "pattern": {
    "classification": "Hepatocellular",
    "R_ratio": 12.5,
    "keyLabs": [
      {
        "label": "ALT",
        "value": "850 U/L",
        "note": "↑↑"
      },
      {
        "label": "AST",
        "value": "720 U/L",
        "note": "↑↑"
      },
      {
        "label": "ALP",
        "value": "180 U/L",
        "note": "↑"
      },
      {
        "label": "Total Bilirubin",
        "value": "3.2 mg/dL",
        "note": "↑"
      }
    ],
    "clinicalFeatures": [
      "Acute onset of jaundice",
      "Fatigue and malaise",
      "Right upper quadrant discomfort",
      "No fever or rash"
    ]
  },
  "causality": {
    "primaryDrug": "Amoxicillin-Clavulanate",
    "contributingFactors": [
      "Age > 60 years",
      "Female gender",
      "Duration of therapy: 14 days",
      "No alternative causes identified"
    ],
    "mechanisticRationale": [
      "Idiosyncratic hepatotoxicity",
      "Immune-mediated mechanism suspected",
      "Temporal relationship: onset 5 days after completion",
      "RUCAM score: 8 (Probable)"
    ]
  },
  "severity": {
    "features": [
      "Hy's Law criteria met (ALT >3x ULN + Bilirubin >2x ULN)",
      "INR: 1.4 (mildly elevated)",
      "No encephalopathy",
      "No ascites"
    ],
    "prognosis": "Moderate severity. Close monitoring required. Expected resolution with drug discontinuation, but risk of progression exists."
  },
  "management": {
    "immediateActions": [
      "Discontinue amoxicillin-clavulanate immediately",
      "Avoid all hepatotoxic medications",
      "Monitor LFTs every 2-3 days initially",
      "Check INR, albumin, and complete metabolic panel"
    ],
    "consults": [
      "Hepatology consultation for severity assessment",
      "Consider infectious disease if alternative infection suspected"
    ],
    "monitoringPlan": [
      "Weekly LFTs until normalization",
      "Monitor for signs of acute liver failure",
      "Patient education on warning signs",
      "Document in allergy list"
    ]
  },
  "zone": "task-management-zone",
  "x": 5860,
  "y": -2240,
  "width": 900,
  "height": 800
}
```

### Required Fields
- `pattern` (object): Pattern recognition data
  - `classification` (string): Type of liver injury
  - `R_ratio` (number): R-ratio calculation
  - `keyLabs` (array): Laboratory values
  - `clinicalFeatures` (array): Clinical observations
- `causality` (object): Causality analysis
  - `primaryDrug` (string): Suspected causative drug
  - `contributingFactors` (array): Risk factors
  - `mechanisticRationale` (array): Mechanism explanation
- `severity` (object): Severity assessment
  - `features` (array): Clinical severity indicators
  - `prognosis` (string): Expected outcome
- `management` (object): Management plan
  - `immediateActions` (array): Urgent interventions
  - `consults` (array): Required consultations
  - `monitoringPlan` (array): Follow-up plan

### Optional Fields
- `zone` (string): Target zone for placement (default: "task-management-zone")
- `x` (number): Manual X coordinate
- `y` (number): Manual Y coordinate
- `width` (number): Panel width (default: 1600 - optimized for two-column layout)
- `height` (number): Panel height (default: 700)

### Response
```json
{
  "id": "item-1699564321234-abc123",
  "type": "dili-diagnostic",
  "x": 5860,
  "y": -2240,
  "width": 900,
  "height": 800,
  "content": "DILI Diagnostic Panel",
  "color": "#ffffff",
  "rotation": 0,
  "diliData": {
    "pattern": { ... },
    "causality": { ... },
    "severity": { ... },
    "management": { ... }
  },
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

---

## Patient Report

### Endpoint
```
POST /api/patient-report
```

### Description
Creates a comprehensive patient summary report with demographics, clinical information, medications, and management recommendations.

### Request Body

```json
{
  "patientData": {
    "name": "Jane Smith",
    "date_of_birth": "1965-03-15",
    "age": 58,
    "sex": "Female",
    "mrn": "MRN-789456",
    "primaryDiagnosis": "Drug-Induced Liver Injury (DILI) secondary to Amoxicillin-Clavulanate",
    "problem_list": [
      {
        "name": "Hypertension",
        "status": "Active"
      },
      {
        "name": "Type 2 Diabetes Mellitus",
        "status": "Active"
      },
      {
        "name": "Hyperlipidemia",
        "status": "Active"
      }
    ],
    "allergies": [
      "Penicillin - Rash",
      "Sulfa drugs - Stevens-Johnson Syndrome"
    ],
    "medication_history": [
      {
        "name": "Lisinopril",
        "dose": "10mg daily"
      },
      {
        "name": "Metformin",
        "dose": "1000mg twice daily"
      },
      {
        "name": "Atorvastatin",
        "dose": "20mg daily"
      },
      {
        "name": "Amoxicillin-Clavulanate",
        "dose": "875-125mg twice daily (DISCONTINUED)"
      }
    ],
    "acute_event_summary": "Patient presented with jaundice, fatigue, and elevated liver enzymes 5 days after completing a 14-day course of amoxicillin-clavulanate for sinusitis. Laboratory findings consistent with hepatocellular injury pattern. No alternative causes identified on workup.",
    "diagnosis_acute_event": [
      "Drug-Induced Liver Injury (DILI) - Probable",
      "Hepatocellular injury pattern",
      "RUCAM score: 8 (Probable causality)"
    ],
    "causality": "Amoxicillin-clavulanate is the most likely causative agent based on temporal relationship, absence of alternative causes, and characteristic injury pattern. Patient has risk factors including age >60 and female gender.",
    "management_recommendations": [
      "Immediate discontinuation of amoxicillin-clavulanate",
      "Hepatology consultation for severity assessment",
      "Serial monitoring of liver function tests",
      "Avoid hepatotoxic medications",
      "Patient education on warning signs of liver failure",
      "Document drug allergy in medical record"
    ]
  },
  "zone": "doctors-note-zone",
  "x": 5860,
  "y": 60,
  "width": 900,
  "height": 800
}
```

### Required Fields
- `patientData` (object): Patient information
  - `name` (string): Patient full name
  - `mrn` (string): Medical record number

### Optional Fields (within patientData)
- `date_of_birth` (string): Date of birth
- `age` (number): Patient age
- `sex` (string): Patient sex
- `primaryDiagnosis` (string): Primary diagnosis
- `problem_list` (array): Active/inactive problems
- `allergies` (array): Known allergies
- `medication_history` (array): Current/past medications
- `acute_event_summary` (string): Event description
- `diagnosis_acute_event` (array): Acute diagnoses
- `causality` (string): Causality assessment
- `management_recommendations` (array): Treatment plan

### Optional Positioning Fields
- `zone` (string): Target zone for placement (default: "task-management-zone")
- `x` (number): Manual X coordinate
- `y` (number): Manual Y coordinate
- `width` (number): Report width (default: 1600 - optimized for two-column layout)
- `height` (number): Report height (default: 700)

### Response
```json
{
  "id": "item-1699564321234-def456",
  "type": "patient-report",
  "x": 5860,
  "y": 60,
  "width": 900,
  "height": 800,
  "content": "Patient Report",
  "color": "#ffffff",
  "rotation": 0,
  "patientData": {
    "name": "Jane Smith",
    "mrn": "MRN-789456",
    ...
  },
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

---

## Zone Configuration

Both endpoints support automatic positioning within predefined zones:

| Zone Name | X | Y | Width | Height | Purpose |
|-----------|---|---|-------|--------|---------|
| `task-management-zone` | 5800 | -2300 | 2000 | 2100 | Task lists and action items |
| `retrieved-data-zone` | 5800 | -4600 | 2000 | 2100 | Retrieved EHR data |
| `doctors-note-zone` | 5800 | 0 | 2000 | 2100 | Clinical notes and reports |
| `adv-event-zone` | 0 | 0 | 4000 | 2300 | Adverse event analysis |
| `data-zone` | 0 | -1300 | 4000 | 1000 | General data display |
| `raw-ehr-data-zone` | 1500 | -3800 | 2500 | 2400 | Raw EHR records |
| `dili-analysis-zone` | 0 | 6000 | 4000 | 5500 | DILI diagnostic and patient reports |
| `web-interface-zone` | -2200 | 0 | 2000 | 1500 | Web interfaces |

### Positioning Behavior
1. **Manual Positioning**: If `x` and `y` are provided, item is placed at exact coordinates
2. **Zone-Based**: If `zone` is provided without coordinates, item is auto-positioned within that zone
3. **Default**: If neither is provided, item is placed in `task-management-zone`

---

## Example Usage

### JavaScript/TypeScript

```typescript
// Create DILI Diagnostic Panel
const createDILIDiagnostic = async () => {
  const response = await fetch('http://localhost:3001/api/dili-diagnostic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pattern: {
        classification: "Hepatocellular",
        R_ratio: 12.5,
        keyLabs: [
          { label: "ALT", value: "850 U/L", note: "↑↑" },
          { label: "AST", value: "720 U/L", note: "↑↑" }
        ],
        clinicalFeatures: ["Acute jaundice", "Fatigue"]
      },
      causality: {
        primaryDrug: "Amoxicillin-Clavulanate",
        contributingFactors: ["Age > 60", "Female gender"],
        mechanisticRationale: ["Idiosyncratic hepatotoxicity"]
      },
      severity: {
        features: ["Hy's Law criteria met"],
        prognosis: "Moderate severity"
      },
      management: {
        immediateActions: ["Discontinue drug"],
        consults: ["Hepatology"],
        monitoringPlan: ["Weekly LFTs"]
      },
      zone: "task-management-zone"
    })
  });
  
  const data = await response.json();
  console.log('Created DILI Diagnostic:', data);
};

// Create Patient Report
const createPatientReport = async () => {
  const response = await fetch('http://localhost:3001/api/patient-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientData: {
        name: "Jane Smith",
        mrn: "MRN-789456",
        age: 58,
        sex: "Female",
        primaryDiagnosis: "Drug-Induced Liver Injury",
        allergies: ["Penicillin - Rash"],
        medication_history: [
          { name: "Lisinopril", dose: "10mg daily" }
        ],
        management_recommendations: [
          "Discontinue causative agent",
          "Monitor liver function"
        ]
      },
      zone: "doctors-note-zone"
    })
  });
  
  const data = await response.json();
  console.log('Created Patient Report:', data);
};
```

### cURL

```bash
# Create DILI Diagnostic Panel
curl -X POST http://localhost:3001/api/dili-diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": {
      "classification": "Hepatocellular",
      "R_ratio": 12.5,
      "keyLabs": [
        {"label": "ALT", "value": "850 U/L", "note": "↑↑"}
      ],
      "clinicalFeatures": ["Acute jaundice"]
    },
    "causality": {
      "primaryDrug": "Amoxicillin-Clavulanate",
      "contributingFactors": ["Age > 60"],
      "mechanisticRationale": ["Idiosyncratic"]
    },
    "severity": {
      "features": ["Hy'\''s Law met"],
      "prognosis": "Moderate"
    },
    "management": {
      "immediateActions": ["Discontinue drug"],
      "consults": ["Hepatology"],
      "monitoringPlan": ["Weekly LFTs"]
    },
    "zone": "task-management-zone"
  }'

# Create Patient Report
curl -X POST http://localhost:3001/api/patient-report \
  -H "Content-Type: application/json" \
  -d '{
    "patientData": {
      "name": "Jane Smith",
      "mrn": "MRN-789456",
      "age": 58,
      "sex": "Female",
      "primaryDiagnosis": "DILI",
      "management_recommendations": ["Monitor LFTs"]
    },
    "zone": "doctors-note-zone"
  }'
```

### Python

```python
import requests

# Create DILI Diagnostic Panel
dili_data = {
    "pattern": {
        "classification": "Hepatocellular",
        "R_ratio": 12.5,
        "keyLabs": [
            {"label": "ALT", "value": "850 U/L", "note": "↑↑"}
        ],
        "clinicalFeatures": ["Acute jaundice"]
    },
    "causality": {
        "primaryDrug": "Amoxicillin-Clavulanate",
        "contributingFactors": ["Age > 60"],
        "mechanisticRationale": ["Idiosyncratic"]
    },
    "severity": {
        "features": ["Hy's Law met"],
        "prognosis": "Moderate"
    },
    "management": {
        "immediateActions": ["Discontinue drug"],
        "consults": ["Hepatology"],
        "monitoringPlan": ["Weekly LFTs"]
    },
    "zone": "task-management-zone"
}

response = requests.post(
    'http://localhost:3001/api/dili-diagnostic',
    json=dili_data
)
print(response.json())

# Create Patient Report
patient_data = {
    "patientData": {
        "name": "Jane Smith",
        "mrn": "MRN-789456",
        "age": 58,
        "sex": "Female",
        "primaryDiagnosis": "DILI",
        "management_recommendations": ["Monitor LFTs"]
    },
    "zone": "doctors-note-zone"
}

response = requests.post(
    'http://localhost:3001/api/patient-report',
    json=patient_data
)
print(response.json())
```

---

## Features

### DILI Diagnostic Panel Features
- ✅ Two-column layout for better space utilization
- ✅ Expandable/collapsible sections
- ✅ Pattern recognition with lab values and indicators
- ✅ Causality analysis with RUCAM scoring
- ✅ Severity assessment with Hy's Law criteria
- ✅ Management plan with checklists (right column)
- ✅ PDF export functionality
- ✅ Print-optimized layout
- ✅ Responsive design (collapses to single column on smaller screens)

### Patient Report Features
- ✅ Two-column layout from "Acute Event Summary" onwards
- ✅ View and edit modes
- ✅ Comprehensive patient demographics
- ✅ Problem list management
- ✅ Medication history tracking
- ✅ Acute event documentation (left column)
- ✅ Diagnosis and causality assessment (left column)
- ✅ Management recommendations (right column)
- ✅ PDF export and print functionality
- ✅ Editable fields with auto-save
- ✅ Responsive design (collapses to single column on smaller screens)

---

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "error": "pattern, causality, severity, and management objects are required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to create DILI Diagnostic"
}
```

### Validation
- All required fields must be present
- Arrays must contain valid objects
- Numeric values must be valid numbers
- Zone names must match predefined zones

---

## Integration with SSE

Both endpoints broadcast real-time updates via Server-Sent Events (SSE):

```javascript
// Listen for new items
const eventSource = new EventSource('http://localhost:3001/api/events');

eventSource.addEventListener('new-item', (event) => {
  const data = JSON.parse(event.data);
  console.log('New item created:', data.item);
  
  if (data.item.type === 'dili-diagnostic') {
    console.log('DILI Diagnostic Panel added to board');
  }
  
  if (data.item.type === 'patient-report') {
    console.log('Patient Report added to board');
  }
});
```

---

## Notes

1. **Auto-positioning**: Items are automatically positioned within zones to avoid overlaps
2. **Responsive Design**: Both components adapt to different screen sizes
3. **Print Support**: Both components have optimized print layouts
4. **PDF Export**: Built-in PDF generation using jsPDF and html2canvas
5. **Real-time Updates**: Changes broadcast to all connected clients via SSE
6. **Persistent Storage**: Items saved to Redis for cross-instance persistence

---

## Support

For issues or questions, refer to:
- Main API documentation: `API-COMMANDS.md`
- Print functionality: `PRINT_DEBUG_GUIDE.md`
- Component guides: `documentation/` folder
