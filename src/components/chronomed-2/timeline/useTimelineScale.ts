import { useMemo } from 'react';
import * as d3 from 'd3';
import { Encounter } from '../types';

// --- Helper Hooks ---
// Creates a Polylinear scale that maps specific encounter dates to evenly spaced X coordinates
export const useTimelineScale = (encounters: Encounter[], width: number, padding: number) => {
  return useMemo(() => {
    // Sort encounters by date to ensure strict time ordering
    const sortedDates = [...encounters]
        .map(e => new Date(e.date))
        .sort((a, b) => a.getTime() - b.getTime());
    
    if (sortedDates.length === 0) return d3.scaleTime();

    // We want the encounters to be spaced evenly across the available width (minus padding)
    const availableWidth = width - (padding * 2);
    
    // If we have N encounters, we have N-1 segments between them.
    // Step size is constant visual distance.
    const step = availableWidth / (sortedDates.length > 1 ? sortedDates.length - 1 : 1);
    
    // Create the main domain and range for the encounters
    // Domain: [Date1, Date2, Date3, ...] 
    // Range:  [Pad, Pad+Step, Pad+2Step, ...]
    const domain = sortedDates;
    const range = sortedDates.map((_, i) => padding + (i * step));

    // To handle data points (like meds/labs) that fall *before* the first encounter 
    // or *after* the last one, we add extension points to the scale.
    // We project a "virtual" step backward and forward.
    // We use an arbitrary time buffer (e.g., 1 year) to map to that step distance.
    
    const firstDate = sortedDates[0];
    const lastDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : new Date();
    
    const preDate = d3.timeYear.offset(firstDate, -1); // 1 year before
    const postDate = d3.timeYear.offset(lastDate, 1);  // 1 year after

    const fullDomain = [preDate, ...domain, postDate];
    const fullRange = [padding - step, ...range, width - padding + step];

    // d3.scaleTime handles the linear interpolation between these discrete points.
    return d3.scaleTime()
      .domain(fullDomain)
      .range(fullRange);
  }, [encounters, width, padding]);
};
