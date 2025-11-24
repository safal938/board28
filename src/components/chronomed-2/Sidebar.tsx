
import React from 'react';
import { PatientData } from './types';

interface SidebarProps {
  patientData: PatientData;
}

export const Sidebar: React.FC<SidebarProps> = ({ patientData }) => {
  const { patient, problem_list } = patientData;

  return (
    <aside className="w-70 bg-white border-r border-gray-200 flex flex-col min-h-full overflow-y-auto shrink-0 z-40 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
      {/* Patient Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-white to-slate-50/50">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold border-4 border-white shadow-md">
              {patient.name.split(' ').map(n => n[0]).join('')}
           </div>
           <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{patient.name}</h1>
              <p className="text-xs text-slate-500 font-mono mt-1 tracking-wide">MRN: {patient.identifiers.mrn}</p>
           </div>
        </div>
        <div className="flex gap-2">
             <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase tracking-wide">Inpatient</span>
             <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {patientData.riskLevel} Risk
             </span>
        </div>
      </div>

      {/* Demographics */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Demographics</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">DOB</div>
                <div className="text-sm font-semibold text-slate-700">{patient.date_of_birth}</div>
            </div>
            <div>
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Age</div>
                <div className="text-sm font-semibold text-slate-700">{patient.age} Years</div>
            </div>
            <div>
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Sex</div>
                <div className="text-sm font-semibold text-slate-700">{patient.sex}</div>
            </div>
             <div>
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">Ward</div>
                <div className="text-sm font-semibold text-slate-700">4 West</div>
            </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="px-6 py-5 border-b border-red-100 bg-red-50/20">
         <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Primary Diagnosis</h3>
         </div>
         <p className="text-sm font-bold text-red-900 leading-snug">
            {patientData.primaryDiagnosis}
         </p>
      </div>

       {/* Allergies (Static Mock based on Ref) */}
      <div className="px-6 py-5 border-b border-gray-100">
         <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Allergies</h3>
         <div className="flex flex-wrap gap-2">
             <span className="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium border border-red-100">Penicillin (Rash)</span>
         </div>
      </div>

      {/* Problems */}
      <div className="px-6 py-5 flex-1">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Problem List</h3>
        <ul className="space-y-3">
            {problem_list.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 group">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors ${p.status === 'active' ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-emerald-400'}`}></div>
                    <span className={`text-xs font-medium leading-relaxed transition-colors ${p.status === 'active' ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-500 italic'}`}>
                        {p.name}
                        {p.status !== 'active' && <span className="ml-1 text-[9px] text-emerald-600 not-italic uppercase font-bold border border-emerald-100 bg-emerald-50 px-1 rounded">{p.status}</span>}
                    </span>
                </li>
            ))}
        </ul>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-slate-50">
         <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Timeline Legend</h3>
         <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-red-500 shadow-sm"></div>
                <span className="text-[10px] font-medium text-slate-600">Critical Event</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-amber-500 shadow-sm"></div>
                <span className="text-[10px] font-medium text-slate-600">Warning / Risk</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-blue-500 shadow-sm"></div>
                <span className="text-[10px] font-medium text-slate-600">Encounter</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-sm"></div>
                <span className="text-[10px] font-medium text-slate-600">Medication</span>
            </div>
         </div>
      </div>
    </aside>
  );
};
