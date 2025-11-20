
import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import * as d3 from 'd3';
import { Encounter, Medication, LabMetric, KeyEvent } from './types';

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

// --- Components ---

interface MasterGridProps {
    encounters: Encounter[];
    scale: d3.ScaleTime<number, number>;
    height: number;
}

export const MasterGrid: React.FC<MasterGridProps> = ({ encounters, scale, height }) => {
    return (
        <div className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ height }}>
            <svg width="100%" height="100%">
                {encounters.map((enc, i) => {
                    const x = scale(new Date(enc.date));
                    return (
                        <g key={i}>
                            {/* Dashed vertical line */}
                            <line 
                                x1={x} y1={0} 
                                x2={x} y2="100%" 
                                stroke="#E5E7EB" 
                                strokeWidth={1.5} 
                                strokeDasharray="6,4" 
                            />
                            {/* Small dot at top */}
                            <circle cx={x} cy={0} r={3} fill="#CBD5E1" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

interface TimelineAxisProps {
  encounters: Encounter[];
  scale: d3.ScaleTime<number, number>;
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({ encounters, scale }) => {
  // Sort to match scale
  const sortedEncounters = [...encounters].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative w-full h-14">
       {/* We render specific dates for encounters, not generic ticks */}
      {sortedEncounters.map((enc, i) => {
          const date = new Date(enc.date);
          const x = scale(date);
          const year = date.getFullYear();
          // For closely grouped events (same year), show month
          const showMonth = sortedEncounters.some((e, idx) => idx !== i && new Date(e.date).getFullYear() === year);
          const label = showMonth ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : year;

          return (
            <div 
                key={i} 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pt-3"
                style={{ left: x }}
            >
                <div className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm z-10">
                    {label}
                </div>
                {/* Connector to the grid line below */}
                <div className="w-px h-4 bg-gray-300 mt-1"></div>
            </div>
          );
      })}
    </div>
  );
};

interface EncounterTrackProps {
  encounters: Encounter[];
  scale: d3.ScaleTime<number, number>;
}

export const EncounterTrack: React.FC<EncounterTrackProps> = ({ encounters, scale }) => {
  const [trackHeight, setTrackHeight] = useState<number>(400); 
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Helper to calculate and set height
  const updateHeight = () => {
    let maxH = 0;
    cardsRef.current.forEach((card) => {
      if (card) {
        maxH = Math.max(maxH, card.offsetHeight);
      }
    });
    // Increased buffer to prevent overlap with next section
    // Top offset (8px) + card height + bottom buffer (80px)
    const calculatedHeight = maxH > 0 ? maxH + 80 : 400;
    
    if (Math.abs(calculatedHeight - trackHeight) > 2) {
      setTrackHeight(calculatedHeight);
    }
  };

  // Measure initially and on prop changes
  useLayoutEffect(() => {
    updateHeight();
  }, [encounters, scale]);

  // Add ResizeObserver to handle font loads or other reflows
  useEffect(() => {
    const observers: ResizeObserver[] = [];
    cardsRef.current.forEach((card) => {
      if (card) {
        const ro = new ResizeObserver(() => updateHeight());
        ro.observe(card);
        observers.push(ro);
      }
    });
    return () => observers.forEach(ro => ro.disconnect());
  }, [encounters]); // Re-bind if encounters change

  // Reset ref array on render
  cardsRef.current = [];

  return (
    <div 
        className="relative w-full transition-[height] duration-300 ease-out z-20" 
        style={{ height: trackHeight }}
    >
        {/* Track Label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 hidden">Encounters</div>
        
        {encounters.map((enc, i) => {
            const x = scale(new Date(enc.date));
            return (
            <div 
                key={enc.encounter_no} 
                ref={(el) => { cardsRef.current[i] = el; }}
                className="absolute top-2 w-[240px] bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-blue-300 cursor-pointer group/card overflow-hidden z-20"
                style={{ left: x, transform: 'translateX(-50%)' }}
            >
                {/* Color Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                
                <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                            {enc.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{enc.date}</span>
                    </div>
                    
                    <div className="text-sm font-bold text-slate-800 mb-1 leading-tight group-hover/card:text-blue-600 transition-colors">
                        {enc.diagnosis}
                    </div>
                    
                    <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded mt-2 border border-slate-100">
                        {enc.notes}
                    </div>
                </div>
                
                {/* Connector Dot */}
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            );
        })}
    </div>
  );
};

interface MedicationTrackProps {
  medications: Medication[];
  scale: d3.ScaleTime<number, number>;
}

export const MedicationTrack: React.FC<MedicationTrackProps> = ({ medications, scale }) => {
  return (
    <div className="relative w-full py-6 border-t border-gray-100 bg-slate-50/30 z-10">
       <div className="absolute left-4 -top-3 px-2 py-0.5 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">
            Medications
       </div>
       
       <div className="mt-4 flex flex-col gap-3">
        {medications.map((med, idx) => {
            const start = scale(new Date(med.startDate));
            const endDate = med.endDate ? new Date(med.endDate) : new Date(); 
            const end = scale(endDate);
            const width = Math.max(end - start, 10); 

            // Enhanced Styling
            let barClass = "bg-emerald-100 border-emerald-300 text-emerald-800";
            let dotClass = "bg-emerald-500";
            
            if (med.name.toLowerCase().includes("methotrexate")) {
                barClass = "bg-purple-100 border-purple-300 text-purple-900";
                dotClass = "bg-purple-500";
            }
            if (med.name.toLowerCase().includes("lisinopril")) {
                barClass = "bg-orange-100 border-orange-300 text-orange-900";
                dotClass = "bg-orange-500";
            }
            if (med.name.toLowerCase().includes("trimethoprim")) {
                barClass = "bg-red-100 border-red-300 text-red-900";
                dotClass = "bg-red-500";
            }

            return (
                <div key={idx} className="relative h-9 w-full group">
                    {/* Sticky Label for context when scrolling horizontally */}
                    <div 
                        className="absolute z-10 h-full flex items-center pointer-events-none"
                        style={{ left: start }}
                    >
                        <span className={`text-xs font-semibold px-2 py-1 rounded-l-md bg-white/80 backdrop-blur-sm border shadow-sm whitespace-nowrap transform -translate-x-full mr-1 hidden group-hover:block animate-fade-in-up`}>
                            {med.name}
                        </span>
                    </div>

                    <div 
                        className={`absolute top-1 h-7 rounded-md border shadow-sm flex items-center px-3 overflow-hidden whitespace-nowrap transition-all hover:shadow-md ${barClass}`}
                        style={{ left: start, width: width }}
                        title={`${med.name} ${med.dose}`}
                    >
                         <div className={`w-2 h-2 rounded-full mr-2 ${dotClass} shrink-0`}></div>
                         <span className="text-xs font-bold mr-2">{med.name}</span>
                         <span className="text-[10px] opacity-75 border-l border-current pl-2">{med.dose}</span>
                    </div>
                </div>
            );
        })}
       </div>
    </div>
  );
};

interface LabTrackProps {
  labs: LabMetric[];
  scale: d3.ScaleTime<number, number>;
  height?: number;
}

export const LabTrack: React.FC<LabTrackProps> = ({ labs, scale, height = 140 }) => {
  const CHART_MARGIN = { top: 10, bottom: 25, left: 45 }; // Increased left for Y axis values, bottom for X axis dates

  return (
    <div className="w-full border-t border-gray-200 bg-white pt-8 pb-2 relative z-0">
         <div className="absolute left-4 -mt-11 px-2 py-0.5 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">
            Lab Trends
         </div>
         
        {labs.map((metric, idx) => {
            const values = metric.values;
            if (values.length === 0) return null;
            
            const hasRefRange = !!metric.referenceRange;
            const maxRef = metric.referenceRange?.max || 0;
            // Determine scale domain
            // We want to include 0, the data points, and the reference range max
            const maxVal = d3.max(values, d => d.value) || 100;
            const domainMax = Math.max(maxVal, maxRef) * 1.1; // add 10% buffer
            
            const yScale = d3.scaleLinear()
                .domain([0, domainMax])
                .range([height - CHART_MARGIN.bottom, CHART_MARGIN.top]);

            // Calculate gradient split percentage
            // y(maxRef) gives the pixel position of the threshold line. 
            const yThreshold = yScale(maxRef);
            const thresholdPercent = (yThreshold / height) * 100;
            const safeThresholdPercent = Math.max(0, Math.min(100, thresholdPercent));

            const line = d3.line<{t: string, value: number}>()
                .x(d => scale(new Date(d.t)))
                .y(d => yScale(d.value))
                .curve(d3.curveStepAfter);

            // Generate ticks for Y axis (3-4 ticks)
            const yTicks = yScale.ticks(4);
            
            // Generate ticks for X axis (Years)
            const xTicks = scale.ticks(d3.timeYear.every(1));

            const pathD = line(values) || "";
            const pathStroke = hasRefRange ? `url(#grad-stroke-${idx})` : "#3B82F6";

            return (
                <div key={idx} className="relative w-full mb-6 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
                    {/* Header - Moved above chart */}
                    <div className="px-6 pt-2 flex items-baseline gap-3">
                        <span className="text-sm font-bold text-slate-800">{metric.biomarker}</span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{metric.unit}</span>
                        {hasRefRange && metric.referenceRange && (
                            <span className="text-xs font-mono text-slate-400">
                                (Ref: {metric.referenceRange.min}-{metric.referenceRange.max})
                            </span>
                        )}
                    </div>
                    
                    <div style={{ height: height }} className="w-full relative">
                        <svg width="100%" height={height} className="overflow-visible absolute left-0 top-0">
                            {hasRefRange && (
                                <defs>
                                    <linearGradient id={`grad-stroke-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                                        {/* Top part (High values) -> Red */}
                                        <stop offset="0%" stopColor="#EF4444" /> 
                                        <stop offset={`${safeThresholdPercent}%`} stopColor="#EF4444" />
                                        {/* Transition point */}
                                        <stop offset={`${safeThresholdPercent}%`} stopColor="#3B82F6" />
                                        {/* Bottom part (Low values) -> Blue */}
                                        <stop offset="100%" stopColor="#3B82F6" />
                                    </linearGradient>
                                </defs>
                            )}

                            {/* Background Red Zone for values > Max Ref */}
                            {hasRefRange && maxRef > 0 && (
                                <rect
                                    x={CHART_MARGIN.left}
                                    y={CHART_MARGIN.top}
                                    width={`calc(100% - ${CHART_MARGIN.left}px)`}
                                    height={Math.max(0, yThreshold - CHART_MARGIN.top)}
                                    fill="rgba(239, 68, 68, 0.15)" 
                                    className="pointer-events-none"
                                />
                            )}

                            {/* Y Axis Grid Lines & Labels */}
                            {yTicks.map((tick, i) => (
                                <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                                    <line x1={CHART_MARGIN.left} x2="100%" stroke="#F1F5F9" strokeWidth={1} strokeDasharray={hasRefRange && tick === maxRef ? "4,2" : "0"} />
                                    <text 
                                        x={CHART_MARGIN.left - 6} 
                                        y={3} 
                                        textAnchor="end" 
                                        className="text-[10px] fill-slate-400 font-mono"
                                    >
                                        {tick}
                                    </text>
                                </g>
                            ))}
                            
                            {/* X Axis Vertical Grid Lines (No Text) */}
                            {xTicks.map((tick, i) => {
                                const xPos = scale(tick);
                                // Only show tick if it's within the approximate visual range (simple check)
                                if (xPos < CHART_MARGIN.left) return null; 
                                
                                return (
                                    <g key={`x-${i}`} transform={`translate(${xPos}, ${height - 5})`}>
                                        {/* Removed Text Label as requested */}
                                        <line y1={-height + CHART_MARGIN.bottom} y2={-height + CHART_MARGIN.top} stroke="#F1F5F9" strokeWidth={1} strokeDasharray="2,2" />
                                    </g>
                                );
                            })}

                            {/* Reference Line Label (Red text if above) */}
                            {hasRefRange && maxRef > 0 && (
                                <text 
                                    x="100%" 
                                    y={yThreshold - 4} 
                                    textAnchor="end" 
                                    className="text-[9px] fill-red-400 font-bold uppercase tracking-wider pr-4 opacity-60"
                                >
                                    Upper Limit
                                </text>
                            )}

                            {/* Reference Line (Dashed) */}
                            {hasRefRange && maxRef > 0 && (
                                <line 
                                    x1={CHART_MARGIN.left} x2="100%" 
                                    y1={yScale(maxRef)} y2={yScale(maxRef)} 
                                    stroke="#F87171" strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.5}
                                />
                            )}

                            {/* Data Line with Gradient Stroke or Solid Color */}
                            <path d={pathD} fill="none" stroke={pathStroke} strokeWidth={2.5} strokeLinecap="butt" strokeLinejoin="miter" />
                            
                            {/* Data Points */}
                            {values.map((v, i) => {
                                let pointColor = "#3B82F6";
                                if (hasRefRange) {
                                    pointColor = v.value > maxRef ? "#EF4444" : "#3B82F6";
                                }
                                
                                return (
                                    <g key={i} transform={`translate(${scale(new Date(v.t))}, ${yScale(v.value)})`}>
                                        <circle 
                                            r={4} 
                                            fill="white" 
                                            stroke={pointColor} 
                                            strokeWidth={2} 
                                            className="transition-all group-hover:r-5 cursor-crosshair"
                                        />
                                        <title>{`${metric.biomarker}: ${v.value} ${metric.unit} on ${new Date(v.t).toLocaleDateString()}`}</title>
                                        
                                        {/* Value Label showing on hover or if very abnormal */}
                                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                            <rect x="-20" y="-26" width="40" height="18" rx="4" fill="#1E293B" />
                                            <text y="-14" textAnchor="middle" className="text-[10px] fill-white font-bold font-mono">
                                                {v.value}
                                            </text>
                                            <path d="M-4 -9 L4 -9 L0 -5 Z" fill="#1E293B" />
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

interface KeyEventsTrackProps {
    events: KeyEvent[];
    scale: d3.ScaleTime<number, number>;
}

export const KeyEventsTrack: React.FC<KeyEventsTrackProps> = ({ events, scale }) => {
    return (
        <div className="relative w-full h-48 bg-gradient-to-b from-red-50/50 to-red-50 border-t border-red-100 mt-4">
             <div className="absolute left-4 -top-3 px-2 py-0.5 bg-red-50 border border-red-100 rounded text-[10px] font-bold text-red-400 uppercase tracking-wider shadow-sm">
                Critical Events
             </div>
             {events.map((evt, i) => {
                 const x = scale(new Date(evt.t));
                 return (
                     <div key={i} 
                        className="absolute top-8 flex flex-col items-center group"
                        style={{ left: x, transform: 'translateX(-50%)' }}
                    >
                        {/* Event Node */}
                        <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-200 flex items-center justify-center text-white text-[10px] font-bold z-20 relative ring-4 ring-white">
                            !
                        </div>
                        
                        {/* Dashed connector up */}
                        <div className="absolute -top-8 h-8 w-px border-l border-dashed border-red-300"></div>

                        <div className="mt-3 bg-white p-3 rounded-lg border border-red-100 shadow-md text-center w-56 relative hover:scale-105 transition-transform z-20">
                            <div className="text-xs font-bold text-red-700 mb-1">{evt.event}</div>
                            <div className="text-[10px] text-slate-500 leading-relaxed">{evt.note}</div>
                             {/* Arrow */}
                             <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-red-100 rotate-45"></div>
                        </div>
                     </div>
                 )
             })}
        </div>
    )
}