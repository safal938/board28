import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { Medication } from '../types';
import { Handle, Position } from 'reactflow';
import { AlertCircle } from 'lucide-react';

interface MedicationTrackProps {
  medications: Medication[];
  scale: d3.ScaleTime<number, number>;
  showHandles?: boolean;
  onHandleHover?: (handleId: string | null) => void;
  displayedHandle?: string | null;
}

export const MedicationTrack: React.FC<MedicationTrackProps> = ({ medications, scale, showHandles = false, onHandleHover, displayedHandle }) => {
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
    <div className="relative w-full py-1  border-t border-gray-100 bg-slate-50/30 z-10">
       <div className="absolute left-4 -top-2.5 px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[9px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">
            Medications
       </div>
       
       <div className="mt-1.5 flex flex-col gap-0.5">
        {groupKeys.map((medName, groupIdx) => {
            const groupMeds = groupedMedications[medName];
            
            // Color Palette
            const colors = [
                { bar: "bg-emerald-100 border-emerald-300 text-emerald-800", dot: "bg-emerald-500" },
                { bar: "bg-blue-100 border-blue-300 text-blue-800", dot: "bg-blue-500" },
                { bar: "bg-purple-100 border-purple-300 text-purple-800", dot: "bg-purple-500" },
                { bar: "bg-amber-100 border-amber-300 text-amber-800", dot: "bg-amber-500" },
                { bar: "bg-rose-100 border-rose-300 text-rose-800", dot: "bg-rose-500" },
                { bar: "bg-indigo-100 border-indigo-300 text-indigo-800", dot: "bg-indigo-500" },
                { bar: "bg-cyan-100 border-cyan-300 text-cyan-800", dot: "bg-cyan-500" },
                { bar: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800", dot: "bg-fuchsia-500" },
                { bar: "bg-lime-100 border-lime-300 text-lime-800", dot: "bg-lime-500" },
                { bar: "bg-sky-100 border-sky-300 text-sky-800", dot: "bg-sky-500" },
            ];

            const colorIndex = groupIdx % colors.length;
            const { bar: barClass, dot: dotClass } = colors[colorIndex];

            // Find the earliest start position for the handle
            const minStart = Math.min(...groupMeds.map(m => scale(new Date(m.startDate))));
            
            // Check if this group's handles should be visible
            const groupTargetHandleId = `med-group-${medName.replace(/\s+/g, '-').toLowerCase()}-target`;
            const groupSourceHandleId = `med-group-${medName.replace(/\s+/g, '-').toLowerCase()}-source`;
            const isGroupHandleVisible = displayedHandle && (
                displayedHandle === groupTargetHandleId || 
                displayedHandle === groupSourceHandleId
            );

            // Check if this group is part of a story
            const storyHandles = (window as any).storyHandles || [];
            const isStoryMed = storyHandles.includes(groupTargetHandleId) || storyHandles.includes(groupSourceHandleId);

            return (
                <div key={groupIdx} className="relative h-5 w-full group">
                    {/* React Flow Handles - Always rendered but conditionally visible */}
                    {showHandles && (
                        <>
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={groupTargetHandleId}
                                style={{
                                    left: minStart - 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 12,
                                    height: 12,
                                    background: isGroupHandleVisible ? '#10b981' : 'transparent',
                                    border: isGroupHandleVisible ? '2px solid white' : 'none',
                                    borderRadius: '50%',
                                    boxShadow: isGroupHandleVisible ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                                    opacity: isGroupHandleVisible ? 1 : 0,
                                    pointerEvents: isGroupHandleVisible ? 'auto' : 'none',
                                    zIndex: 50
                                }}
                                onMouseEnter={() => onHandleHover?.(groupTargetHandleId)}
                                onMouseLeave={() => onHandleHover?.(null)}
                            />
                            <Handle
                                type="source"
                                position={Position.Left}
                                id={groupSourceHandleId}
                                style={{
                                    left: minStart - 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 12,
                                    height: 12,
                                    background: 'transparent',
                                    border: 'none',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    zIndex: 51
                                }}
                                onMouseEnter={() => onHandleHover?.(groupSourceHandleId)}
                                onMouseLeave={() => onHandleHover?.(null)}
                            />
                        </>
                    )}

                    {groupMeds.map((med, idx) => {
                        const start = scale(new Date(med.startDate));
                        const endDate = med.endDate ? new Date(med.endDate) : new Date(); 
                        const end = scale(endDate);
                        const width = Math.max(end - start, 10); 

                        // Create unique IDs for individual medication handles
                        const safeName = med.name.replace(/\s+/g, '-').toLowerCase();
                        const safeDose = med.dose ? med.dose.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'no-dose';
                        // Include idx to ensure uniqueness if multiple same-dose meds exist
                        const handleIdBase = `med-${safeName}-${safeDose}-${idx}`;
                        
                        // Check if this individual medication is part of the ACTIVE scenario
                        const activeScenarioHandles = (window as any).activeScenarioHandles || [];
                        const isIndividualStoryMed = activeScenarioHandles.includes(`${handleIdBase}-target`) || 
                                                     activeScenarioHandles.includes(`${handleIdBase}-source`) ||
                                                     activeScenarioHandles.includes(groupTargetHandleId) ||
                                                     activeScenarioHandles.includes(groupSourceHandleId);
                        
                        // Check if this individual handle should be visible
                        const isIndividualHandleVisible = displayedHandle && (
                            displayedHandle === `${handleIdBase}-target` || 
                            displayedHandle === `${handleIdBase}-source`
                        );

                        return (
                            <React.Fragment key={idx}>
                                {showHandles && (
                                    <>
                                        <Handle
                                            type="target"
                                            position={Position.Left}
                                            id={`${handleIdBase}-target`}
                                            style={{
                                                left: start - 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 12,
                                                height: 12,
                                                background: isIndividualHandleVisible ? '#10b981' : 'transparent',
                                                border: isIndividualHandleVisible ? '2px solid white' : 'none',
                                                borderRadius: '50%',
                                                boxShadow: isIndividualHandleVisible ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                                                opacity: isIndividualHandleVisible ? 1 : 0,
                                                pointerEvents: isIndividualHandleVisible ? 'auto' : 'none',
                                                zIndex: 55
                                            }}
                                            onMouseEnter={() => onHandleHover?.(`${handleIdBase}-target`)}
                                            onMouseLeave={() => onHandleHover?.(null)}
                                        />
                                        <Handle
                                            type="source"
                                            position={Position.Left}
                                            id={`${handleIdBase}-source`}
                                            style={{
                                                left: start - 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 12,
                                                height: 12,
                                                background: 'transparent',
                                                border: 'none',
                                                opacity: 0,
                                                pointerEvents: 'none',
                                                zIndex: 56
                                            }}
                                            onMouseEnter={() => onHandleHover?.(`${handleIdBase}-source`)}
                                            onMouseLeave={() => onHandleHover?.(null)}
                                        />
                                    </>
                                )}
                                <div 
                                    className={`absolute top-0.5 h-4 rounded-sm border shadow-sm flex items-center px-2.5 overflow-hidden whitespace-nowrap transition-all hover:shadow-md hover:z-20 ${barClass}`}
                                    style={{ 
                                        left: start, 
                                        width: width,
                                        opacity: displayedHandle && !isIndividualStoryMed ? 0.05 : 1,
                                        transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                                        boxShadow: isIndividualStoryMed ? '0 0 0 4px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)' : undefined
                                    }}
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
