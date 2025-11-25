import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Handle, Position } from 'reactflow';
import { RiskPoint } from '../types';
import { AlertCircle } from 'lucide-react';

interface RiskTrackProps {
    data: RiskPoint[];
    scale: d3.ScaleTime<number, number>;
    showHandles?: boolean;
    onHandleHover?: (handleId: string | null) => void;
    displayedHandle?: string | null;
}

export const RiskTrack: React.FC<RiskTrackProps> = ({ data, scale, showHandles = false, onHandleHover, displayedHandle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const height = 160;
    const margin = { top: 20, bottom: 20, left: 40 };

    // Sort data chronologically
    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime());
    }, [data]);

    if (sortedData.length === 0) return null;

    // Y Scale for Risk (0 - 10)
    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([height - margin.bottom, margin.top]);

    // Area Generator
    const areaGenerator = d3.area<RiskPoint>()
        .x(d => scale(new Date(d.t)))
        .y0(height - margin.bottom)
        .y1(d => yScale(d.riskScore))
        .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3.line<RiskPoint>()
        .x(d => scale(new Date(d.t)))
        .y(d => yScale(d.riskScore))
        .curve(d3.curveMonotoneX);

    const areaPath = areaGenerator(sortedData) || "";
    const linePath = lineGenerator(sortedData) || "";

    // Check if ANY risk point in this track is part of the active scenario
    const activeScenarioHandles = (window as any).activeScenarioHandles || [];
    const isTrackInActiveScenario = sortedData.some((point, i) => {
        const targetHandleId = `risk-point-${i}-target`;
        const sourceHandleId = `risk-point-${i}-source`;
        return activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId);
    });
    
    // Determine opacity for entire track
    const trackOpacity = displayedHandle && !isTrackInActiveScenario ? 0.05 : 1;

    return (
        <div 
            className="relative w-full border-t border-gray-200 bg-white mt-2 pt-4 pb-2"
            style={{
                opacity: trackOpacity,
                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isTrackInActiveScenario ? '0 0 0 4px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)' : undefined,
                borderRadius: isTrackInActiveScenario ? '8px' : undefined
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Handles for React Flow - Always rendered but conditionally visible */}
            {showHandles && sortedData.map((point, i) => {
                const targetHandleId = `risk-point-${i}-target`;
                const sourceHandleId = `risk-point-${i}-source`;
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
                                left: scale(new Date(point.t)),
                                top: yScale(point.riskScore),
                                transform: 'translate(-50%, -50%)',
                                width: 10,
                                height: 10,
                                background: isHandleVisible ? '#ef4444' : 'transparent',
                                border: isHandleVisible ? '2px solid white' : 'none',
                                borderRadius: '50%',
                                boxShadow: isHandleVisible ? '0 2px 8px rgba(239, 68, 68, 0.4)' : 'none',
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
                                left: scale(new Date(point.t)),
                                top: yScale(point.riskScore),
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

            {/* Header */}
            <div className="absolute left-4 top-1 z-10">
                 <div className="px-2 py-0.5 bg-white  border border-slate-200 text-black rounded text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Acute Liver Injury Risk
                 </div>
            </div>

            <div style={{ height }} className="w-full relative">
                <svg width="100%" height={height} className="overflow-visible">
                    <defs>
                        <linearGradient id="riskGradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="#eab308" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="riskLineGradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        {/* Blue glow filter for active scenario points */}
                        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="0" result="offsetblur" />
                            <feFlood floodColor="rgba(59, 130, 246, 0.6)" />
                            <feComposite in2="offsetblur" operator="in" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 2.5, 5, 7.5, 10].map(tick => (
                        <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                             <line x1={margin.left} x2="100%" stroke="#f1f5f9" strokeWidth={1} />
                             <text x={margin.left - 6} y={3} textAnchor="end" className="text-[8px] fill-slate-400 font-mono">{tick}</text>
                        </g>
                    ))}

                    {/* Chart Area */}
                    <path d={areaPath} fill="url(#riskGradient)" />
                    <path d={linePath} fill="none" stroke="url(#riskLineGradient)" strokeWidth={2.5} strokeLinecap="round" />

                    {/* Data Points & Tooltips */}
                    {sortedData.map((point, i) => {
                        const x = scale(new Date(point.t));
                        const y = yScale(point.riskScore);
                        let color = "#22c55e";
                        if (point.riskScore > 4) color = "#eab308";
                        if (point.riskScore > 7) color = "#ef4444";
                        
                        // Check if this is the 0.8 risk score point (July 15, 2024)
                        const isJuly15Point = point.riskScore === 0.8 && new Date(point.t).toDateString() === new Date('2024-07-15T14:00:00').toDateString();
                        
                        // Check if this is the 9.5 risk score point (Aug 12, 2024)
                        const isRisk95Point = point.riskScore === 9.5 && new Date(point.t).toDateString() === new Date('2024-08-12T09:30:00').toDateString();
                        
                        // Check if this point is part of the ACTIVE scenario
                        const targetHandleId = `risk-point-${i}-target`;
                        const activeScenarioHandles = (window as any).activeScenarioHandles || [];
                        const isInActiveScenario = activeScenarioHandles.includes(targetHandleId);

                        return (
                            <g key={i} transform={`translate(${x}, ${y})`} className="group cursor-pointer">
                                {/* Hit area */}
                                <circle r={8} fill="transparent" />
                                
                                {/* Blue glow ring when in active scenario */}
                                {isInActiveScenario && (
                                    <>
                                        <circle 
                                            r={12} 
                                            fill="none" 
                                            stroke="rgba(59, 130, 246, 0.5)" 
                                            strokeWidth={3}
                                        />
                                        <circle 
                                            r={16} 
                                            fill="none" 
                                            stroke="rgba(59, 130, 246, 0.2)" 
                                            strokeWidth={2}
                                        />
                                    </>
                                )}
                                
                                {/* Visual Dot with enhanced glow when in active scenario */}
                                <circle 
                                    r={4} 
                                    fill="white" 
                                    stroke={isInActiveScenario ? '#3b82f6' : color} 
                                    strokeWidth={isInActiveScenario ? 3 : 2} 
                                    className="transition-all group-hover:r-5 group-hover:stroke-width-4"
                                    filter={isInActiveScenario ? 'url(#blueGlow)' : undefined}
                                />
                                
                                {/* Alert Icon for 0.8 risk score */}
                                {isJuly15Point && (
                                    <foreignObject 
                                        x={12} 
                                        y={-12} 
                                        width={24} 
                                        height={24}
                                        style={{ overflow: 'visible' }}
                                        onMouseEnter={() => {
                                            console.log('🔴 Alert icon hovered! Handle:', `risk-point-${i}-target`);
                                            const globalHandler = (window as any).setHoveredHandle;
                                            if (globalHandler) {
                                                console.log('✅ Calling global setHoveredHandle');
                                                globalHandler(`risk-point-${i}-target`);
                                            } else {
                                                console.log('❌ Global setHoveredHandle not found');
                                            }
                                            onHandleHover?.(`risk-point-${i}-target`);
                                        }}
                                        onMouseLeave={() => {
                                            console.log('🔴 Alert icon unhovered');
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
                                )}
                                
                                {/* Alert Icon for 9.5 risk score */}
                                {isRisk95Point && (
                                    <foreignObject 
                                        x={12} 
                                        y={-12} 
                                        width={24} 
                                        height={24}
                                        style={{ overflow: 'visible' }}
                                        onMouseEnter={() => {
                                            console.log('🔴 Risk 9.5 icon hovered! Handle:', `risk-point-${i}-target`);
                                            const globalHandler = (window as any).setHoveredHandle;
                                            if (globalHandler) {
                                                console.log('✅ Calling global setHoveredHandle');
                                                globalHandler(`risk-point-${i}-target`);
                                            } else {
                                                console.log('❌ Global setHoveredHandle not found');
                                            }
                                            onHandleHover?.(`risk-point-${i}-target`);
                                        }}
                                        onMouseLeave={() => {
                                            console.log('🔴 Risk 9.5 icon unhovered');
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
                                )}

                                {/* Tooltip - Custom Implementation */}
                                <foreignObject 
                                    x={-100} 
                                    y={-120} 
                                    width={200} 
                                    height={110} 
                                    className={`overflow-visible pointer-events-none transition-opacity duration-200 z-50 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white text-black text-[10px] rounded-lg shadow-xl p-2 w-full border border-slate-300">
                                            <div className="flex justify-between items-center border-b border-slate-300 pb-1 mb-1">
                                                <span className="font-bold text-slate-800">Risk Score: {point.riskScore}</span>
                                                <span className="text-slate-600">{new Date(point.t).toLocaleDateString()}</span>
                                            </div>
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {point.factors.map((f, idx) => (
                                                    <li key={idx} className="text-[9px] leading-tight text-slate-700 truncate">{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Arrow */}
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
