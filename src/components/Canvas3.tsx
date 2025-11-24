import React, { useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  NodeProps,
  Panel,
} from 'reactflow';
import styled from 'styled-components';
import 'reactflow/dist/style.css';
import { Dashboard } from './chronomed/Dashboard';
import { Dashboard as Dashboard2 } from './chronomed-2/Dashboard';
import { EncounterTrack, MedicationTrack, LabTrack, RiskTrack, KeyEventsTrack, useTimelineScale, MasterGrid, TimelineAxis } from './chronomed-2/timeline';
import { Sidebar } from './chronomed/Sidebar';

import INITIAL_DATA from '../data/new_medtimeline_updated.json';

const pastMeds = [
    {
        "name": "Ramipril",
        "startDate": "2020-01-01",
        "endDate": "2025-02-15",
        "dose": "5mg OD",
        "indication": "Hypertension"
    },
    {
        "name": "Metformin",
        "startDate": "2019-01-01",
        "endDate": "2025-02-15",
        "dose": "1000mg BD",
        "indication": "T2DM"
    }
];

const pastMedDates = pastMeds.map(m => new Date(m.startDate));

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

function DashboardNode() {
  return (
    <DashboardNodeContainer>
      <Dashboard />
    </DashboardNodeContainer>
  );
}

function Dashboard2Node() {
  return (
    <DashboardNodeContainer>
      <Dashboard2 />
    </DashboardNodeContainer>
  );
}

function EncounterTrackNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const SLOT_WIDTH = 300;
  const PADDING = 40;
  const encounters = data.encounters || [];
  const showHandles = data.showHandles;
  
  const totalItems = encounters.length + pastMeds.length;
  const { scale, width } = useTimelineScale(encounters, 40, 160, pastMedDates);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
       <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
       
       <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <TimelineAxis encounters={encounters} scale={scale} additionalDates={pastMedDates} />
       </div>

      <div className="relative z-20 pt-2 pb-4">
        <EncounterTrack encounters={encounters} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function MedicationTrackNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const PADDING = 20;
  const encounters = data.encounters || [];
  const medications = data.medications || [];
  const showHandles = data.showHandles;
  
  const { scale, width } = useTimelineScale(encounters, 20, 160, pastMedDates);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
      
      <div className="relative z-20 pt-5 pb-5">
        <MedicationTrack medications={medications} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function LabTrackNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const PADDING = 20;
  const encounters = data.encounters || [];
  const labs = data.labs || [];
  const showHandles = data.showHandles;
  
  const { scale, width } = useTimelineScale(encounters, 20, 160, pastMedDates);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
      
      <div className="relative z-20 pt-5 pb-5">
        <LabTrack labs={labs} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function RiskTrackNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const PADDING = 20;
  const encounters = data.encounters || [];
  const risks = data.risks || [];
  const showHandles = data.showHandles;
  
  const { scale, width } = useTimelineScale(encounters, 20, 160, pastMedDates);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
      
      <div className="relative z-20 pt-5 pb-5">
        <RiskTrack data={risks} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function KeyEventsTrackNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const PADDING = 20;
  const encounters = data.encounters || [];
  const events = data.events || [];
  const showHandles = data.showHandles;
  
  const { scale, width } = useTimelineScale(encounters, 20, 160, pastMedDates);

  return (
    <div style={{ width: width, background: 'white', padding: 0, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'visible', position: 'relative' }}>
      <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
      
      <div className="relative z-20 pt-5 pb-5">
        <KeyEventsTrack events={events} scale={scale} showHandles={showHandles} />
      </div>
    </div>
  );
}

function SidebarNode({ data }: NodeProps) {
    const patientData = data.patientData;
    return (
        <div style={{ width: 320, height: 2400, background: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <Sidebar patientData={patientData} />
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
    const medications = [...pastMeds, ...INITIAL_DATA.content.props.medicationTimeline];
    const labs = INITIAL_DATA.content.props.labTimeline;
    const risks = INITIAL_DATA.content.props.riskTimeline;
    const keyEvents = INITIAL_DATA.content.props.keyEvents;

    const encounterNodeId = 'encounter-track-1';
    const medNodeId = 'medication-track-1';
    const labNodeId = 'lab-track-1';
    const riskNodeId = 'risk-track-1';
    const keyEventNodeId = 'key-events-track-1';

    const newNodes: Node[] = [];
    const newEdges: any[] = [];

    // Create single MedForce AI node
    const medforceAINodeId = 'medforce-ai';
    newNodes.push({
        id: medforceAINodeId,
        type: 'default',
        position: { x: -400, y: 1200 },
        data: { label: 'MedForce AI' },
        style: { 
            width: 200, 
            height: 80,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: '2px solid #5a67d8',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
        }
    });

    // Connect MedForce AI to each individual encounter
    encounters.forEach((enc: any) => {
        newEdges.push({
            id: `e-${medforceAINodeId}-enc-${enc.encounter_no}`,
            source: medforceAINodeId,
            target: encounterNodeId,
            targetHandle: `enc-${enc.encounter_no}`,
            animated: true,
            style: { stroke: '#667eea', strokeWidth: 1.5, strokeDasharray: '5,5' }
        });
    });

    // Connect MedForce AI to each medication group
    const groupedMeds: Record<string, any[]> = {};
    medications.forEach((med: any) => {
        if (!groupedMeds[med.name]) {
            groupedMeds[med.name] = [];
        }
        groupedMeds[med.name].push(med);
    });
    
    Object.keys(groupedMeds).forEach((name) => {
        const handleId = `med-group-${name.replace(/\s+/g, '-').toLowerCase()}`;
        newEdges.push({
            id: `e-${medforceAINodeId}-${handleId}`,
            source: medforceAINodeId,
            target: medNodeId,
            targetHandle: handleId,
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '5,5' }
        });
    });

    // Connect MedForce AI to each lab data point
    labs.forEach((metric: any, idx: number) => {
        metric.values.forEach((_val: any, valIdx: number) => {
            newEdges.push({
                id: `e-${medforceAINodeId}-lab-${idx}-${valIdx}`,
                source: medforceAINodeId,
                target: labNodeId,
                targetHandle: `lab-${idx}-point-${valIdx}`,
                animated: true,
                style: { stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '3,3' }
            });
        });
    });

    // Connect MedForce AI to each risk point
    risks.forEach((_point: any, idx: number) => {
        newEdges.push({
            id: `e-${medforceAINodeId}-risk-${idx}`,
            source: medforceAINodeId,
            target: riskNodeId,
            targetHandle: `risk-point-${idx}`,
            animated: true,
            style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '5,5' }
        });
    });

    // Connect MedForce AI to each key event group
    const groupedEvents: Record<string, any[]> = {};
    keyEvents.forEach((evt: any) => {
        const dateKey = new Date(evt.t).toDateString();
        if (!groupedEvents[dateKey]) {
            groupedEvents[dateKey] = [];
        }
        groupedEvents[dateKey].push(evt);
    });
    const eventGroups = Object.values(groupedEvents).sort((a, b) => new Date(a[0].t).getTime() - new Date(b[0].t).getTime());

    eventGroups.forEach((_group, idx) => {
        newEdges.push({
            id: `e-${medforceAINodeId}-key-event-${idx}`,
            source: medforceAINodeId,
            target: keyEventNodeId,
            targetHandle: `key-event-${idx}`,
            animated: true,
            style: { stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '5,5' }
        });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [showConnections]);

  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'sidebar-1',
      type: 'sidebar',
      position: { x: -750, y: 100 },
      data: { 
          patientData: INITIAL_DATA.content.patientData
      },
      draggable: true,
    },
    
    {
      id: 'encounter-track-1',
      type: 'encounterTrack',
      position: { x: 100, y: 100 },
      data: { encounters: INITIAL_DATA.content.props.encounters, showHandles: showConnections },
      draggable: true,
    },
    {
      id: 'medication-track-1',
      type: 'medicationTrack',
      position: { x: 100, y: 700 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters, // Needed for scale
          medications: [...pastMeds, ...INITIAL_DATA.content.props.medicationTimeline],
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'lab-track-1',
      type: 'labTrack',
      position: { x: 100, y: 1000 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters, // Needed for scale
          labs: INITIAL_DATA.content.props.labTimeline,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'risk-track-1',
      type: 'riskTrack',
      position: { x: 100, y: 2300 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters, // Needed for scale
          risks: INITIAL_DATA.content.props.riskTimeline,
          showHandles: showConnections
      },
      draggable: true,
    },
    {
      id: 'key-events-track-1',
      type: 'keyEventsTrack',
      position: { x: 100, y: 2600 },
      data: { 
          encounters: INITIAL_DATA.content.props.encounters, // Needed for scale
          events: INITIAL_DATA.content.props.keyEvents,
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
    encounterTrack: EncounterTrackNode,
    medicationTrack: MedicationTrackNode,
    labTrack: LabTrackNode,
    riskTrack: RiskTrackNode,
    keyEventsTrack: KeyEventsTrackNode,
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
