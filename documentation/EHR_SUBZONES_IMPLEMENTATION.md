# EHR Sub-Zones Implementation

## Overview
Created sub-zones for each EHR system to organize raw data files, with connection lines from EHR hub nodes to their respective sub-zones.

## Changes Made

### 1. Removed VueExplore Node
- Removed `ehr-hub-vueexplore` as there are no associated raw data documents
- VueExplore data was actually part of the SingleEncounterDocument component

### 2. Created Sub-Zones

Each EHR system now has a dedicated sub-zone to contain its raw data files:

#### Nervecentre EPR Sub-Zone
- **ID**: `subzone-nervecentre`
- **Position**: x: -1400, y: -2900
- **Size**: 3500 x 850
- **Color**: Orange (#f59e0b)
- **Contains**: 6 encounter documents

#### ICE Laboratory Sub-Zone
- **ID**: `subzone-ice`
- **Position**: x: -1400, y: -4400
- **Size**: 2800 x 850
- **Color**: Blue (#3b82f6)
- **Contains**: 6 lab reports (encounters 1, 2, 3, 5, 6)

#### BigHand Dictation Sub-Zone
- **ID**: `subzone-bighand`
- **Position**: x: -1400, y: -3700
- **Size**: 2200 x 850
- **Color**: Green (#10b981)
- **Contains**: 3 dictation documents

#### Medilogik EMS Sub-Zone
- **ID**: `subzone-medilogik`
- **Position**: x: -1400, y: -3700
- **Size**: 700 x 850
- **Color**: Purple (#8b5cf6)
- **Contains**: 1 colonoscopy report

#### VIPER Ultrasound Sub-Zone
- **ID**: `subzone-viper`
- **Position**: x: -600, y: -3700
- **Size**: 700 x 850
- **Color**: Pink (#ec4899)
- **Contains**: 1 ultrasound report

### 3. Repositioned Raw Data Files

All raw data files have been moved into their respective sub-zones:

**Nervecentre Files** (y: -2800):
- raw-nervecentre-encounter-1 → x: -1300
- raw-nervecentre-encounter-2 → x: -750
- raw-nervecentre-encounter-3 → x: -200
- raw-nervecentre-encounter-4 → x: 350
- raw-nervecentre-encounter-5 → x: 900
- raw-nervecentre-encounter-6 → x: 1450

**ICE Lab Files** (y: -4300):
- raw-ice-lab-data-encounter-1 → x: -1300
- raw-ice-lab-data-encounter-2 → x: -850
- raw-ice-lab-data-encounter-3 → x: -400
- raw-ice-lab-data-encounter-5 → x: 50
- raw-ice-lab-data-encounter-6 → x: 500

**BigHand Files** (y: -3600):
- raw-bighand-dictation-hayes-2015 → x: -1300
- raw-bighand-dictation-green-2021 → x: -650
- raw-bighand-dictation-chen-2025 → x: 0

**Medilogik Files** (y: -3600):
- raw-medilogik-ems-colonoscopy → x: -1300

**VIPER Files** (y: -3600):
- raw-viper-ultrasound-ivc → x: -500

### 4. Added Connection Edges

Created animated edges connecting each EHR hub node to its sub-zone:

```typescript
const ehrHubEdges: Edge[] = [
  {
    id: 'edge-nervecentre-to-zone',
    source: 'ehr-hub-nervecentre',
    target: 'subzone-nervecentre',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 3 },
  },
  // ... similar edges for ICE, BigHand, Medilogik, and VIPER
];
```

Each edge:
- Uses `smoothstep` type for curved connections
- Is animated to show data flow direction
- Matches the color of its respective EHR system
- Has 3px stroke width for visibility
- Connects from hub's bottom handle to zone's top handle

## Visual Organization

```
EHR Hub Nodes (y: -5400 and -5000)
         ↓ (animated connection lines)
Sub-Zones (y: -2900 to -4400)
         └─ Raw Data Files (inside zones)
```

### Spatial Layout

**Y-Axis Layers:**
- `-5400`: Primary EHR hubs (Nervecentre, ICE, BigHand)
- `-5000`: Secondary EHR hubs (Medilogik, VIPER)
- `-4400`: ICE Laboratory sub-zone
- `-3700`: BigHand, Medilogik, VIPER sub-zones
- `-2900`: Nervecentre sub-zone

**X-Axis Organization:**
- All sub-zones start at x: -1400 (left-aligned)
- Zones are sized to fit their content
- Files are evenly spaced within zones

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│           EHR Hub Nodes (Top Layer)                 │
│  [Nervecentre] [ICE] [BigHand] [Medilogik] [VIPER] │
└──────┬──────────┬────────┬─────────┬────────┬───────┘
       │          │        │         │        │
       │ (animated edges)  │         │        │
       ▼          ▼        ▼         ▼        ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌────┐ ┌────┐
│Nerve Sub │ │ICE Sub │ │BigHand │ │Med │ │VIP │
│  Zone    │ │ Zone   │ │  Sub   │ │Sub │ │Sub │
│          │ │        │ │  Zone  │ │Zone│ │Zone│
│ [6 docs] │ │[6 labs]│ │[3 dict]│ │[1] │ │[1] │
└──────────┘ └────────┘ └────────┘ └────┘ └────┘
```

## Benefits

1. **Clear Organization**: Each EHR system's data is visually grouped
2. **Easy Navigation**: Users can see which documents belong to which system
3. **Visual Hierarchy**: Hub → Zone → Documents flow is clear
4. **Scalability**: Easy to add more documents to any zone
5. **Color Coding**: Each system has a unique color for quick identification

## Next Steps

To enhance the implementation:
1. Add click handlers to EHR hubs to highlight their zones
2. Implement zoom-to-zone functionality
3. Add document count badges on zones
4. Create collapsible zones to reduce clutter
5. Add search/filter functionality by EHR system
