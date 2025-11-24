import React from 'react';
import * as d3 from 'd3';
import { Encounter } from '../types';

interface TimelineAxisProps {
  encounters: Encounter[];
  scale: d3.ScaleTime<number, number>;
  additionalDates?: Date[];
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({ encounters, scale, additionalDates = [] }) => {
  // Combine and sort all dates
  const allDates = [
      ...encounters.map(e => ({ date: new Date(e.date), type: 'encounter' })),
      ...additionalDates.map(d => ({ date: d, type: 'additional' }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="relative w-full h-8">
       {/* We render specific dates for encounters and additional points */}
      {allDates.map((item, i) => {
          const x = scale(item.date);
          
          // Always show Month + Day + Year (e.g., "Aug 10, 2015")
          const label = item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div 
                key={i} 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pt-1"
                style={{ left: x }}
            >
                <div className={`text-[9px] font-bold ${item.type === 'additional' ? 'text-blue-600 border-blue-100' : 'text-slate-600 border-gray-100'} bg-white px-1.5 py-0.5 rounded-full border shadow-sm z-10 whitespace-nowrap`}>
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
