import React from 'react';
import * as d3 from 'd3';
import { Encounter } from '../types';

interface MasterGridProps {
    encounters: Encounter[];
    scale: d3.ScaleTime<number, number>;
    height: number | string;
    additionalDates?: Date[];
}

export const MasterGrid: React.FC<MasterGridProps> = ({ encounters, scale, height, additionalDates = [] }) => {
    // Combine all dates
    const allDates = [
        ...encounters.map(e => new Date(e.date)),
        ...additionalDates
    ];

    return (
        <div className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ height }}>
            <svg width="100%" height="100%">
                {allDates.map((date, i) => {
                    const x = scale(date);
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
