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
  MarkerType,
  EdgeProps,
  getBezierPath,
  getStraightPath,
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

    // Edge: Methotrexate → ALT spike (2024-07-15)
    const mtxHandleId = 'med-group-methotrexate-source';
    const altLabIdx = labs.findIndex((l: any) => l.biomarker === 'ALT');
    const altSpikePointIdx = labs[altLabIdx]?.values.findIndex((v: any) => v.t === '2024-07-15T14:00:00');
    
    if (altLabIdx !== -1 && altSpikePointIdx !== -1) {
        newEdges.push({
            id: 'e-mtx-to-alt-spike',
            source: medNodeId,
            sourceHandle: mtxHandleId,
            target: labNodeId,
            targetHandle: `lab-${altLabIdx}-point-${altSpikePointIdx}-target`,
            animated: false,
            label: '6 weeks of MTX → ALT 185',
            style: { stroke: '#f59e0b', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#f59e0b',
            },
            labelStyle: { fill: '#f59e0b', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#fffbeb', fillOpacity: 0.9 }
        });
    }

    // Edge: Methotrexate → AST spike (2024-07-15)
    const astLabIdx = labs.findIndex((l: any) => l.biomarker === 'AST');
    const astSpikePointIdx = labs[astLabIdx]?.values.findIndex((v: any) => v.t === '2024-07-15T14:00:00');
    
    if (astLabIdx !== -1 && astSpikePointIdx !== -1) {
        newEdges.push({
            id: 'e-mtx-to-ast-spike',
            source: medNodeId,
            sourceHandle: mtxHandleId,
            target: labNodeId,
            targetHandle: `lab-${astLabIdx}-point-${astSpikePointIdx}-target`,
            animated: false,
            label: 'AST 130',
            style: { stroke: '#f59e0b', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#f59e0b',
            },
            labelStyle: { fill: '#f59e0b', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#fffbeb', fillOpacity: 0.9 }
        });
    }

    // Find the key event for July 15, 2024 (Missed Warning Signal)
    const groupedEvents: Record<string, any[]> = {};
    keyEvents.forEach((evt: any) => {
        const dateKey = new Date(evt.t).toDateString();
        if (!groupedEvents[dateKey]) {
            groupedEvents[dateKey] = [];
        }
        groupedEvents[dateKey].push(evt);
    });
    const eventGroups = Object.values(groupedEvents).sort((a, b) => new Date(a[0].t).getTime() - new Date(b[0].t).getTime());
    const july15EventIdx = eventGroups.findIndex(group => new Date(group[0].t).toDateString() === new Date('2024-07-15T14:00:00').toDateString());

    // Edge: ALT spike → Key Event (July 15)
    if (altLabIdx !== -1 && altSpikePointIdx !== -1 && july15EventIdx !== -1) {
        newEdges.push({
            id: 'e-alt-to-july15-event',
            source: labNodeId,
            sourceHandle: `lab-${altLabIdx}-point-${altSpikePointIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${july15EventIdx}-target`,
            animated: false,
            label: 'ALT 185 triggers warning',
            style: { stroke: '#ef4444', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#ef4444',
            },
            labelStyle: { fill: '#ef4444', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#fef2f2', fillOpacity: 0.9 }
        });
    }

    // Edge: AST spike → Key Event (July 15)
    if (astLabIdx !== -1 && astSpikePointIdx !== -1 && july15EventIdx !== -1) {
        newEdges.push({
            id: 'e-ast-to-july15-event',
            source: labNodeId,
            sourceHandle: `lab-${astLabIdx}-point-${astSpikePointIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${july15EventIdx}-target`,
            animated: false,
            label: 'AST 130 confirms injury',
            style: { stroke: '#ef4444', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#ef4444',
            },
            labelStyle: { fill: '#ef4444', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#fef2f2', fillOpacity: 0.9 }
        });
    }

    // Find August 12 crisis event
    const aug12EventIdx = eventGroups.findIndex(group => new Date(group[0].t).toDateString() === new Date('2024-08-12T09:30:00').toDateString());
    
    // Edge 1: Lab cluster (ALT 490, AST 350, Bilirubin 110) → Crisis Presentation
    const altCrisisIdx = labs[altLabIdx]?.values.findIndex((v: any) => v.t === '2024-08-12T09:30:00');
    const astCrisisIdx = labs[astLabIdx]?.values.findIndex((v: any) => v.t === '2024-08-12T09:30:00');
    const bilirubinLabIdx = labs.findIndex((l: any) => l.biomarker === 'Total Bilirubin');
    const bilirubinCrisisIdx = labs[bilirubinLabIdx]?.values.findIndex((v: any) => v.t === '2024-08-12T09:30:00');
    
    if (altLabIdx !== -1 && altCrisisIdx !== -1 && aug12EventIdx !== -1) {
        newEdges.push({
            id: 'e-alt-crisis-to-event',
            source: labNodeId,
            sourceHandle: `lab-${altLabIdx}-point-${altCrisisIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${aug12EventIdx}-target`,
            animated: false,
            label: 'ALT 490 → crisis',
            style: { stroke: '#dc2626', strokeWidth: 3 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 22,
                height: 22,
                color: '#dc2626',
            },
            labelStyle: { fill: '#dc2626', fontWeight: 700, fontSize: 11 },
            labelBgStyle: { fill: '#fef2f2', fillOpacity: 0.95 }
        });
    }

    if (astLabIdx !== -1 && astCrisisIdx !== -1 && aug12EventIdx !== -1) {
        newEdges.push({
            id: 'e-ast-crisis-to-event',
            source: labNodeId,
            sourceHandle: `lab-${astLabIdx}-point-${astCrisisIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${aug12EventIdx}-target`,
            animated: false,
            label: 'AST 350',
            style: { stroke: '#dc2626', strokeWidth: 3 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 22,
                height: 22,
                color: '#dc2626',
            },
            labelStyle: { fill: '#dc2626', fontWeight: 700, fontSize: 11 },
            labelBgStyle: { fill: '#fef2f2', fillOpacity: 0.95 }
        });
    }

    if (bilirubinLabIdx !== -1 && bilirubinCrisisIdx !== -1 && aug12EventIdx !== -1) {
        newEdges.push({
            id: 'e-bilirubin-crisis-to-event',
            source: labNodeId,
            sourceHandle: `lab-${bilirubinLabIdx}-point-${bilirubinCrisisIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${aug12EventIdx}-target`,
            animated: false,
            label: 'Bilirubin 110',
            style: { stroke: '#dc2626', strokeWidth: 3 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 22,
                height: 22,
                color: '#dc2626',
            },
            labelStyle: { fill: '#dc2626', fontWeight: 700, fontSize: 11 },
            labelBgStyle: { fill: '#fef2f2', fillOpacity: 0.95 }
        });
    }

    // Edge 2: Crisis Presentation → NAC medication
    const nacHandleId = 'med-group-n-acetylcysteine-(nac)-target';
    if (aug12EventIdx !== -1) {
        newEdges.push({
            id: 'e-crisis-to-nac',
            source: keyEventNodeId,
            sourceHandle: `key-event-${aug12EventIdx}-source`,
            target: medNodeId,
            targetHandle: nacHandleId,
            animated: false,
            label: 'NAC infusion started after crisis',
            style: { stroke: '#10b981', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#10b981',
            },
            labelStyle: { fill: '#10b981', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#f0fdf4', fillOpacity: 0.9 }
        });
    }

    // Edge 3: NAC → ALT begins to fall (Aug 15)
    const altAug15Idx = labs[altLabIdx]?.values.findIndex((v: any) => v.t === '2024-08-15T10:00:00');
    const nacSourceHandleId = 'med-group-n-acetylcysteine-(nac)-source';
    if (altLabIdx !== -1 && altAug15Idx !== -1) {
        newEdges.push({
            id: 'e-nac-to-alt-fall',
            source: medNodeId,
            sourceHandle: nacSourceHandleId,
            target: labNodeId,
            targetHandle: `lab-${altLabIdx}-point-${altAug15Idx}-target`,
            animated: false,
            label: 'MTX stopped + NAC → ALT begins to fall',
            style: { stroke: '#10b981', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#10b981',
            },
            labelStyle: { fill: '#10b981', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#f0fdf4', fillOpacity: 0.9 }
        });
    }

    // Edge 4: Bilirubin peak → Peak Cholestasis event
    const aug15EventIdx = eventGroups.findIndex(group => new Date(group[0].t).toDateString() === new Date('2024-08-15T10:00:00').toDateString());
    const bilirubinPeakIdx = labs[bilirubinLabIdx]?.values.findIndex((v: any) => v.t === '2024-08-15T10:00:00');
    
    if (bilirubinLabIdx !== -1 && bilirubinPeakIdx !== -1 && aug15EventIdx !== -1) {
        newEdges.push({
            id: 'e-bilirubin-peak-to-cholestasis',
            source: labNodeId,
            sourceHandle: `lab-${bilirubinLabIdx}-point-${bilirubinPeakIdx}-source`,
            target: keyEventNodeId,
            targetHandle: `key-event-${aug15EventIdx}-target`,
            animated: false,
            label: 'Bilirubin 190 → peak cholestasis',
            style: { stroke: '#f59e0b', strokeWidth: 2.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#f59e0b',
            },
            labelStyle: { fill: '#f59e0b', fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: '#fffbeb', fillOpacity: 0.9 }
        });
    }

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
