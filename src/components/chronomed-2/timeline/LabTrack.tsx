import React, { useState } from 'react';
import * as d3 from 'd3';
import { LabMetric } from '../types';
import { Handle, Position } from 'reactflow';
import { AlertCircle } from 'lucide-react';

interface SingleLabChartProps {
    metric: LabMetric;
    scale: d3.ScaleTime<number, number>;
    height: number;
    index: number;
    showHandles?: boolean;
    onHandleHover?: (handleId: string | null) => void;
    displayedHandle?: string | null;
}

const SingleLabChart: React.FC<SingleLabChartProps> = ({ metric, scale, height, index, showHandles, onHandleHover, displayedHandle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const CHART_MARGIN = { top: 24, bottom: 20, left: 48, right: 24 };
    const values = metric.values;
    
    if (values.length === 0) return null;

    const hasRefRange = !!metric.referenceRange;
    const refMin = metric.referenceRange?.min ?? 0;
    const refMax = metric.referenceRange?.max ?? 100;

    // Calculate Domain
    const valExtent = d3.extent(values, d => d.value) as [number, number];
    let [minData, maxData] = valExtent;
    if (minData === undefined) minData = 0;
    if (maxData === undefined) maxData = 100;

    let yMin = minData;
    let yMax = maxData;

    if (hasRefRange) {
        yMin = Math.min(minData, refMin);
        yMax = Math.max(maxData, refMax);
    }

    const rangeSpan = yMax - yMin;
    const buffer = rangeSpan === 0 ? (yMax || 1) * 0.2 : rangeSpan * 0.2;
    
    let domainMin = yMin - buffer;
    let domainMax = yMax + buffer;

    if (minData >= 0 && refMin >= 0) {
        domainMin = Math.max(0, domainMin);
    }

    const yScale = d3.scaleLinear()
        .domain([domainMin, domainMax])
        .range([height - CHART_MARGIN.bottom, CHART_MARGIN.top]);

    // Generators - Use step curve to show constant values until next measurement
    const line = d3.line<{t: string, value: number}>()
        .x(d => scale(new Date(d.t)))
        .y(d => yScale(d.value))
        .curve(d3.curveStepAfter);

    const area = d3.area<{t: string, value: number}>()
        .x(d => scale(new Date(d.t)))
        .y0(height - CHART_MARGIN.bottom)
        .y1(d => yScale(d.value))
        .curve(d3.curveStepAfter);

    const pathD = line(values) || "";
    const areaD = area(values) || "";

    // Gradient Logic - Use pixel offsets to be precise with userSpaceOnUse
    const yRefMin = hasRefRange ? yScale(refMin) : height;
    const yRefMax = hasRefRange ? yScale(refMax) : 0;
    
    // Calculate normalized offsets [0, 1] for the gradient
    const offMax = Math.max(0, Math.min(1, yRefMax / height));
    const offMin = Math.max(0, Math.min(1, yRefMin / height));

    const gradientId = `line-gradient-${index}`;
    const areaGradientId = `area-gradient-${index}`;

    const lastVal = values[values.length - 1];
    const isLastAbnormal = hasRefRange && (lastVal.value > refMax || lastVal.value < refMin);
    
    // Check if ANY point in this lab chart is part of the ACTIVE scenario
    const activeScenarioHandles = (window as any).activeScenarioHandles || [];
    const isLabChartInActiveScenario = values.some((v, i) => {
        const targetHandleId = `lab-${index}-point-${i}-target`;
        const sourceHandleId = `lab-${index}-point-${i}-source`;
        return activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId);
    });
    
    // Determine opacity for the entire chart - dim if not in active scenario
    const chartOpacity = displayedHandle && !isLabChartInActiveScenario ? 0.05 : 1;

    return (
        <div 
            className="relative w-full bg-white border-y border-slate-100 group"
            style={{ 
                opacity: chartOpacity,
                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isLabChartInActiveScenario ? '0 0 0 4px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)' : undefined,
                borderRadius: isLabChartInActiveScenario ? '8px' : undefined
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="absolute top-2 left-0 w-full px-12 flex justify-between items-center z-20 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-[1px] px-2 py-1 rounded border border-slate-100 shadow-sm flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-800">{metric.biomarker}</span>
                    <span className="text-[10px] font-medium text-slate-500">
                        {metric.unit}
                        {hasRefRange && (
                            <span className="text-slate-400 ml-1 font-normal">
                                (Normal: {metric.referenceRange!.min}-{metric.referenceRange!.max})
                            </span>
                        )}
                    </span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-[1px] px-2 py-1 rounded border border-slate-100 shadow-sm">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider mr-2">Current</span>
                    <span className={`text-sm font-mono font-bold ${isLastAbnormal ? 'text-red-600' : 'text-slate-700'}`}>
                        {lastVal.value}
                    </span>
                    </div>
            </div>
            
            <div style={{ height }} className="w-full relative">
                <svg width="100%" height={height} className="overflow-visible absolute left-0 top-0">
                    <defs>
                         {/* Line Gradient - Defined in User Space (Pixels) to align exactly with lines */}
                         {/* Logic: 0 (Top) -> yRefMax (Red), yRefMax -> yRefMin (Blue), yRefMin -> Height (Red) */}
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                            {hasRefRange ? (
                                <>
                                    <stop offset={0} stopColor="#EF4444" />
                                    <stop offset={offMax} stopColor="#EF4444" />
                                    <stop offset={offMax} stopColor="#10B981" />
                                    <stop offset={offMin} stopColor="#10B981" />
                                    <stop offset={offMin} stopColor="#EF4444" />
                                    <stop offset={1} stopColor="#EF4444" />
                                </>
                            ) : (
                                <>
                                    <stop offset={0} stopColor="#10B981" />
                                    <stop offset={1} stopColor="#10B981" />
                                </>
                            )}
                        </linearGradient>
                        
                         {/* Area Gradient */}
                         <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                             {hasRefRange ? (
                                <>
                                    {/* High Values (Above Max) - Red */}
                                    <stop offset={0} stopColor="#EF4444" stopOpacity="0.15"/>
                                    <stop offset={offMax} stopColor="#EF4444" stopOpacity="0.15"/>
                                    
                                    {/* Normal Range - Green */}
                                    <stop offset={offMax} stopColor="#10B981" stopOpacity="0.05"/>
                                    <stop offset={1} stopColor="#10B981" stopOpacity="0.05"/>
                                </>
                             ) : (
                                <stop offset={0} stopColor="#10B981" stopOpacity="0.1" />
                             )}
                        </linearGradient>

                        <clipPath id={`clip-${index}`}>
                                <rect x={CHART_MARGIN.left} y={0} width="100%" height={height} />
                        </clipPath>
                    </defs>

                    {/* Grid & Lines */}
                    {yScale.ticks(5).map((tick, i) => (
                        <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                            <line x1={CHART_MARGIN.left} x2="100%" stroke="#F1F5F9" strokeWidth={1} />
                            <text x={CHART_MARGIN.left - 8} y={3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">{tick}</text>
                        </g>
                    ))}

                    {/* Limit Lines */}
                    {hasRefRange && (
                        <>
                            <line x1={CHART_MARGIN.left} x2="100%" y1={yRefMax} y2={yRefMax} stroke="#EF4444" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
                            <line x1={CHART_MARGIN.left} x2="100%" y1={yRefMin} y2={yRefMin} stroke="#10B981" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
                        </>
                    )}

                    {/* Data */}
                    <g clipPath={`url(#clip-${index})`}>
                        <path d={areaD} fill={`url(#${areaGradientId})`} className="transition-all duration-500" />
                        <path d={pathD} fill="none" stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />
                    </g>

                    {/* Data Points and Tooltips */}
                    {values.map((v, i) => {
                        const isAbnormal = hasRefRange && (v.value > refMax || v.value < refMin);
                        const pointColor = isAbnormal ? "#EF4444" : "#10B981";
                        
                        // Check if this point is part of a story
                        const targetHandleId = `lab-${index}-point-${i}-target`;
                        const sourceHandleId = `lab-${index}-point-${i}-source`;
                        const storyHandles = (window as any).storyHandles || [];
                        const isStoryPoint = storyHandles.includes(targetHandleId) || storyHandles.includes(sourceHandleId);
                        
                        // Always render the circle (opacity is handled by parent container)
                        return (
                            <g key={i} transform={`translate(${scale(new Date(v.t))}, ${yScale(v.value)})`}>
                                <circle 
                                    r={isHovered ? 5 : 3}
                                    fill="white" 
                                    stroke={pointColor} 
                                    strokeWidth={2} 
                                    className="transition-all duration-200"
                                />
                                {isHovered && (
                                    <g transform="translate(0, -12)" className="pointer-events-none animate-fade-in-up"> 
                                        <rect x="-20" y="-24" width="40" height="20" rx="4" fill="#1E293B" className="shadow-lg" />
                                        <text y="-10" textAnchor="middle" className="text-[10px] fill-white font-bold font-mono">
                                            {v.value}
                                        </text>
                                        <path d="M-4 -4 L4 -4 L0 0 Z" fill="#1E293B" />
                                    </g>
                                )}
                            </g>
                        );
                    })}
                    
                    {/* Story Point Markers - Alert icons */}
                    {values.map((v, i) => {
                        const targetHandleId = `lab-${index}-point-${i}-target`;
                        const sourceHandleId = `lab-${index}-point-${i}-source`;
                        const storyHandles = (window as any).storyHandles || [];
                        const isStoryPoint = storyHandles.includes(targetHandleId) || storyHandles.includes(sourceHandleId);
                        
                        if (!isStoryPoint) return null;
                        
                        // Check if this marker is part of the active scenario
                        const activeScenarioHandles = (window as any).activeScenarioHandles || [];
                        const isInActiveScenario = activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId);
                        const markerOpacity = displayedHandle && !isInActiveScenario ? 0.05 : 1;
                        
                        return (
                            <foreignObject
                                key={`marker-${i}`}
                                x={scale(new Date(v.t)) + 8}
                                y={yScale(v.value) - 12}
                                width={24}
                                height={24}
                                style={{ overflow: 'visible' }}
                                opacity={markerOpacity}
                                onMouseEnter={() => {
                                    const globalHandler = (window as any).setHoveredHandle;
                                    if (globalHandler) {
                                        globalHandler(targetHandleId);
                                    }
                                    onHandleHover?.(targetHandleId);
                                }}
                                onMouseLeave={() => {
                                    const globalHandler = (window as any).setHoveredHandle;
                                    if (globalHandler) {
                                        globalHandler(null);
                                    }
                                    onHandleHover?.(null);
                                }}
                            >
                                <div
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        background: '#ef4444',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                        border: '2px solid white',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.2)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4)';
                                    }}
                                >
                                    <AlertCircle size={14} color="white" strokeWidth={3} />
                                </div>
                            </foreignObject>
                        );
                    })}
                </svg>

                {/* Handles for React Flow - Always rendered but conditionally visible */}
                {showHandles && values.map((v, i) => {
                    const targetHandleId = `lab-${index}-point-${i}-target`;
                    const sourceHandleId = `lab-${index}-point-${i}-source`;
                    const isHandleVisible = displayedHandle && (
                        displayedHandle === targetHandleId || 
                        displayedHandle === sourceHandleId
                    );
                    
                    return (
                        <React.Fragment key={i}>
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={targetHandleId}
                                style={{
                                    left: scale(new Date(v.t)),
                                    top: yScale(v.value),
                                    transform: 'translate(-50%, -50%)',
                                    width: 10,
                                    height: 10,
                                    background: isHandleVisible ? '#0ea5e9' : 'transparent',
                                    border: isHandleVisible ? '2px solid white' : 'none',
                                    borderRadius: '50%',
                                    boxShadow: isHandleVisible ? '0 2px 8px rgba(14, 165, 233, 0.4)' : 'none',
                                    opacity: isHandleVisible ? 1 : 0,
                                    pointerEvents: isHandleVisible ? 'auto' : 'none',
                                    zIndex: 50
                                }}
                                onMouseEnter={() => onHandleHover?.(targetHandleId)}
                                onMouseLeave={() => onHandleHover?.(null)}
                            />
                            <Handle
                                type="source"
                                position={Position.Left}
                                id={sourceHandleId}
                                style={{
                                    left: scale(new Date(v.t)),
                                    top: yScale(v.value),
                                    transform: 'translate(-50%, -50%)',
                                    width: 10,
                                    height: 10,
                                    background: 'transparent',
                                    border: 'none',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    zIndex: 51
                                }}
                                onMouseEnter={() => onHandleHover?.(sourceHandleId)}
                                onMouseLeave={() => onHandleHover?.(null)}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

interface LabTrackProps {
  labs: LabMetric[];
  scale: d3.ScaleTime<number, number>;
  height?: number;
  showHandles?: boolean;
  onHandleHover?: (handleId: string | null) => void;
  displayedHandle?: string | null;
}

export const LabTrack: React.FC<LabTrackProps> = ({ labs, scale, height = 140, showHandles = false, onHandleHover, displayedHandle }) => {
  // Function to calculate abnormality severity for a lab metric
  const getAbnormalitySeverity = (metric: LabMetric): number => {
    if (!metric.referenceRange || metric.values.length === 0) return 0;
    
    const lastValue = metric.values[metric.values.length - 1].value;
    const { min, max } = metric.referenceRange;
    
    // Calculate how far outside the normal range (as percentage)
    if (lastValue > max) {
      return ((lastValue - max) / max) * 100; // Percentage above max
    } else if (lastValue < min) {
      return ((min - lastValue) / min) * 100; // Percentage below min
    }
    
    return 0; // Normal range
  };

  // Sort labs by priority: abnormal first (by severity), then normal
  const sortedLabs = [...labs].sort((a, b) => {
    const severityA = getAbnormalitySeverity(a);
    const severityB = getAbnormalitySeverity(b);
    
    // Sort by severity descending (most abnormal first)
    return severityB - severityA;
  });

  return (
    <div className="w-full border-t border-gray-200 bg-slate-50/50 pt-8 pb-6 relative z-0 flex flex-col gap-3">
         {/* Section Header */}
         <div className="absolute left-4 top-0 -translate-y-1/2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm flex items-center gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Lab Trends</span>
         </div>
         
        {sortedLabs.map((metric, idx) => (
            <SingleLabChart key={idx} metric={metric} scale={scale} height={height} index={idx} showHandles={showHandles} onHandleHover={onHandleHover} displayedHandle={displayedHandle} />
        ))}
    </div>
  );
};
