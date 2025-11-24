import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { Medication } from '../types';
import { Handle, Position } from 'reactflow';

interface MedicationTrackProps {
  medications: Medication[];
  scale: d3.ScaleTime<number, number>;
  showHandles?: boolean;
}

export const MedicationTrack: React.FC<MedicationTrackProps> = ({ medications, scale, showHandles = false }) => {
  // Group medications by name to display them on the same track/line
  const groupedMedications = useMemo(() => {
    const groups: Record<string, Medication[]> = {};
    medications.forEach(med => {
        if (!groups[med.name]) {
            groups[med.name] = [];
        }
        groups[med.name].push(med);
    });
    return groups;
  }, [medications]);

  const groupKeys = Object.keys(groupedMedications);

  return (
    <div className="relative w-full py-1 border-t border-gray-100 bg-slate-50/30 z-10">
       <div className="absolute left-4 -top-2.5 px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[9px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">
            Medications
       </div>
       
       <div className="mt-1.5 flex flex-col gap-0.5">
        {groupKeys.map((medName, groupIdx) => {
            const groupMeds = groupedMedications[medName];
            
            let barClass = "bg-emerald-100 border-emerald-300 text-emerald-800";
            let dotClass = "bg-emerald-500";
            const nameLower = medName.toLowerCase();
            
            if (nameLower.includes("methotrexate")) {
                barClass = "bg-purple-100 border-purple-300 text-purple-900";
                dotClass = "bg-purple-500";
            } else if (nameLower.includes("lisinopril")) {
                barClass = "bg-orange-100 border-orange-300 text-orange-900";
                dotClass = "bg-orange-500";
            } else if (nameLower.includes("trimethoprim")) {
                barClass = "bg-red-100 border-red-300 text-red-900";
                dotClass = "bg-red-500";
            }

            // Find the earliest start position for the handle
            const minStart = Math.min(...groupMeds.map(m => scale(new Date(m.startDate))));

            return (
                <div key={groupIdx} className="relative h-5 w-full group">
                    {/* React Flow Handle for the row */}
                    {showHandles && (
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={`med-group-${medName.replace(/\s+/g, '-').toLowerCase()}`}
                            style={{
                                left: minStart - 6, // Position just before the bar
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 8,
                                height: 8,
                                background: '#10b981', // emerald-500
                                border: 'none',
                                zIndex: 50
                            }}
                        />
                    )}

                    {groupMeds.map((med, idx) => {
                        const start = scale(new Date(med.startDate));
                        const endDate = med.endDate ? new Date(med.endDate) : new Date(); 
                        const end = scale(endDate);
                        const width = Math.max(end - start, 10); 

                        return (
                            <React.Fragment key={idx}>
                                <div 
                                    className={`absolute top-0.5 h-4 rounded-sm border shadow-sm flex items-center px-1.5 overflow-hidden whitespace-nowrap transition-all hover:shadow-md hover:z-20 ${barClass}`}
                                    style={{ left: start, width: width }}
                                >
                                     <div className={`w-1 h-1 rounded-full mr-1.5 ${dotClass} shrink-0`}></div>
                                     <span className="text-[9px] font-bold mr-2">{med.name}</span>
                                     <span className="text-[8px] opacity-75 border-l border-current pl-2">{med.dose}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            );
        })}
       </div>
    </div>
  );
};
