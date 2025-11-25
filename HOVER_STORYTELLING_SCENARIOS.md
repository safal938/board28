# Interactive Hover Storytelling - All Scenarios

## Overview
The timeline now supports hover-based storytelling across **4 major clinical scenarios**. Each scenario reveals animated connections when you hover over any related element.

---

## Scenario 1: MTX Toxicity Detection (July 15, 2024)
**Trigger Points:**
- Hover over Methotrexate medication bar
- Hover over ALT spike (185 µmol/L)
- Hover over AST spike (130 µmol/L)
- Hover over Risk Score 0.8 alert icon

**Story Flow:**
1. **Edge 1** (0s delay): Methotrexate → ALT 185
2. **Edge 2** (0.9s delay): Methotrexate → AST 130
3. **Edge 3** (1.8s delay): ALT 185 → Risk Score 0.8
4. **Edge 4** (2.7s delay): AST 130 confirms injury

**Clinical Narrative:** 6 weeks of MTX therapy causes liver enzyme elevation, triggering high-risk alert.

---

## Scenario 2: Crisis Presentation (August 12, 2024)
**Trigger Points:**
- Hover over ALT crisis point (490 µmol/L)
- Hover over AST crisis point (350 µmol/L)
- Hover over Bilirubin crisis point (110 µmol/L)
- Hover over "Acute DILI Crisis" event card

**Story Flow:**
1. **Edge 1** (0s delay): ALT 490 → Crisis Event
2. **Edge 2** (0.9s delay): AST 350 → Crisis Event
3. **Edge 3** (1.8s delay): Bilirubin 110 → Crisis Event

**Clinical Narrative:** Severe hepatotoxicity with jaundice presents as acute DILI crisis requiring immediate hospitalization.

---

## Scenario 3: Hospital Admission & NAC Treatment (August 12-15, 2024)
**Trigger Points:**
- Hover over "Hospital Admission" event card (August 12)
- Hover over NAC medication bar
- Hover over ALT recovery point (August 15)

**Story Flow:**
1. **Edge 1** (0s delay): Hospital Admission → NAC infusion started
2. **Edge 2** (0.9s delay): NAC + MTX stopped → ALT begins to fall

**Clinical Narrative:** Emergency hospitalization leads to NAC treatment protocol, showing early signs of liver recovery.

---

## Scenario 4: Peak Cholestasis (August 15, 2024)
**Trigger Points:**
- Hover over Bilirubin peak (190 µmol/L)
- Hover over "Peak Cholestasis" event card

**Story Flow:**
1. **Edge 1** (0s delay): Bilirubin 190 → Peak cholestasis event

**Clinical Narrative:** Despite ALT improvement, cholestasis reaches maximum severity.

---

## Technical Implementation

### Related Handles System
Each scenario defines a `relatedHandles` array that groups all connected elements:
- Lab points (source/target handles)
- Medication bars (group handles)
- Risk score alerts
- Key event cards

### Hover Detection
- **Lab points**: Hover over data points or alert icons
- **Medications**: Hover over medication bars
- **Events**: Hover over event cards
- **Risk scores**: Hover over alert icons

### Animation System
- Sequential delays create chronological storytelling
- Custom `AnimatedDrawingEdge` component draws lines progressively
- Arrow markers appear only after line drawing completes
- 500ms delay prevents flickering during mouse movement

---

## User Experience
1. **Hover** over any clinical element
2. **Watch** as related connections animate in sequence
3. **Understand** the causal relationships in the patient's journey
4. **Move away** to reset and explore other scenarios

All scenarios work independently and can be explored in any order.
