# Expanded Raw Data Zone Layout

## Overview
Expanded the Raw EHR Data Zone and increased sub-zone heights to accommodate taller documents and include EHR hub nodes.

## Raw EHR Data Zone - New Dimensions

### Previous Size
- Position: x: 0, y: -4600
- Dimensions: 4000 x 3000
- Y-Range: -4600 to -1600

### New Size
- **Position**: x: -1500, y: -5600
- **Dimensions**: 5500 x 4200
- **Y-Range**: -5600 to -1400
- **X-Range**: -1500 to 4000

### Changes
- **Width**: Increased from 4000 to 5500 (+1500px)
- **Height**: Increased from 3000 to 4200 (+1200px)
- **Left expansion**: Now starts at x: -1500 (includes EHR hub nodes)
- **Top expansion**: Now starts at y: -5600 (includes EHR hub nodes)

## EHR Hub Nodes - Now Inside Raw Data Zone

All EHR hub nodes are now contained within the expanded Raw Data Zone:

- **Nervecentre EPR**: x: -1200, y: -5400 ✓ Inside
- **ICE Laboratory**: x: -750, y: -5400 ✓ Inside
- **BigHand Dictation**: x: -300, y: -5400 ✓ Inside
- **Medilogik EMS**: x: -1200, y: -5000 ✓ Inside
- **VIPER Ultrasound**: x: -800, y: -5000 ✓ Inside

## Sub-Zone Heights - Increased

All sub-zones now have **900px height** (increased from 850px) to accommodate taller documents:

### Nervecentre EPR Sub-Zone
- Position: x: 100, y: -4500
- Size: 3800 x **900** (+50px)
- Contains: 6 encounter documents (height: 700px each)

### ICE Laboratory Sub-Zone
- Position: x: 100, y: -3500 (adjusted)
- Size: 3800 x **900** (+50px)
- Contains: 6 lab reports (height: 600px each)

### BigHand Dictation Sub-Zone
- Position: x: 100, y: -2500 (adjusted)
- Size: 1800 x **900** (+50px)
- Contains: 3 dictations (height: 700px each)

### Medilogik EMS Sub-Zone
- Position: x: 2000, y: -2500 (adjusted)
- Size: 900 x **900** (+50px)
- Contains: 1 colonoscopy report (height: 700px)

### VIPER Ultrasound Sub-Zone
- Position: x: 3000, y: -2500 (adjusted)
- Size: 900 x **900** (+50px)
- Contains: 1 ultrasound report (height: 700px)

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│    Raw EHR Data Zone (-1500, -5600, 5500x4200)                  │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │Nerve Hub │  │ICE Hub   │  │BigHand   │  (y: -5400)          │
│  └──────────┘  └──────────┘  │Hub       │                      │
│                               └──────────┘                      │
│  ┌──────────┐  ┌──────────┐                                    │
│  │Med Hub   │  │VIPER Hub │              (y: -5000)            │
│  └──────────┘  └──────────┘                                    │
│       │             │             │                              │
│       └─────────────┴─────────────┘ (connection lines)          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Nervecentre EPR Sub-Zone (100, -4500, 3800x900)          │ │
│  │  [6 encounter documents - 700px tall each]                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ICE Laboratory Sub-Zone (100, -3500, 3800x900)           │ │
│  │  [6 lab reports - 600px tall each]                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────┐  ┌──────────┐         │
│  │ BigHand Sub-Zone     │  │Medilogik │  │  VIPER   │         │
│  │ (100, -2500)         │  │Sub-Zone  │  │ Sub-Zone │         │
│  │ 1800x900             │  │(2000,-   │  │(3000,-   │         │
│  │ [3 docs - 700px]     │  │2500)     │  │2500)     │         │
│  │                      │  │900x900   │  │900x900   │         │
│  │                      │  │[1 doc]   │  │[1 doc]   │         │
│  └──────────────────────┘  └──────────┘  └──────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Document Clearance

With 900px zone height:
- **700px documents**: 200px clearance (comfortable)
- **600px documents**: 300px clearance (very comfortable)
- **Labels and padding**: Adequate space for zone labels

## Benefits

1. **All EHR hubs inside**: Hub nodes are now within the Raw Data Zone
2. **Taller documents fit**: 900px height accommodates 700px documents
3. **Better spacing**: More breathing room between elements
4. **No overlaps**: Clear separation between all zones
5. **Professional appearance**: Proper margins and spacing

## Connection Lines

The animated edges from EHR hubs to sub-zones will now show a clear visual flow from the top of the Raw Data Zone down to the organized sub-zones below.
