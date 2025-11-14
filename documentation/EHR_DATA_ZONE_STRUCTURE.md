# EHR Data Zone Structure

## Overview
The raw data zone has been organized with EHR system hub nodes that group related data files from each clinical system.

## Data Zone Layout

### Container Node
- **EHR Data Integration Zone** (`-2100, -5200`)
  - Central container for all EHR system hubs
  - Coordinates: x: -2100, y: -5200
  - Dimensions: 600 x 400

## EHR System Hubs

### 1. Nervecentre EPR Hub
- **Location**: x: -1200, y: -5400
- **Dimensions**: 350 x 250
- **Data Files Connected**: 6 encounters
  - `raw-nervecentre-encounter-1` (Encounter 1 - 2015-08-10)
  - `raw-nervecentre-encounter-2` (Encounter 2 - 2016-02-20)
  - `raw-nervecentre-encounter-3` (Encounter 3 - 2018-09-05)
  - `raw-nervecentre-encounter-4` (Encounter 4 - 2021-03-15)
  - `raw-nervecentre-encounter-5` (Encounter 5 - 2025-06-15)
  - `raw-nervecentre-encounter-6` (Encounter 6 - 2025-06-21)
- **Description**: Primary EPR system for clinical encounters

### 2. ICE Laboratory Hub
- **Location**: x: -750, y: -5400
- **Dimensions**: 350 x 250
- **Data Files Connected**: 6 lab reports
  - `raw-ice-lab-data-encounter-1`
  - `raw-ice-lab-data-encounter-2`
  - `raw-ice-lab-data-encounter-3`
  - `raw-ice-lab-data-encounter-5`
  - `raw-ice-lab-data-encounter-6`
  - Additional lab data files
- **Description**: Laboratory information system

### 3. BigHand Dictation Hub
- **Location**: x: -300, y: -5400
- **Dimensions**: 350 x 250
- **Data Files Connected**: 3 dictations
  - `raw-bighand-dictation-hayes-2015` (Dr. Hayes - Rheumatology)
  - `raw-bighand-dictation-green-2021` (Dr. Green - GP)
  - `raw-bighand-dictation-chen-2025` (Dr. Chen - Emergency)
- **Description**: Clinical dictation and transcription system

### 4. Medilogik EMS Hub
- **Location**: x: -1200, y: -5000
- **Dimensions**: 300 x 200
- **Data Files Connected**: 1 procedure
  - `raw-medilogik-ems-colonoscopy` (Colonoscopy - 2023-11-10)
- **Description**: Endoscopy management system

### 5. VIPER Ultrasound Hub
- **Location**: x: -800, y: -5000
- **Dimensions**: 300 x 200
- **Data Files Connected**: 1 imaging study
  - `raw-viper-ultrasound-ivc` (IVC Ultrasound - 2025-06-21)
- **Description**: Point-of-care ultrasound system

### 6. VueExplore Hub
- **Location**: x: -400, y: -5000
- **Dimensions**: 300 x 200
- **Data Files Connected**: 1 encounter
  - `dashboard-item-1759906300004-single-encounter-6` (Emergency Visit)
- **Description**: Emergency department system

## Data Flow Architecture

```
EHR Data Integration Zone (Container)
├── Nervecentre EPR Hub
│   ├── 6 Clinical Encounter Notes
│   └── Positioned at y: -2700 (raw data files)
│
├── ICE Laboratory Hub
│   ├── 6 Lab Result Reports
│   └── Positioned at y: -4200 (raw data files)
│
├── BigHand Dictation Hub
│   ├── 3 Clinical Dictations
│   └── Positioned at y: -3500 (raw data files)
│
├── Medilogik EMS Hub
│   ├── 1 Endoscopy Report
│   └── Positioned at y: -3500 (raw data files)
│
├── VIPER Ultrasound Hub
│   ├── 1 Ultrasound Report
│   └── Positioned at y: -3500 (raw data files)
│
└── VueExplore Hub
    ├── 1 Emergency Encounter
    └── Positioned at y: -1200 (raw data files)
```

## Visual Organization

The data zone is organized in three tiers:

1. **Top Tier** (y: -5400): Major systems with multiple records
   - Nervecentre EPR (6 encounters)
   - ICE Laboratory (6 reports)
   - BigHand Dictation (3 dictations)

2. **Middle Tier** (y: -5000): Specialized systems with fewer records
   - Medilogik EMS (1 procedure)
   - VIPER Ultrasound (1 imaging)
   - VueExplore (1 encounter)

3. **Data Files**: Positioned below hubs at their original locations
   - Raw clinical notes: y: -2700
   - Raw dictations/imaging: y: -3500
   - Lab data: y: -4200

## Integration Points

Each EHR hub node serves as an aggregation point that:
- Groups related data files from the same source system
- Displays metrics about data volume
- Provides system-specific context
- Can be connected to downstream processing agents

## Next Steps

To complete the integration:
1. Add React Flow edges connecting raw data nodes to their respective hub nodes
2. Implement visual indicators for data flow direction
3. Add agent nodes that consume data from multiple hubs
4. Create transformation pipelines between hubs and analytical components
