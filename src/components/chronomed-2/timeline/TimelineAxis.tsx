import React from 'react';
import * as d3 from 'd3';
import { Encounter } from '../types';

interface TimelineAxisProps {
  encounters: Encounter[];
  scale: d3.ScaleTime<number, number>;
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({ encounters, scale }) => {
  // Sort to match scale
  const sortedEncounters = [...encounters].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative w-full h-8">
       {/* We render specific dates for encounters, not generic ticks */}
      {sortedEncounters.map((enc, i) => {
          const date = new Date(enc.date);
          const x = scale(date);
          
          // Always show Month + Day + Year (e.g., "Aug 10, 2015")
          const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div 
                key={i} 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pt-1"
                style={{ left: x }}
            >
                <div className="text-[9px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm z-10 whitespace-nowrap">
                    {label}
                </div>
                {/* Connector to the grid line below */}
                <div className="w-px h-2 bg-gray-300 mt-0.5"></div>
            </div>
          );
      })}
    </div>
  );
};
