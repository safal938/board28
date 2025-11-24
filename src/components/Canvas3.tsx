import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  NodeProps,
  Handle,
  Position,
  Panel,
} from 'reactflow';
import styled from 'styled-components';
import 'reactflow/dist/style.css';
import { Dashboard } from './chronomed/Dashboard';
import { Dashboard as Dashboard2 } from './chronomed-2/Dashboard';
import { EncounterTrack, MedicationTrack, LabTrack, RiskTrack, KeyEventsTrack, useTimelineScale, MasterGrid, TimelineAxis } from './chronomed-2/timeline';
import { CausalSidebar } from './chronomed-2/CausalSidebar';
import { Sidebar } from './chronomed/Sidebar';

import INITIAL_DATA from '../data/new_med_timeline.json';

const ReactFlowWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  .react-flow__node.selected {
    .react-flow__node-default,
    & > div {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(0, 0, 0, 0.2) !important;
    }
  }

  /* Make all edges appear above nodes */
  .react-flow__edges {
    z-index: 9999 !important;
  }
  
  .react-flow__edge {
    z-index: 9999 !important;
  }
`;

const DashboardNodeContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
  z-index: 1;
`;

function DashboardNode({ data }: NodeProps) {
  return (
    <DashboardNodeContainer>
      <Dashboard />
    </DashboardNodeContainer>
  );
}

function Dashboard2Node({ data }: NodeProps) {
  return (
    <DashboardNodeContainer>
      <Dashboard2 />
    </DashboardNodeContainer>
  );
}

// ... (imports remain the same)

function UnifiedDashboardNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  
  const patientData = data.patientData;
  const encounters = data.encounters || [];
  const medications = data.medications || [];
  const labs = data.labs || [];
  const risks = data.risks || [];
  const events = data.events || [];
  const causalNodes = data.causalNodes || [];
  const showHandles = data.showHandles;
  
  const timelineWidth = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, timelineWidth, PADDING);

  return (
    <div className="flex h-full bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 shrink-0 border-r border-gray-200">
            <Sidebar patientData={patientData} />
        </div>

        {/* Center Timeline */}
        <div style={{ width: timelineWidth }} className="relative bg-white">
            <MasterGrid encounters={encounters} scale={scale} height="100%" />
            
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                    <TimelineAxis encounters={encounters} scale={scale} />
            </div>

            <div className="relative z-20 pt-2 pb-4 flex flex-col gap-1">
                <EncounterTrack encounters={encounters} scale={scale} showHandles={showHandles} />
                <MedicationTrack medications={medications} scale={scale} showHandles={showHandles} />
                <LabTrack labs={labs} scale={scale} showHandles={showHandles} />
                <RiskTrack data={risks} scale={scale} showHandles={showHandles} />
                <KeyEventsTrack events={events} scale={scale} showHandles={showHandles} />
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 shrink-0 border-l border-gray-200">
            <CausalSidebar nodes={causalNodes} showHandles={showHandles} />
        </div>
    </div>
  );
}


function EncounterTrackNode({ data }: NodeProps) {
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  const encounters = data.encounters || [];
  const showHandles = data.showHandles;
  
  const width = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, width, PADDING);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
       <MasterGrid encounters={encounters} scale={scale} height="100%" />
       
       <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <TimelineAxis encounters={encounters} scale={scale} />
       </div>

      <div className="relative z-20 pt-2 pb-4 flex flex-col gap-1">
        <h3 className="text-lg font-bold px-4 pt-2">Encounter Track Standalone</h3>
        <EncounterTrack encounters={encounters} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function MedicationTrackNode({ data }: NodeProps) {
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  const encounters = data.encounters || [];
  const medications = data.medications || [];
  const showHandles = data.showHandles;
  
  const width = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, width, PADDING);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" />
      
      <div className="relative z-20 p-5">
        <h3 className="text-lg font-bold mb-4">Medication Track Standalone</h3>
        <MedicationTrack medications={medications} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function LabTrackNode({ data }: NodeProps) {
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  const encounters = data.encounters || [];
  const labs = data.labs || [];
  const showHandles = data.showHandles;
  
  const width = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, width, PADDING);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" />
      
      <div className="relative z-20 p-5">
        <h3 className="text-lg font-bold mb-4">Lab Track Standalone</h3>
        <LabTrack labs={labs} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function RiskTrackNode({ data }: NodeProps) {
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  const encounters = data.encounters || [];
  const risks = data.risks || [];
  const showHandles = data.showHandles;
  
  const width = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, width, PADDING);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" />
      
      <div className="relative z-20 p-5">
        <h3 className="text-lg font-bold mb-4">Risk Track Standalone</h3>
        <RiskTrack data={risks} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function KeyEventsTrackNode({ data }: NodeProps) {
  const SLOT_WIDTH = 300;
  const PADDING = 160;
  const encounters = data.encounters || [];
  const events = data.events || [];
  const showHandles = data.showHandles;
  
  const width = Math.max(
    1400,
    (encounters.length * SLOT_WIDTH) + (PADDING * 2)
  );
  
  const scale = useTimelineScale(encounters, width, PADDING);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" />
      
      <div className="relative z-20 p-5">
        <h3 className="text-lg font-bold mb-4">Key Events Track Standalone</h3>
        <KeyEventsTrack events={events} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function SidebarNode({ data }: NodeProps) {
    const patientData = data.patientData;
    return (
        <div style={{ width: 320, height: 1200, background: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <Sidebar patientData={patientData} />
        </div>
    );
}

function CausalNode({ data }: NodeProps) {
    const nodes = data.nodes || [];
    const showHandles = data.showHandles;
    return (
        <div style={{ width: 400, height: 2400, background: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <CausalSidebar nodes={nodes} showHandles={showHandles} />
        </div>
    );
}

function Canvas3() {
  const [showConnections, setShowConnections] = useState(true);

  // Calculate dynamic nodes and edges
  const { nodes: dynamicNodes, edges: dynamicEdges } = useMemo(() => {
    if (!showConnections) {
        return { nodes: [], edges: [] };
    }

    const encounters = INITIAL_DATA.content.props.encounters;
    const medications = INITIAL_DATA.content.props.medicationTimeline;
    const labs = INITIAL_DATA.content.props.labTimeline;
    const risks = INITIAL_DATA.content.props.riskTimeline;
    const keyEvents = INITIAL_DATA.content.props.keyEvents;
    
    // Note: Causal nodes are now inside the dashboard, but we might still want to connect TO them if they have handles.
    // However, the previous logic connected a separate Causal Node to the Risk Node.
    // Now both are inside the same Unified Node. 
    // React Flow edges CANNOT connect elements INSIDE the same node to each other using standard edges.
    // But here we are connecting external "Info Cards" to the Unified Node.
    
    const SLOT_WIDTH = 300;
    const PADDING = 160;
    const width = Math.max(1400, (encounters.length * SLOT_WIDTH) + (PADDING * 2));
    
    // Re-implement scale logic for positioning (simplified)
    const sortedDates = [...encounters].map(e => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime());
    const availableWidth = width - (PADDING * 2);
    const step = availableWidth / (sortedDates.length > 1 ? sortedDates.length - 1 : 1);
    
    // Map date string to X
    const getX = (dateStr: string) => {
        const d = new Date(dateStr);
        const index = sortedDates.findIndex(sd => sd.getTime() === d.getTime());
        if (index === -1) return 0;
        return PADDING + (index * step);
    };

    const unifiedNodeId = 'unified-dashboard-1';
    
    // Offsets for the unified node structure
    const SIDEBAR_WIDTH = 320;
    const trackStartX = 100 + SIDEBAR_WIDTH; // Shift everything right by sidebar width
    const trackStartY = 100;
    
    const encounterY = trackStartY + 100;
    const medY = trackStartY + 400;
    const labY = trackStartY + 800;
    const riskY = trackStartY + 1200;
    const keyEventY = trackStartY + 1600;

    const newNodes: Node[] = [];
    const newEdges: any[] = [];

    // Encounter Dynamic Nodes (Bottom)
    encounters.forEach((enc) => {
        const x = getX(enc.date);
        const nodeId = `detail-${enc.encounter_no}`;
        
        newNodes.push({
            id: nodeId,
            type: 'default', // Standard node
            position: { x: trackStartX + x - 75, y: encounterY + 2000 }, // Position way below
            data: { label: `Detail: ${enc.type}` },
            style: { width: 150, background: '#eff6ff', border: '1px solid #3b82f6' }
        });

        newEdges.push({
            id: `e-${unifiedNodeId}-${nodeId}`,
            source: unifiedNodeId,
            sourceHandle: `enc-${enc.encounter_no}`,
            target: nodeId,
            animated: true,
            style: { stroke: '#3b82f6' }
        });
    });

    // Medication Dynamic Nodes (Left)
    const groupedMeds: Record<string, any[]> = {};
    medications.forEach((med: any) => {
        if (!groupedMeds[med.name]) {
            groupedMeds[med.name] = [];
        }
        groupedMeds[med.name].push(med);
    });
    
    const medNames = Object.keys(groupedMeds);
    
    medNames.forEach((name, idx) => {
        const nodeId = `med-info-${name.replace(/\s+/g, '-').toLowerCase()}`;
        const handleId = `med-group-${name.replace(/\s+/g, '-').toLowerCase()}`;
        
        newNodes.push({
            id: nodeId,
            type: 'default',
            position: { x: trackStartX - 250, y: medY + (idx * 30) }, // Left of the track
            data: { label: `${name} Info` },
            style: { width: 200, background: '#ecfdf5', border: '1px solid #10b981' }
        });

        newEdges.push({
            id: `e-${nodeId}-${unifiedNodeId}`,
            source: nodeId,
            target: unifiedNodeId,
            targetHandle: handleId,
            animated: true,
            style: { stroke: '#10b981' }
        });
    });

    // Lab Dynamic Nodes (Left)
    labs.forEach((metric: any, idx: number) => {
        const nodeId = `lab-info-${idx}`;
        const metricName = metric.biomarker;

        newNodes.push({
            id: nodeId,
            type: 'default',
            position: { x: trackStartX - 250, y: labY + (idx * 150) }, // Spaced out vertically
            data: { label: `${metricName} Analysis` },
            style: { width: 200, background: '#f0f9ff', border: '1px solid #0ea5e9' }
        });

        // Create edges to ALL data points for this metric
        metric.values.forEach((val: any, valIdx: number) => {
            newEdges.push({
                id: `e-${nodeId}-${unifiedNodeId}-${valIdx}`,
                source: nodeId,
                target: unifiedNodeId,
                targetHandle: `lab-${idx}-point-${valIdx}`,
                animated: true,
                style: { stroke: '#0ea5e9', strokeDasharray: '5,5' }
            });
        });
    });

    // Risk Dynamic Nodes (Left)
    const riskAnalysisNodeId = 'risk-analysis-node';
    newNodes.push({
        id: riskAnalysisNodeId,
        type: 'default',
        position: { x: trackStartX - 250, y: riskY },
        data: { label: 'Risk Analysis' },
        style: { width: 200, background: '#fef2f2', border: '1px solid #ef4444' }
    });

    // Connect to ALL risk points
    risks.forEach((point: any, idx: number) => {
        newEdges.push({
            id: `e-${riskAnalysisNodeId}-${unifiedNodeId}-${idx}`,
            source: riskAnalysisNodeId,
            target: unifiedNodeId,
            targetHandle: `risk-point-${idx}`,
            animated: true,
            style: { stroke: '#ef4444', strokeDasharray: '5,5' }
        });
    });

    // Key Events Dynamic Nodes (Left)
    const groupedEvents: Record<string, any[]> = {};
    keyEvents.forEach((evt: any) => {
        const dateKey = new Date(evt.t).toDateString();
        if (!groupedEvents[dateKey]) {
            groupedEvents[dateKey] = [];
        }
        groupedEvents[dateKey].push(evt);
    });
    const eventGroups = Object.values(groupedEvents).sort((a, b) => new Date(a[0].t).getTime() - new Date(b[0].t).getTime());

    eventGroups.forEach((group, idx) => {
        const nodeId = `key-event-info-${idx}`;
        const dateStr = new Date(group[0].t).toLocaleDateString();

        newNodes.push({
            id: nodeId,
            type: 'default',
            position: { x: trackStartX - 250, y: keyEventY + (idx * 100) },
            data: { label: `Event: ${dateStr}` },
            style: { width: 200, background: '#fef2f2', border: '1px solid #ef4444' }
        });

        newEdges.push({
            id: `e-${nodeId}-${unifiedNodeId}`,
            source: nodeId,
            target: unifiedNodeId,
            targetHandle: `key-event-${idx}`,
            animated: true,
            style: { stroke: '#ef4444' }
        });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [showConnections]);

  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'dashboard-2',
      type: 'dashboard2',
      position: { x: 100, y: 2200 },
      data: { label: 'Chronomed Dashboard 2' },
      draggable: true,
    },
    {
      id: 'unified-dashboard-1',
      type: 'unifiedDashboard',
      position: { x: 100, y: 100 },
      data: { 
          patientData: INITIAL_DATA.content.patientData,
          encounters: INITIAL_DATA.content.props.encounters,
          medications: INITIAL_DATA.content.props.medicationTimeline,
          labs: INITIAL_DATA.content.props.labTimeline,
          risks: INITIAL_DATA.content.props.riskTimeline,
          events: INITIAL_DATA.content.props.keyEvents,
          causalNodes: INITIAL_DATA.content.props.causalChain,
          showHandles: showConnections 
      },
      draggable: true,
    },
    // Standalone Components (Positioned to the right)
    {
      id: 'sidebar-standalone',
      type: 'sidebar',
      position: { x: 2500, y: 100 },
      data: { 
          patientData: INITIAL_DATA.content.patientData
      },
      draggable: true,
    },
    {
      id: 'encounter-track-standalone',
      type: 'encounterTrack',
      position: { x: 2900, y: 100 },
      data: { encounters: INITIAL_DATA.content.props.encounters, showHandles: showConnections },
      draggable: true,
    },
    {
      id: 'medication-track-standalone',
      type: 'medicationTrack',
      position: { x: 2900, y: 600 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters,
          medications: INITIAL_DATA.content.props.medicationTimeline,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'lab-track-standalone',
      type: 'labTrack',
      position: { x: 2900, y: 1000 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters,
          labs: INITIAL_DATA.content.props.labTimeline,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'risk-track-standalone',
      type: 'riskTrack',
      position: { x: 2900, y: 1400 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters,
          risks: INITIAL_DATA.content.props.riskTimeline,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'key-events-track-standalone',
      type: 'keyEventsTrack',
      position: { x: 2900, y: 1800 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters,
          events: INITIAL_DATA.content.props.keyEvents,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'causal-sidebar-standalone',
      type: 'causalNode',
      position: { x: 4500, y: 100 },
      data: { 
          nodes: INITIAL_DATA.content.props.causalChain,
          showHandles: showConnections
      },
      draggable: true,
    },
    ...dynamicNodes
  ], [dynamicNodes, showConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dynamicEdges);

  // Update nodes when initialNodes changes (which depends on showConnections)
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(dynamicEdges);
  }, [initialNodes, dynamicEdges, setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({
    dashboard: DashboardNode,
    dashboard2: Dashboard2Node,
    unifiedDashboard: UnifiedDashboardNode,
    encounterTrack: EncounterTrackNode,
    medicationTrack: MedicationTrackNode,
    labTrack: LabTrackNode,
    riskTrack: RiskTrackNode,
    keyEventsTrack: KeyEventsTrackNode,
    causalNode: CausalNode,
    sidebar: SidebarNode,
  }), []);

  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlowWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#e5e7eb"
          />
          <Panel position="top-right">
            <button 
                onClick={() => setShowConnections(!showConnections)}
                className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
                {showConnections ? 'Hide Connections' : 'Show Connections'}
            </button>
          </Panel>
        </ReactFlow>
      </ReactFlowWrapper>
    </div>
  );
}

export default Canvas3;
