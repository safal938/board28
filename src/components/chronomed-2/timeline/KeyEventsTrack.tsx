import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { Handle, Position } from 'reactflow';
import { KeyEvent } from '../types';
import { AlertCircle } from 'lucide-react';

interface KeyEventsTrackProps {
  events: KeyEvent[];
  scale: d3.ScaleTime<number, number>;
  showHandles?: boolean;
  onHandleHover?: (handleId: string | null) => void;
  displayedHandle?: string | null;
}

export const KeyEventsTrack: React.FC<KeyEventsTrackProps> = ({ events, scale, showHandles = false, onHandleHover, displayedHandle }) => {
    // Group events by Date to prevent vertical stacking of simultaneous events
    const groupedEvents = useMemo(() => {
        const groups: Record<string, KeyEvent[]> = {};
        events.forEach(e => {
            const dateKey = new Date(e.t).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(e);
        });
        
        return Object.values(groups).map(groupEvents => {
            // Sort within group by time if needed
            return {
                date: new Date(groupEvents[0].t),
                events: groupEvents,
                x: scale(new Date(groupEvents[0].t))
            };
        }).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [events, scale]);

    // Layout algorithm to resolve overlaps between GROUPS
    // We place groups in rows. If a group overlaps horizontally with the previous group in Row 0, move to Row 1.
    const CARD_WIDTH = 280;
    const ROW_HEIGHT = 200; // Height allocated per row (card + gap)
    
    const positionedGroups = useMemo(() => {
        const rows: number[] = []; // Stores the right-most X coordinate for each row
        
        return groupedEvents.map(group => {
            const halfWidth = CARD_WIDTH / 2;
            const startX = group.x - halfWidth;
            const endX = group.x + halfWidth;
            
            let rowIndex = 0;
            while (true) {
                // Check if this row is free for this X range
                const lastEndInRow = rows[rowIndex] || -Infinity;
                if (startX >= lastEndInRow + 20) { // 20px gap
                    // Fits here
                    rows[rowIndex] = endX;
                    break;
                }
                rowIndex++;
            }
            
            return { ...group, rowIndex };
        });
    }, [groupedEvents]);

    const maxRow = positionedGroups.length > 0 ? Math.max(...positionedGroups.map(g => g.rowIndex)) : 0;
    // Total height is based on how many rows we actually used.
    const trackHeight = (maxRow + 1) * 240 + 60; 

    if (events.length === 0) return null;

    // Track decorations (background, lines, dots) should fade when in focus mode
    const trackDecorationsOpacity = displayedHandle ? 0.05 : 1;

    return (
        <div 
            className="relative w-full mt-6 border-t border-red-100/50 bg-gradient-to-b from-red-50/30 to-transparent transition-all duration-500" 
            style={{ 
                height: trackHeight
            }}
        >
             {/* Header Label */}
             <div className="absolute left-4 -top-3 px-3 py-1 bg-white border border-red-200 rounded-full shadow-sm flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Critical Events</span>
             </div>
             
             {positionedGroups.map((group, i) => {
                 const topPos = 40 + (group.rowIndex * 200);
                 const targetHandleId = `key-event-${i}-target`;
                 const sourceHandleId = `key-event-${i}-source`;
                 
                 // Check if this event is part of ANY scenario (for showing marker)
                 const storyHandles = (window as any).storyHandles || [];
                 const isStoryEvent = storyHandles.includes(targetHandleId) || storyHandles.includes(sourceHandleId);
                 
                 // Check if this event is part of the ACTIVE scenario (for opacity)
                 const activeScenarioHandles = (window as any).activeScenarioHandles || [];
                 
                 return (
                     <div 
                        key={i}
                        className="absolute flex flex-col items-center"
                        style={{ left: group.x, top: 0, transform: 'translateX(-50%)' }}
                     >
                        {/* Story Point Marker - Alert icon */}
                        {isStoryEvent && (() => {
                            // Check if this marker is part of the active scenario
                            const isInActiveScenario = activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId);
                            const markerOpacity = displayedHandle && !isInActiveScenario ? 0.05 : 1;
                            
                            return (
                                <div
                                    className="absolute z-50"
                                    style={{
                                        left: '-35px',
                                        top: topPos + 10,
                                        opacity: markerOpacity,
                                        transition: 'opacity 0.3s ease'
                                    }}
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
                                </div>
                            );
                        })()}
                        
                        {/* React Flow Handles - Always rendered but conditionally visible */}
                        {showHandles && (() => {
                            const isHandleVisible = displayedHandle && (
                                displayedHandle === targetHandleId || 
                                displayedHandle === sourceHandleId
                            );
                            
                            return (
                                <>
                                    <Handle
                                        type="target"
                                        position={Position.Top}
                                        id={targetHandleId}
                                        style={{
                                            left: '10%',
                                            top: topPos - 4,
                                            transform: 'translateX(-50%)',
                                            width: 10,
                                            height: 10,
                                            background: isHandleVisible ? '#f59e0b' : 'transparent',
                                            border: isHandleVisible ? '2px solid white' : 'none',
                                            borderRadius: '50%',
                                            boxShadow: isHandleVisible ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none',
                                            opacity: isHandleVisible ? 1 : 0,
                                            pointerEvents: isHandleVisible ? 'auto' : 'none',
                                            zIndex: 50
                                        }}
                                    />
                                    <Handle
                                        type="source"
                                        position={Position.Top}
                                        id={sourceHandleId}
                                        style={{
                                            left: '35%',
                                            top: topPos - 4,
                                            transform: 'translateX(-50%)',
                                            width: 10,
                                            height: 10,
                                            background: 'transparent',
                                            border: 'none',
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            zIndex: 51
                                        }}
                                    />
                                </>
                            );
                        })()}

                        {/* Connector Line */}
                        <div 
                            className="absolute top-0 w-px border-l-2 border-dashed border-red-300 transition-opacity duration-300"
                            style={{ 
                                height: topPos + 4,
                                opacity: trackDecorationsOpacity
                            }}
                        ></div>

                        {/* Timeline Dot */}
                        <div 
                            className="absolute top-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-10 transform -translate-y-1/2 transition-opacity duration-300"
                            style={{ opacity: trackDecorationsOpacity }}
                        ></div>
                        
                        {/* Card Container */}
                        <div 
                            className="relative bg-white rounded-lg shadow-md border border-red-100 hover:shadow-xl hover:border-red-300 transition-all duration-300 z-20 overflow-hidden"
                            style={{ 
                                marginTop: topPos, 
                                width: CARD_WIDTH,
                                opacity: displayedHandle && !(activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId)) ? 0.05 : 1,
                                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: isStoryEvent && (activeScenarioHandles.includes(targetHandleId) || activeScenarioHandles.includes(sourceHandleId)) 
                                    ? '0 0 0 4px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)' 
                                    : undefined
                            }}
                        >
                            {/* Header */}
                            <div className="bg-red-50/50 px-3 py-2 border-b border-red-100 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-red-800 uppercase tracking-wide">
                                    {group.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-[10px]">!</span>
                                </div>
                            </div>

                            {/* Events List */}
                            <div className="divide-y divide-gray-100">
                                {group.events.map((evt, idx) => (
                                    <div key={idx} className="p-3 hover:bg-red-50/10 transition-colors">
                                        <h4 className="text-xs font-bold text-gray-900 mb-1 leading-tight">{evt.event}</h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed">{evt.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                 );
             })}
        </div>
    );
}
