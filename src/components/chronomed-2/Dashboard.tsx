import React, { useState, useRef, useEffect } from 'react';
import  INITIAL_DATA  from '../../data/new_medtimeline_updated.json';
import { TimelineAxis, EncounterTrack, MedicationTrack, LabTrack, KeyEventsTrack, RiskTrack, useTimelineScale, MasterGrid } from './timeline';
import { Sidebar } from './Sidebar';
import { MedicalData, PatientData } from './types';

export const Dashboard: React.FC = () => {
  // Use imported data directly - no need to fetch
  const [timelineProps] = useState<MedicalData['props']>(INITIAL_DATA.content.props);
  const [patientData] = useState<PatientData | undefined>(INITIAL_DATA.content.patientData);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Define past medications to inject
  const pastMeds = [
    {
        "name": "Ramipril",
        "startDate": "2020-01-01",
        "dose": "5mg OD",
        "endDate": "2025-02-15",
        "indication": "Hypertension"
    },
    {
        "name": "Metformin",
        "startDate": "2019-01-01",
        "dose": "1000mg BD",
        "endDate": "2025-02-15",
        "indication": "T2DM"
    }
  ];

  // Merge past meds into the medication timeline
  const allMedications = [...pastMeds, ...timelineProps.medicationTimeline];
  
  // Extract dates for the scale
  const pastMedDates = pastMeds.map(m => new Date(m.startDate));

  // Configuration for the encounter-based layout
  const SLOT_WIDTH = 300; // Fixed width per encounter - reduced by 20%
  const PADDING = 20;    // Start/End padding - reduced to move start dates left

  // Debug: Log the imported data to verify chief_complaint is present
  useEffect(() => {
    console.log('Loaded encounters:', timelineProps.encounters.map(e => ({
      no: e.encounter_no,
      has_chief_complaint: !!e.chief_complaint,
      chief_complaint: e.chief_complaint
    })));
  }, [timelineProps]);

  // Use the polylinear scale based on encounters + past med dates
  // The hook now returns the calculated width based on variable spacing
  const { scale, width } = useTimelineScale(timelineProps.encounters, 20, 160, pastMedDates);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Loading Patient Timeline...</p>
              </div>
          </div>
      );
  }

  if (error) {
      return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-red-100 max-w-md text-center">
                  <div className="text-red-500 text-xl font-bold mb-2">Error</div>
                  <p className="text-slate-600">{error}</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex bg-gray-100 text-slate-800 font-sans min-h-full" style={{ width: width + 300 }}>
      {/* Left Sidebar */}
      {patientData && <Sidebar patientData={patientData} />}

      {/* Main Content */}
      <div className="flex flex-col min-h-full" style={{ width: width }}>
        
        {/* Simple Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 z-20" style={{ width: width }}>
            <div className="flex items-center gap-2">
                <span className="text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                <h1 className="font-bold text-slate-800 text-lg tracking-tight">Master Timeline</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>View Range: Aug 2015 - Jul 2025</span>
              
            </div>
        </header>

        {/* Timeline Area */}
        <main className="bg-slate-50/50 relative" ref={containerRef} style={{ width: width }}>
            <div style={{ width: width }} className="bg-white shadow-sm relative">
                <MasterGrid encounters={timelineProps.encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
                
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                    <TimelineAxis encounters={timelineProps.encounters} scale={scale} additionalDates={pastMedDates} />
                </div>
                
                {/* Reduced gap for compact view */}
                <div className="relative z-20 pt-2 flex flex-col gap-1">
                    <EncounterTrack encounters={timelineProps.encounters} scale={scale} />
                    <MedicationTrack medications={allMedications} scale={scale} />
                    <LabTrack labs={timelineProps.labTimeline} scale={scale} />
                    {/* Risk Track Component */}
                    {timelineProps.riskTimeline && timelineProps.riskTimeline.length > 0 && (
                         <RiskTrack data={timelineProps.riskTimeline} scale={scale} />
                    )}
                    <KeyEventsTrack events={timelineProps.keyEvents} scale={scale} />
                </div>
            </div>
        </main>
      </div>
      
    </div>
  );
};
