
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_DATA } from './data';
import { TimelineAxis, EncounterTrack, MedicationTrack, LabTrack, KeyEventsTrack, useTimelineScale, MasterGrid } from './TimelineComponents';
import * as d3 from 'd3';
import { MedicalData } from './types';

export const Dashboard: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  // Initialize with safe default data
  const [timelineProps, setTimelineProps] = useState<MedicalData['props']>(INITIAL_DATA.props);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  // Fetch data on mount
  useEffect(() => {
    fetch('/new_med_timeline.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        // The JSON structure has a 'content' root which contains the MedicalData shape
        if (json.content && json.content.props) {
            setTimelineProps(json.content.props);
        } else {
            console.warn("Unexpected JSON structure:", json);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load timeline data:", err);
        setError("Failed to load patient data.");
        setLoading(false);
      });
  }, []);

  // Configuration for the encounter-based layout
  const SLOT_WIDTH = 280; // Fixed width per encounter
  const PADDING = 160;    // Start/End padding.

  // Calculate responsive width based on number of encounters
  useEffect(() => {
    const updateWidth = () => {
        if (containerRef.current) {
            const calculatedWidth = Math.max(
                containerRef.current.clientWidth, 
                (timelineProps.encounters.length * SLOT_WIDTH) + (PADDING * 2)
            );
            setWidth(calculatedWidth);
        }
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, [timelineProps.encounters.length]);

  // Use the polylinear scale based on encounters
  const scale = useTimelineScale(timelineProps.encounters, width, PADDING);

  if (loading) {
      return (
          <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`} style={style}>
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Loading Patient Timeline...</p>
              </div>
          </div>
      );
  }

  if (error) {
      return (
          <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`} style={style}>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-red-100 max-w-md text-center">
                  <div className="text-red-500 text-xl font-bold mb-2">Error</div>
                  <p className="text-slate-600">{error}</p>
              </div>
          </div>
      );
  }


  return (
    <div className={`flex flex-col bg-gray-100 text-slate-800 font-sans ${className}`} style={style}>
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Timeline Area */}
        <main className="flex-1 bg-slate-50/50 relative" ref={containerRef}>
            <div style={{ width: width, minWidth: '100%' }} className="bg-white min-h-full shadow-sm pb-20 relative">
                <MasterGrid encounters={timelineProps.encounters} scale={scale} height={2000} />
                
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                    <TimelineAxis encounters={timelineProps.encounters} scale={scale} />
                </div>
                
                {/* Increased gap-16 for better vertical spacing between tracks */}
                <div className="relative z-20 pt-4 flex flex-col gap-16">
                    <EncounterTrack encounters={timelineProps.encounters} scale={scale} />
                    <MedicationTrack medications={timelineProps.medicationTimeline} scale={scale} />
                    <LabTrack labs={timelineProps.labTimeline} scale={scale} height={140} />
                    <KeyEventsTrack events={timelineProps.keyEvents} scale={scale} />
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};
