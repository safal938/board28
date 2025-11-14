# EHR Hub Node Implementation

## Overview
Created a custom EHR Hub Node component that displays EHR system information in a clean, professional format matching the provided design.

## Component: EHRHubNode.tsx

### Design Features
- **Icon**: Database icon in an orange rounded square
- **System Name**: Large, bold text displaying the EHR system name
- **Description**: Gray subtitle text describing the system
- **Document Count**: Shows the number of documents with proper pluralization
- **Styling**: White background with orange border, rounded corners, and subtle shadow

### Props
```typescript
interface EHRHubNodeProps {
  data: {
    label: string;        // EHR system name
    count?: number;       // Number of documents
    description?: string; // System description
  };
}
```

## Integration

### Canvas2.tsx
- Added `EHRHubNode` import
- Registered `ehrHub` node type in `nodeTypes`
- Updated node type detection logic to recognize `type === 'ehrHub'`
- Updated node data handling for ehrHub nodes

### Canvas3.tsx
- Added `EHRHubNode` import
- Registered `ehrHub` node type in `nodeTypes`
- Updated filter logic to include ehrHub nodes

## Board Items Configuration

### EHR Hub Nodes in boardItems.json

All EHR system hub nodes now use:
- `type: "ehrHub"` (instead of "triageFlow")
- Simplified `data` object with only essential fields:
  - `label`: System name
  - `count`: Number of documents
  - `description`: System description

### Example Node
```json
{
  "id": "ehr-hub-nervecentre",
  "type": "ehrHub",
  "x": -1200,
  "y": -5400,
  "width": 350,
  "height": 250,
  "data": {
    "label": "Nervecentre EPR",
    "count": 6,
    "description": "Primary EPR system for clinical encounters"
  }
}
```

## EHR Systems

1. **Nervecentre EPR** - 6 documents
2. **ICE Laboratory** - 6 documents
3. **BigHand Dictation** - 3 documents
4. **Medilogik EMS** - 1 document
5. **VIPER Ultrasound** - 1 document
6. **VueExplore** - 1 document

## Visual Design

The nodes feature:
- Clean white background
- Orange (#f59e0b) border and accents
- Database icon in orange rounded square
- Large, readable system name
- Subtle description text
- Document count with proper grammar
- Connection handles at top and bottom

## Next Steps

To complete the integration:
1. Add React Flow edges connecting raw data nodes to their respective EHR hub nodes
2. Create visual connections from EHR hubs to downstream processing components
3. Add hover states or tooltips for additional information
4. Implement click handlers for expanding/collapsing related data files
