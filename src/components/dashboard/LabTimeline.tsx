import React from "react";
import styled from "styled-components";
import { Activity } from "lucide-react";

const LabTimelineContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: visible;
`;

const LabTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

const LabGraphsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
`;

const LabGraph = styled.div`
  position: relative;
  height: 100px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 12px 12px 50px;
  background: #f9fafb;
  overflow: visible;
`;

const LabGraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LabName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const LabUnit = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const GraphArea = styled.div`
  position: relative;
  height: 60px;
  width: 100%;
  overflow: visible;
`;

const ValueLabel = styled.div<{ x: number; y: number; isAbnormal?: boolean }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  font-size: 10px;
  font-weight: 600;
  color: ${props => props.isAbnormal ? '#dc2626' : '#374151'};
  background: white;
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid ${props => props.isAbnormal ? '#fca5a5' : '#e5e7eb'};
  transform: translate(-50%, -100%);
  white-space: nowrap;
  z-index: 2;
`;

const DateLabel = styled.div<{ x: number }>`
  position: absolute;
  left: ${props => props.x}px;
  bottom: -20px;
  font-size: 9px;
  color: #9ca3af;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const YAxisLabel = styled.div<{ y: number }>`
  position: absolute;
  left: -45px;
  top: ${props => props.y}px;
  font-size: 9px;
  color: #6b7280;
  transform: translateY(-50%);
  text-align: right;
  width: 40px;
`;

const YAxisLine = styled.div<{ y: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${props => props.y}px;
  height: 1px;
  background: #e5e7eb;
  opacity: 0.5;
`;

interface LabValue {
  t: string;
  value: number;
}

interface LabData {
  biomarker: string;
  unit: string;
  values: LabValue[];
}

interface LabTimelineProps {
  labTimeline: LabData[];
  encounters: any[];
}

const LabTimeline: React.FC<LabTimelineProps> = ({ labTimeline, encounters }) => {
  // Get reference ranges for common biomarkers
  const getReferenceRange = (biomarker: string): { min: number; max: number } => {
    const ranges: { [key: string]: { min: number; max: number } } = {
      'WBC': { min: 4.0, max: 11.0 },
      'Hemoglobin': { min: 12.0, max: 17.0 },
      'Platelets': { min: 150, max: 400 },
      'ALT': { min: 0, max: 40 },
      'AST': { min: 0, max: 40 },
      'Alkaline Phosphatase': { min: 30, max: 120 },
      'Total Bilirubin': { min: 0, max: 1.2 },
    };
    return ranges[biomarker] || { min: 0, max: 100 };
  };

  const isAbnormal = (biomarker: string, value: number): boolean => {
    const range = getReferenceRange(biomarker);
    return value < range.min || value > range.max;
  };

  // Calculate time-based positioning to align with encounters
  // This matches the exact positioning from MedicationTimeline2
  const getPositionForDate = (dateString: string): number => {
    const date = new Date(dateString);
    const encounterDates = encounters.map(enc => new Date(enc.date));
    
    const cardWidth = 200;
    const spacing = 220;
    
    // Find the position between encounters
    for (let i = 0; i < encounterDates.length; i++) {
      if (date <= encounterDates[i]) {
        if (i === 0) {
          return cardWidth / 2; // Center of first card (100px)
        } else {
          // Interpolate between encounters
          const prevDate = encounterDates[i - 1];
          const nextDate = encounterDates[i];
          const ratio = (date.getTime() - prevDate.getTime()) / 
                       (nextDate.getTime() - prevDate.getTime());
          const prevPosition = (i - 1) * spacing + (cardWidth / 2);
          const nextPosition = i * spacing + (cardWidth / 2);
          return prevPosition + ratio * (nextPosition - prevPosition);
        }
      }
    }
    
    // If date is after all encounters, position at the last encounter
    return (encounterDates.length - 1) * spacing + (cardWidth / 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: '2-digit'
    });
  };

  const renderLabGraph = (lab: LabData) => {
    if (lab.values.length === 0) return null;

    // Get all values to determine scale
    const allValues = lab.values.map(v => v.value);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Get reference range to ensure it's visible
    const refRange = getReferenceRange(lab.biomarker);
    
    // Calculate scale that includes both data and reference range
    const dataMin = Math.min(minValue, refRange.min);
    const dataMax = Math.max(maxValue, refRange.max);
    const range = dataMax - dataMin || 1;
    const padding = range * 0.1; // 10% padding
    
    const scaleMin = Math.max(0, dataMin - padding);
    const scaleMax = dataMax + padding;
    const scaleRange = scaleMax - scaleMin;

    // Calculate positions for each value
    const graphHeight = 60;
    const usableHeight = 50; // Leave space for labels
    const points = lab.values.map(v => {
      const x = getPositionForDate(v.t);
      const y = graphHeight - 5 - ((v.value - scaleMin) / scaleRange) * usableHeight; // 5px bottom padding
      return { x, y, value: v.value, date: v.t };
    });

    // Create SVG path
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    // Calculate Y positions for reference range lines
    const refMinY = graphHeight - 5 - ((refRange.min - scaleMin) / scaleRange) * usableHeight;
    const refMaxY = graphHeight - 5 - ((refRange.max - scaleMin) / scaleRange) * usableHeight;

    // Calculate Y-axis scale ticks with nice round numbers
    const numTicks = 4;
    
    // Helper function to get nice step size
    const getNiceStepSize = (range: number): number => {
      const roughStep = range / (numTicks - 1);
      
      if (roughStep >= 1000) {
        return Math.ceil(roughStep / 100) * 100;
      } else if (roughStep >= 100) {
        return Math.ceil(roughStep / 50) * 50;
      } else if (roughStep >= 10) {
        return Math.ceil(roughStep / 10) * 10;
      } else if (roughStep >= 1) {
        return Math.ceil(roughStep);
      } else {
        return Math.ceil(roughStep * 10) / 10;
      }
    };
    
    const stepSize = getNiceStepSize(scaleRange);
    const niceMin = Math.floor(scaleMin / stepSize) * stepSize;
    
    const yAxisTicks = Array.from({ length: numTicks }, (_, i) => {
      const value = niceMin + (stepSize * i);
      const y = graphHeight - 5 - ((value - scaleMin) / scaleRange) * usableHeight;
      
      // Format value for display
      let displayValue: string | number = value;
      if (value >= 100) {
        displayValue = Math.round(value);
      } else if (value >= 10) {
        displayValue = Math.round(value * 10) / 10;
      } else {
        displayValue = Math.round(value * 10) / 10;
      }
      
      return { value: displayValue, y };
    });

    return (
      <LabGraph key={lab.biomarker}>
        <LabGraphHeader>
          <LabName>{lab.biomarker}</LabName>
          <LabUnit>
            {lab.unit}
          </LabUnit>
        </LabGraphHeader>
        
        <GraphArea>
          {/* Y-axis grid lines and labels */}
          {yAxisTicks.map((tick, i) => (
            <React.Fragment key={i}>
              <YAxisLine y={tick.y} />
              <YAxisLabel y={tick.y}>{tick.value}</YAxisLabel>
            </React.Fragment>
          ))}

          {/* SVG for line and points */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            {/* Reference range lines (green) */}
            {(() => {
              const showMinLine = refMinY >= 0 && refMinY <= graphHeight;
              const showMaxLine = refMaxY >= 0 && refMaxY <= graphHeight;
              
              return (
                <>
                  {/* Min line */}
                  {showMinLine && (
                    <line
                      x1="0"
                      y1={refMinY}
                      x2="100%"
                      y2={refMinY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                      opacity="0.35"
                    />
                  )}
                  
                  {/* Max line */}
                  {showMaxLine && (
                    <line
                      x1="0"
                      y1={refMaxY}
                      x2="100%"
                      y2={refMaxY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                      opacity="0.35"
                    />
                  )}
                  
                  {/* Single "Normal: X-Y" label */}
                  {(showMinLine || showMaxLine) && (
                    <text
                      x="5"
                      y={showMaxLine ? refMaxY - 3 : refMinY - 3}
                      fontSize="9"
                      fill="#10b981"
                      fontWeight="600"
                    >
                      Normal: {refRange.min}-{refRange.max}
                    </text>
                  )}
                </>
              );
            })()}

            {/* Line connecting points */}
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={isAbnormal(lab.biomarker, p.value) ? '#dc2626' : '#3b82f6'}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Value labels */}
          {points.map((p, i) => (
            <ValueLabel
              key={i}
              x={p.x}
              y={p.y}
              isAbnormal={isAbnormal(lab.biomarker, p.value)}
            >
              {p.value}
            </ValueLabel>
          ))}

          {/* Date labels */}
          {points.map((p, i) => (
            <DateLabel key={i} x={p.x}>
              {formatDate(p.date)}
            </DateLabel>
          ))}
        </GraphArea>
      </LabGraph>
    );
  };

  return (
    <LabTimelineContainer>
      <LabTitle>
        <Activity size={18} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
        Laboratory Results Timeline
      </LabTitle>
      <LabGraphsWrapper>
        {labTimeline.map(lab => renderLabGraph(lab))}
      </LabGraphsWrapper>
    </LabTimelineContainer>
  );
};

export default LabTimeline;
