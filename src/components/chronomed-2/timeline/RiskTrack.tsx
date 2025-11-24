import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Handle, Position } from 'reactflow';
import { RiskPoint } from '../types';

interface RiskTrackProps {
    data: RiskPoint[];
    scale: d3.ScaleTime<number, number>;
    showHandles?: boolean;
}

export const RiskTrack: React.FC<RiskTrackProps> = ({ data, scale, showHandles = false }) => {
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

    return (
        <div 
            className="relative w-full border-t border-gray-200 bg-white mt-2 pt-4 pb-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Handles for React Flow - Overlaid at same position */}
            {showHandles && sortedData.map((point, i) => (
                <React.Fragment key={i}>
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={`risk-point-${i}-target`}
                        style={{
                            left: scale(new Date(point.t)),
                            top: yScale(point.riskScore),
                            transform: 'translate(-50%, -50%)',
                            width: 10,
                            height: 10,
                            background: '#ef4444',
                            border: '2px solid white',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                            zIndex: 50
                        }}
                    />
                    <Handle
                        type="source"
                        position={Position.Left}
                        id={`risk-point-${i}-source`}
                        style={{
                            left: scale(new Date(point.t)),
                            top: yScale(point.riskScore),
                            transform: 'translate(-50%, -50%)',
                            width: 10,
                            height: 10,
                            background: 'transparent',
                            border: 'none',
                            zIndex: 51
                        }}
                    />
                </React.Fragment>
            ))}

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

                        return (
                            <g key={i} transform={`translate(${x}, ${y})`} className="group cursor-pointer">
                                {/* Hit area */}
                                <circle r={8} fill="transparent" />
                                
                                {/* Visual Dot */}
                                <circle r={4} fill="white" stroke={color} strokeWidth={2} className="transition-all group-hover:r-5 group-hover:stroke-width-4" />

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
