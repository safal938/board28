import React, { useState } from 'react';
import * as d3 from 'd3';
import { LabMetric } from '../types';
import { Handle, Position } from 'reactflow';

interface IndividualLabChartProps {
  metric: LabMetric;
  scale: d3.ScaleTime<number, number>;
  height?: number;
  index: number;
  showHandles?: boolean;
  priority?: 'critical' | 'abnormal' | 'normal';
}

export const IndividualLabChart: React.FC<IndividualLabChartProps> = ({ 
  metric, 
  scale, 
  height = 180, 
  index, 
  showHandles = false,
  priority = 'normal'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const CHART_MARGIN = { top: 32, bottom: 24, left: 56, right: 32 };
  const values = metric.values;
  
  if (values.length === 0) return null;

  const hasRefRange = !!metric.referenceRange;
  const refMin = metric.referenceRange?.min ?? 0;
  const refMax = metric.referenceRange?.max ?? 100;

  // Calculate Domain
  const valExtent = d3.extent(values, d => d.value) as [number, number];
  let [minData, maxData] = valExtent;
  if (minData === undefined) minData = 0;
  if (maxData === undefined) maxData = 100;

  let yMin = minData;
  let yMax = maxData;

  if (hasRefRange) {
    yMin = Math.min(minData, refMin);
    yMax = Math.max(maxData, refMax);
  }

  const rangeSpan = yMax - yMin;
  const buffer = rangeSpan === 0 ? (yMax || 1) * 0.2 : rangeSpan * 0.2;
  
  let domainMin = yMin - buffer;
  let domainMax = yMax + buffer;

  if (minData >= 0 && refMin >= 0) {
    domainMin = Math.max(0, domainMin);
  }

  const yScale = d3.scaleLinear()
    .domain([domainMin, domainMax])
    .range([height - CHART_MARGIN.bottom, CHART_MARGIN.top]);

  // Generators - Use step curve
  const line = d3.line<{t: string, value: number}>()
    .x(d => scale(new Date(d.t)))
    .y(d => yScale(d.value))
    .curve(d3.curveStepAfter);

  const area = d3.area<{t: string, value: number}>()
    .x(d => scale(new Date(d.t)))
    .y0(height - CHART_MARGIN.bottom)
    .y1(d => yScale(d.value))
    .curve(d3.curveStepAfter);

  const pathD = line(values) || "";
  const areaD = area(values) || "";

  // Gradient Logic
  const yRefMin = hasRefRange ? yScale(refMin) : height;
  const yRefMax = hasRefRange ? yScale(refMax) : 0;
  
  const offMax = Math.max(0, Math.min(1, yRefMax / height));
  const offMin = Math.max(0, Math.min(1, yRefMin / height));

  const gradientId = `line-gradient-${index}`;
  const areaGradientId = `area-gradient-${index}`;

  const lastVal = values[values.length - 1];
  const isLastAbnormal = hasRefRange && (lastVal.value > refMax || lastVal.value < refMin);

  // Priority styling
  const getBorderColor = () => {
    if (priority === 'critical') return 'border-red-500';
    if (priority === 'abnormal') return 'border-orange-400';
    return 'border-slate-200';
  };

  const getPriorityBadge = () => {
    if (priority === 'critical') return (
      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded">
        Critical
      </span>
    );
    if (priority === 'abnormal') return (
      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 rounded">
        Abnormal
      </span>
    );
    return (
      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded">
        Normal
      </span>
    );
  };

  return (
    <div 
      className={`relative w-full bg-white border-2 ${getBorderColor()} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">{metric.biomarker}</span>
            <span className="text-[10px] font-medium text-slate-500">
              {metric.unit}
              {hasRefRange && (
                <span className="text-slate-400 ml-1 font-normal">
                  (Normal: {metric.referenceRange!.min}-{metric.referenceRange!.max})
                </span>
              )}
            </span>
          </div>
          {getPriorityBadge()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">Current</span>
          <span className={`text-lg font-mono font-bold ${isLastAbnormal ? 'text-red-600' : 'text-slate-700'}`}>
            {lastVal.value}
          </span>
        </div>
      </div>
      
      <div style={{ height }} className="w-full relative p-4">
        <svg width="100%" height={height} className="overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
              {hasRefRange ? (
                <>
                  <stop offset={0} stopColor="#EF4444" />
                  <stop offset={offMax} stopColor="#EF4444" />
                  <stop offset={offMax} stopColor="#10B981" />
                  <stop offset={offMin} stopColor="#10B981" />
                  <stop offset={offMin} stopColor="#EF4444" />
                  <stop offset={1} stopColor="#EF4444" />
                </>
              ) : (
                <>
                  <stop offset={0} stopColor="#10B981" />
                  <stop offset={1} stopColor="#10B981" />
                </>
              )}
            </linearGradient>
            
            <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
              {hasRefRange ? (
                <>
                  <stop offset={0} stopColor="#EF4444" stopOpacity="0.15"/>
                  <stop offset={offMax} stopColor="#EF4444" stopOpacity="0.15"/>
                  <stop offset={offMax} stopColor="#10B981" stopOpacity="0.05"/>
                  <stop offset={1} stopColor="#10B981" stopOpacity="0.05"/>
                </>
              ) : (
                <stop offset={0} stopColor="#10B981" stopOpacity="0.1" />
              )}
            </linearGradient>

            <clipPath id={`clip-${index}`}>
              <rect x={CHART_MARGIN.left} y={0} width="100%" height={height} />
            </clipPath>
          </defs>

          {/* Grid & Labels */}
          {yScale.ticks(5).map((tick, i) => (
            <g key={i} transform={`translate(0, ${yScale(tick)})`}>
              <line x1={CHART_MARGIN.left} x2="100%" stroke="#F1F5F9" strokeWidth={1} />
              <text x={CHART_MARGIN.left - 8} y={3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">{tick}</text>
            </g>
          ))}

          {/* Reference Lines */}
          {hasRefRange && (
            <>
              <line x1={CHART_MARGIN.left} x2="100%" y1={yRefMax} y2={yRefMax} stroke="#EF4444" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
              <line x1={CHART_MARGIN.left} x2="100%" y1={yRefMin} y2={yRefMin} stroke="#10B981" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
            </>
          )}

          {/* Data */}
          <g clipPath={`url(#clip-${index})`}>
            <path d={areaD} fill={`url(#${areaGradientId})`} className="transition-all duration-500" />
            <path d={pathD} fill="none" stroke={`url(#${gradientId})`} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />
          </g>

          {/* Data Points */}
          {values.map((v, i) => {
            const isAbnormal = hasRefRange && (v.value > refMax || v.value < refMin);
            const pointColor = isAbnormal ? "#EF4444" : "#10B981";
            return (
              <g key={i} transform={`translate(${scale(new Date(v.t))}, ${yScale(v.value)})`}>
                <circle 
                  r={isHovered ? 6 : 4}
                  fill="white" 
                  stroke={pointColor} 
                  strokeWidth={2.5} 
                  className="transition-all duration-200"
                />
                {isHovered && (
                  <g transform="translate(0, -14)" className="pointer-events-none"> 
                    <rect x="-24" y="-26" width="48" height="22" rx="4" fill="#1E293B" className="shadow-lg" />
                    <text y="-11" textAnchor="middle" className="text-[11px] fill-white font-bold font-mono">
                      {v.value}
                    </text>
                    <path d="M-4 -4 L4 -4 L0 0 Z" fill="#1E293B" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Handles for React Flow */}
        {showHandles && values.map((v, i) => (
          <Handle
            key={i}
            type="target"
            position={Position.Left}
            id={`lab-${index}-point-${i}`}
            style={{
              left: scale(new Date(v.t)),
              top: yScale(v.value),
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              background: 'transparent',
              border: 'none',
              zIndex: 50
            }}
          />
        ))}
      </div>
    </div>
  );
};
