# EHR Data Zone Visual Diagram

## Complete System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │  EHR Data Integration Zone (Container)  │
                    │         x: -2100, y: -5200              │
                    │         600 x 400                        │
                    └─────────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ Nervecentre EPR  │        │  ICE Laboratory  │        │ BigHand Dictation│
│   x: -1200       │        │    x: -750       │        │    x: -300       │
│   y: -5400       │        │    y: -5400      │        │    y: -5400      │
│   350 x 250      │        │    350 x 250     │        │    350 x 250     │
│                  │        │                  │        │                  │
│ 6 Encounters     │        │ 6 Lab Reports    │        │ 3 Dictations     │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                           │                           │
         │                           │                           │
    ┌────┴────┐                 ┌────┴────┐                 ┌────┴────┐
    │         │                 │         │                 │         │
    ▼         ▼                 ▼         ▼                 ▼         ▼
┌────────┐ ┌────────┐      ┌────────┐ ┌────────┐      ┌────────┐ ┌────────┐
│ Enc 1  │ │ Enc 2  │      │ Lab 1  │ │ Lab 2  │      │ Hayes  │ │ Green  │
│ 2015   │ │ 2016   │      │ 2015   │ │ 2016   │      │ 2015   │ │ 2021   │
└────────┘ └────────┘      └────────┘ └────────┘      └────────┘ └────────┘
┌────────┐ ┌────────┐      ┌────────┐ ┌────────┐      ┌────────┐
│ Enc 3  │ │ Enc 4  │      │ Lab 3  │ │ Lab 5  │      │ Chen   │
│ 2018   │ │ 2021   │      │ 2018   │ │ 2025   │      │ 2025   │
└────────┘ └────────┘      └────────┘ └────────┘      └────────┘
┌────────┐ ┌────────┐      ┌────────┐
│ Enc 5  │ │ Enc 6  │      │ Lab 6  │
│ 2025   │ │ 2025   │      │ 2025   │
└────────┘ └────────┘      └────────┘

        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Medilogik EMS   │        │ VIPER Ultrasound │        │   VueExplore     │
│   x: -1200       │        │    x: -800       │        │    x: -400       │
│   y: -5000       │        │    y: -5000      │        │    y: -5000      │
│   300 x 200      │        │    300 x 200     │        │    300 x 200     │
│                  │        │                  │        │                  │
│ 1 Procedure      │        │ 1 Imaging Study  │        │ 1 ED Encounter   │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                           │                           │
         ▼                           ▼                           ▼
    ┌────────┐                  ┌────────┐                  ┌────────┐
    │Colono- │                  │  IVC   │                  │  ED    │
    │ scopy  │                  │  U/S   │                  │ Visit  │
    │ 2023   │                  │ 2025   │                  │ 2025   │
    └────────┘                  └────────┘                  └────────┘
```

## Coordinate Map

### Hub Nodes (Top Tier - y: -5400)
```
Nervecentre EPR          ICE Laboratory         BigHand Dictation
x: -1200, y: -5400      x: -750, y: -5400      x: -300, y: -5400
     350 x 250              350 x 250              350 x 250
```

### Hub Nodes (Middle Tier - y: -5000)
```
Medilogik EMS           VIPER Ultrasound        VueExplore
x: -1200, y: -5000      x: -800, y: -5000      x: -400, y: -5000
    300 x 200               300 x 200              300 x 200
```

### Raw Data Files (Existing Positions)
```
Nervecentre Notes:  y: -2700  (x: 100, 650, 1200, 1750, 2300, 2850)
Dictations/Imaging: y: -3500  (x: 1200, 1750, 2300 for BigHand)
                               (x: 100 for Medilogik, 650 for VIPER)
Lab Data:           y: -4200  (x: 100, 650, 1200, 1750, 2300)
```

## Data Flow Patterns

### Pattern 1: Temporal Clinical Data
```
Nervecentre EPR Hub → 6 Sequential Encounters (2015-2025)
                   ↓
            Clinical Timeline
```

### Pattern 2: Laboratory Data
```
ICE Laboratory Hub → 6 Lab Reports (matching encounters)
                  ↓
           Lab Trends & Analytics
```

### Pattern 3: Clinical Documentation
```
BigHand Dictation Hub → 3 Provider Dictations
                     ↓
              Transcribed Notes
```

### Pattern 4: Specialized Procedures
```
Medilogik EMS Hub → Colonoscopy Report
VIPER Hub → Point-of-Care Ultrasound
VueExplore Hub → Emergency Department Visit
```

## Integration with Existing Components

The EHR hubs feed into existing analytical components:

```
┌─────────────────┐
│  EHR Hub Nodes  │
└────────┬────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
         ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐
│ Patient Context  │                  │ Medication       │
│ Component        │                  │ Timeline         │
│ x: 100, y: 100   │                  │ x: 1750, y: 100  │
└──────────────────┘                  └──────────────────┘
         │                                      │
         ├──────────────────────────────────────┤
         │                                      │
         ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐
│ Adverse Event    │                  │ Lab Findings     │
│ Analytics        │                  │ & Trends         │
│ x: 100, y: 700   │                  │ x: 1750, y: 900  │
└──────────────────┘                  └──────────────────┘
```

## Spatial Organization Summary

**Y-Axis Layers:**
- `-5400`: Primary EHR system hubs (high volume)
- `-5200`: Container/zone marker
- `-5000`: Secondary EHR system hubs (specialized)
- `-4200`: ICE lab raw data files
- `-3500`: Dictation & imaging raw data files
- `-2700`: Nervecentre raw clinical notes
- `-1800`: Triage flow nodes
- `-1200`: Single encounter documents
- `+100`: Main dashboard components
- `+700`: Analytics components

**X-Axis Organization:**
- Negative X (< 0): Workflow, triage, and data ingestion
- Positive X (> 0): Processed data, analytics, and visualizations
