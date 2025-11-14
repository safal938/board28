# Corrected Sub-Zone Layout

## Overview
Fixed the sub-zone positioning to eliminate overlaps and ensure all zones are properly contained within the Raw EHR Data Zone.

## Raw EHR Data Zone Boundaries
- **Position**: x: 0, y: -4600
- **Dimensions**: 4000 x 3000
- **Y-Range**: -4600 to -1600

## New Sub-Zone Layout

### Vertical Stacking (No Overlaps)

```
┌─────────────────────────────────────────────────────────────┐
│         Raw EHR Data Zone (0, -4600, 4000x3000)             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Nervecentre EPR Sub-Zone (100, -4500, 3800x850)      │ │
│  │  [6 encounter documents]                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ICE Laboratory Sub-Zone (100, -3550, 3800x850)       │ │
│  │  [6 lab reports]                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────┐  ┌──────────┐  ┌──────────┐      │
│  │ BigHand Sub-Zone     │  │Medilogik │  │  VIPER   │      │
│  │ (100, -2600)         │  │Sub-Zone  │  │ Sub-Zone │      │
│  │ 1800x850             │  │(2000,-   │  │(3000,-   │      │
│  │ [3 dictations]       │  │2600)     │  │2600)     │      │
│  │                      │  │900x850   │  │900x850   │      │
│  │                      │  │[1 doc]   │  │[1 doc]   │      │
│  └──────────────────────┘  └──────────┘  └──────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Sub-Zone Positions

### Top Row (Full Width)

**1. Nervecentre EPR Sub-Zone**
- Position: x: 100, y: -4500
- Size: 3800 x 850
- Color: Orange (#f59e0b)
- Contains: 6 encounter documents
- Files positioned at: y: -4400

**2. ICE Laboratory Sub-Zone**
- Position: x: 100, y: -3550
- Size: 3800 x 850
- Color: Blue (#3b82f6)
- Contains: 6 lab reports
- Files positioned at: y: -3450

### Bottom Row (Side by Side)

**3. BigHand Dictation Sub-Zone**
- Position: x: 100, y: -2600
- Size: 1800 x 850
- Color: Green (#10b981)
- Contains: 3 dictations
- Files positioned at: y: -2500

**4. Medilogik EMS Sub-Zone**
- Position: x: 2000, y: -2600
- Size: 900 x 850
- Color: Purple (#8b5cf6)
- Contains: 1 colonoscopy report
- Files positioned at: y: -2500

**5. VIPER Ultrasound Sub-Zone**
- Position: x: 3000, y: -2600
- Size: 900 x 850
- Color: Pink (#ec4899)
- Contains: 1 ultrasound report
- Files positioned at: y: -2500

## File Positions Within Zones

### Nervecentre Files (y: -4400)
- Encounter 1: x: 200
- Encounter 2: x: 750
- Encounter 3: x: 1300
- Encounter 4: x: 1850
- Encounter 5: x: 2400
- Encounter 6: x: 2950

### ICE Lab Files (y: -3450)
- Lab 1: x: 200
- Lab 2: x: 650
- Lab 3: x: 1100
- Lab 5: x: 1550
- Lab 6: x: 2000

### BigHand Files (y: -2500)
- Hayes 2015: x: 200
- Green 2021: x: 750
- Chen 2025: x: 1300

### Medilogik Files (y: -2500)
- Colonoscopy: x: 2100

### VIPER Files (y: -2500)
- IVC Ultrasound: x: 3100

## Spacing Details

- **Vertical gaps between zones**: 100px
- **Horizontal spacing for files**: ~450-550px
- **All zones have 100px left margin** from Raw Data Zone edge
- **All zones have 100px top margin** from their y-position

## Benefits of New Layout

1. **No Overlaps**: Each zone has its own distinct vertical space
2. **Inside Raw Data Zone**: All zones fit within the parent zone boundaries
3. **Logical Grouping**: 
   - Large systems (Nervecentre, ICE) get full width
   - Smaller systems (BigHand, Medilogik, VIPER) share bottom row
4. **Easy Navigation**: Clear visual separation between systems
5. **Scalable**: Room to add more files to each zone

## Connection Lines

The animated edges from EHR hubs to sub-zones remain unchanged and will connect properly to the new zone positions.
