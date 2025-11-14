# Final EHR Data Zone Layout

## Complete Implementation Summary

All EHR hub nodes, sub-zones, raw data files, and connection lines are now properly configured.

## Raw EHR Data Zone
- **Position**: x: -1500, y: -5600
- **Dimensions**: 5500 x 4200
- **Contains**: All EHR hubs, sub-zones, and raw data files

## EHR Hub Nodes (Top Layer)

### Positioned at Top of Raw Data Zone

**Row 1 (y: -5400):**
1. **Nervecentre EPR** - x: -1200, 350x250, 6 documents
2. **ICE Laboratory** - x: -750, 350x250, 6 documents
3. **BigHand Dictation** - x: -300, 350x250, 3 documents

**Row 2 (y: -5000):**
4. **Medilogik EMS** - x: -1200, 300x200, 1 document
5. **VIPER Ultrasound** - x: -800, 300x200, 1 document

## Sub-Zones (Middle Layer)

### Configuration
- **zIndex**: -2 (below documents)
- **selectable**: false (cannot be selected)
- **draggable**: false (cannot be moved)

### Positions

**1. Nervecentre EPR Sub-Zone**
- Position: x: 100, y: -4500
- Size: 3800 x 900
- Color: Orange (#f59e0b)
- Contains: 6 encounter documents at y: -4400

**2. ICE Laboratory Sub-Zone**
- Position: x: 100, y: -3500
- Size: 3800 x 900
- Color: Blue (#3b82f6)
- Contains: 6 lab reports at y: -3400

**3. BigHand Dictation Sub-Zone**
- Position: x: 100, y: -2500
- Size: 1800 x 900
- Color: Green (#10b981)
- Contains: 3 dictations at y: -2400

**4. Medilogik EMS Sub-Zone**
- Position: x: 2000, y: -2500
- Size: 900 x 900
- Color: Purple (#8b5cf6)
- Contains: 1 colonoscopy report at y: -2400

**5. VIPER Ultrasound Sub-Zone**
- Position: x: 3000, y: -2500
- Size: 900 x 900
- Color: Pink (#ec4899)
- Contains: 1 ultrasound report at y: -2400

## Connection Lines (Edges)

### Animated Edges from Hubs to Sub-Zones

All edges use:
- **Type**: smoothstep (curved lines)
- **Animated**: true (flowing animation)
- **Stroke Width**: 3px
- **Color**: Matches system color

**Edge Definitions:**

```typescript
1. Nervecentre Hub → Nervecentre Sub-Zone
   - Color: #f59e0b (orange)
   - Source: ehr-hub-nervecentre (bottom handle)
   - Target: subzone-nervecentre (top handle)

2. ICE Hub → ICE Sub-Zone
   - Color: #3b82f6 (blue)
   - Source: ehr-hub-ice (bottom handle)
   - Target: subzone-ice (top handle)

3. BigHand Hub → BigHand Sub-Zone
   - Color: #10b981 (green)
   - Source: ehr-hub-bighand (bottom handle)
   - Target: subzone-bighand (top handle)

4. Medilogik Hub → Medilogik Sub-Zone
   - Color: #8b5cf6 (purple)
   - Source: ehr-hub-medilogik (bottom handle)
   - Target: subzone-medilogik (top handle)

5. VIPER Hub → VIPER Sub-Zone
   - Color: #ec4899 (pink)
   - Source: ehr-hub-viper (bottom handle)
   - Target: subzone-viper (top handle)
```

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│         Raw EHR Data Zone (-1500, -5600, 5500x4200)             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Nervecentre  │  │     ICE      │  │   BigHand    │          │
│  │     EPR      │  │  Laboratory  │  │  Dictation   │          │
│  │  6 documents │  │  6 documents │  │  3 documents │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                    │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  Medilogik   │  │    VIPER     │                             │
│  │     EMS      │  │  Ultrasound  │                             │
│  │  1 document  │  │  1 document  │                             │
│  └──────┬───────┘  └──────┬───────┘                             │
│         │                 │                                      │
│         │  (animated connection lines)                           │
│         ▼                 ▼                 ▼                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Nervecentre EPR Sub-Zone (Orange)                         │ │
│  │  [6 encounter documents]                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ICE Laboratory Sub-Zone (Blue)                            │ │
│  │  [6 lab reports]                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────┐  ┌──────────┐         │
│  │ BigHand Sub-Zone     │  │Medilogik │  │  VIPER   │         │
│  │ (Green)              │  │Sub-Zone  │  │ Sub-Zone │         │
│  │ [3 dictations]       │  │(Purple)  │  │ (Pink)   │         │
│  │                      │  │[1 doc]   │  │[1 doc]   │         │
│  └──────────────────────┘  └──────────┘  └──────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Z-Index Layers

1. **Raw EHR Data Zone**: -1 (background)
2. **Sub-Zones**: -2 (below documents, above main zone)
3. **Raw Data Documents**: 1 (default, above zones)
4. **EHR Hub Nodes**: 1 (default, above zones)
5. **Connection Lines**: Rendered between layers

## Key Features

✓ **All hubs inside Raw Data Zone**
✓ **Sub-zones not selectable** (zIndex: -2)
✓ **Documents above zones** (zIndex: 1)
✓ **Animated connection lines** (color-coded)
✓ **No overlaps** (proper spacing)
✓ **900px zone height** (accommodates 700px documents)
✓ **Color-coded systems** (easy identification)

## File Locations

- **Main Config**: `src/data/boardItems.json`
- **Zone Config**: `src/data/zone-config.json`
- **Edge Definitions**: `src/components/Canvas2.tsx` (ehrHubEdges array)
- **Hub Component**: `src/components/EHRHubNode.tsx`

## Data Flow

```
EHR Hub Nodes (System Names + Counts)
         ↓
  Animated Connection Lines
         ↓
    Sub-Zones (Colored Containers)
         ↓
  Raw Data Files (Documents)
```

This creates a clear visual hierarchy showing how data flows from EHR systems through organized zones to individual documents.
