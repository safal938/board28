import { useMemo } from 'react';
import * as d3 from 'd3';
import { Encounter } from '../types';

// --- Helper Hooks ---
// Creates a Polylinear scale that maps specific encounter dates to evenly spaced X coordinates
export const useTimelineScale = (encounters: Encounter[], paddingLeft: number, paddingRight: number, additionalDates: Date[] = []) => {
  return useMemo(() => {
    // Configuration for spacing
    const ENCOUNTER_STEP = 300;
    const COMPACT_STEP = 100;

    // Combine and sort all items
    const items = [
        ...encounters.map(e => ({ date: new Date(e.date), type: 'encounter' })),
        ...additionalDates.map(d => ({ date: d, type: 'additional' }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (items.length === 0) return { scale: d3.scaleTime(), width: 1400 };

    // Calculate positions cumulatively
    const domain: Date[] = [];
    const range: number[] = [];
    
    let currentX = paddingLeft;
    
    items.forEach((item, i) => {
        domain.push(item.date);
        range.push(currentX);
        
        // Calculate gap to NEXT item
        if (i < items.length - 1) {
            // If the CURRENT item is additional, use compact step
            // If the CURRENT item is encounter, use normal step
            // Actually, we want the gap *before* the encounter to be normal?
            // User said "past meds... minimal space".
            // Let's say: if the *next* item is additional, use compact step?
            // No, usually spacing is associated with the interval.
            // If I have [Past1, Past2, Enc1]
            // Gap Past1->Past2: Compact
            // Gap Past2->Enc1: Compact (because Past2 is just a med) OR Normal (because Enc1 is big)?
            // Let's try: Step size depends on the *target* (next) item? 
            // Or the *source*?
            // If I use source:
            // Past1 -> (Compact) -> Past2 -> (Compact) -> Enc1 -> (EncounterStep) -> Enc2
            // This means Past2 is close to Enc1. This seems right.
            
            let step = item.type === 'additional' ? COMPACT_STEP : ENCOUNTER_STEP;

            // Increase gap between additional dates (e.g. past meds) and the first encounter
            // This ensures that even with small start padding, there is separation before the main timeline
            if (i < items.length - 1 && item.type === 'additional' && items[i+1].type === 'encounter') {
                step = ENCOUNTER_STEP;
            }

            currentX += step;
        }
    });

    // Calculate total width
    const contentWidth = currentX + paddingRight;
    const totalWidth = Math.max(1400, contentWidth);

    // Add buffer points for the scale domain (pre/post)
    const firstDate = items[0].date;
    const lastDate = items[items.length - 1].date;
    
    const preDate = d3.timeYear.offset(firstDate, -1);
    const postDate = d3.timeYear.offset(lastDate, 1);

    const fullDomain = [preDate, ...domain, postDate];
    // Extend range using the same step logic for buffers
    // Pre-buffer: subtract step of first item
    const firstStep = items[0].type === 'additional' ? COMPACT_STEP : ENCOUNTER_STEP;
    const lastStep = items[items.length - 1].type === 'additional' ? COMPACT_STEP : ENCOUNTER_STEP;
    
    const fullRange = [range[0] - firstStep, ...range, range[range.length - 1] + lastStep];

    const scale = d3.scaleTime()
      .domain(fullDomain)
      .range(fullRange);
      
    return { scale, width: totalWidth };
  }, [encounters, paddingLeft, paddingRight, additionalDates]);
};
