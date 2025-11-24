import React from 'react';
import { Handle, Position } from 'reactflow';
import { CausalNode } from './types';

interface CausalSidebarProps {
  nodes: CausalNode[];
  showHandles?: boolean;
}

export const CausalSidebar: React.FC<CausalSidebarProps> = ({ nodes, showHandles = false }) => {
  if (!nodes || nodes.length === 0) return null;

  // Determine status/color based on content keywords
  const getStatus = (node: CausalNode) => {
    const text = (node.title + " " + node.description).toLowerCase();
    if (text.includes('crisis') || text.includes('injury') || text.includes('toxic') || text.includes('failure') || text.includes('severe') || text.includes('dili') || text.includes('encephalopathy')) return 'critical';
    if (text.includes('risk') || text.includes('warning') || text.includes('missed') || text.includes('exposure') || text.includes('continued') || text.includes('accumulation')) return 'warning';
    if (text.includes('recovery') || text.includes('cessation') || text.includes('stable') || text.includes('outcome') || text.includes('normal')) return 'good';
    return 'neutral';
  };

  // Light Theme Definitions (Medical/Clinical)
  const theme = {
    critical: { 
      accent: 'bg-red-500', 
      softBg: 'bg-red-50', 
      border: 'border-red-100',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700 border-red-200'
    },
    warning:  { 
      accent: 'bg-amber-500', 
      softBg: 'bg-amber-50', 
      border: 'border-amber-100',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    good:     { 
      accent: 'bg-emerald-500', 
      softBg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    neutral:  { 
      accent: 'bg-blue-500', 
      softBg: 'bg-blue-50', 
      border: 'border-blue-100',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    },
  };

  return (
    <aside className="h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto shrink-0 z-40 shadow-[-2px_0_10px_rgba(0,0,0,0.05)] nowheel">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-white to-slate-50/50 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Causal Pathway Analysis</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Forensic timeline reconstruction</p>
          </div>
        </div>
      </div>

      {/* Vertical Flow Container */}
      <div className="flex-1 p-6">
        <div className="relative">
          {/* Connecting Line (Spine) running vertically */}
          <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>

          <div className="flex flex-col space-y-6 relative z-10">
            {nodes.map((node, i) => {
              const status = getStatus(node);
              const style = theme[status];

              return (
                <div key={i} className="relative flex items-start gap-4 group">
                  {/* React Flow Handle */}
                  {showHandles && (
                      <Handle
                          type="source"
                          position={Position.Left}
                          id={`causal-node-${i}`}
                          style={{
                              left: -24,
                              top: 20, // Align with the circle
                              width: 8,
                              height: 8,
                              background: '#64748b',
                              border: 'none',
                              zIndex: 50
                          }}
                      />
                  )}

                  {/* Step Indicator */}
                  
                  {/* Card */}
                  <div className={`
                    flex-1 p-4 rounded-xl border bg-white shadow-sm transition-all duration-300
                    ${style.border} hover:shadow-lg hover:border-gray-300
                  `}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${style.badge}`}>
                        {status}
                      </span>
                    </div>
                    
                    <h4 className="text-slate-800 font-bold text-sm mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {node.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                   <div className={`
                    w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xs font-bold text-white shrink-0
                    ${style.accent} transition-transform duration-300 group-hover:scale-110 z-10 order-first
                  `}>
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
