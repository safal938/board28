import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Node,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import styled from 'styled-components';
import 'reactflow/dist/style.css';
import { FileText, Database, Settings, Users } from 'lucide-react';
import MedicationTimeline2 from './dashboard/MedicationTimeline2';
import LabTimeline from './dashboard/LabTimeline';
import { EncounterTrack, useTimelineScale, MasterGrid, TimelineAxis } from './chronomed-2/timeline';

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

const NodeContainer = styled.div<{ color?: string }>`
  padding: 20px;
  border-radius: 8px;
  background: white;
  border: 2px solid ${props => props.color || '#e5e7eb'};
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

// Invisible node component
const InvisibleNodeContainer = styled.div`
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50%;
  
  &.highlighted {
    background: rgba(59, 130, 246, 0.2);
    border: 2px solid #3b82f6;
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
  }
`;

function InvisibleNode({ data }: NodeProps) {
  return (
    <InvisibleNodeContainer className={data.highlighted ? 'highlighted' : ''}>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </InvisibleNodeContainer>
  );
}

const ConnectorButton = styled.button<{ isActive?: boolean }>`
  position: absolute;
  top: 80px;
  left: 20px;
  background: ${props => props.isActive ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  box-shadow: ${props => props.isActive 
    ? '0 4px 12px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.3)' 
    : '0 4px 12px rgba(59, 130, 246, 0.3)'};
  z-index: 10001;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isActive ? '#dc2626' : '#2563eb'};
    transform: translateY(-1px);
    box-shadow: ${props => props.isActive 
      ? '0 6px 16px rgba(239, 68, 68, 0.5), 0 0 24px rgba(239, 68, 68, 0.4)' 
      : '0 6px 16px rgba(59, 130, 246, 0.4)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NodeTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
`;

const NodeContent = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
`;

const IconWrapper = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: ${props => props.color || '#f3f4f6'};
`;

// Custom node component with handles for connections
function CustomNode({ data }: NodeProps) {
  const getIcon = () => {
    switch (data.icon) {
      case 'file':
        return <FileText size={16} />;
      case 'database':
        return <Database size={16} />;
      case 'settings':
        return <Settings size={16} />;
      case 'users':
        return <Users size={16} />;
      default:
        return null;
    }
  };

  return (
    <NodeContainer color={data.color}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <NodeTitle>
        {data.icon && (
          <IconWrapper color={data.color}>
            {getIcon()}
          </IconWrapper>
        )}
        {data.label}
      </NodeTitle>
      {data.content && <NodeContent>{data.content}</NodeContent>}
    </NodeContainer>
  );
}

const WelcomeContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1000;
  pointer-events: none;
`;

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const WelcomeHint = styled.div`
  font-size: 14px;
  color: #9ca3af;
  font-style: italic;
`;

// Timeline Node Component
const TimelineNodeContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

// Past medications data
const pastMeds = [
    {
        "name": "Ramipril",
        "startDate": "2020-01-01",
        "dose": "5mg OD",
        "indication": "Hypertension"
    },
    {
        "name": "Metformin",
        "startDate": "2019-01-01",
        "dose": "1000mg BD",
        "indication": "T2DM"
    }
];

const pastMedDates = pastMeds.map(m => new Date(m.startDate));

function TimelineNode({ data }: NodeProps) {
  // Configuration matching Dashboard.tsx
  const PADDING = 20;
  const encounters = data.encounters || [];
  
  const { scale, width } = useTimelineScale(encounters, 20, 160, pastMedDates);

  return (
    <TimelineNodeContainer style={{ width: width }}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <MasterGrid encounters={encounters} scale={scale} height="100%" additionalDates={pastMedDates} />
      
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <TimelineAxis encounters={encounters} scale={scale} additionalDates={pastMedDates} />
      </div>

      <div className="relative z-20 pt-2 flex flex-col gap-1">
        <EncounterTrack encounters={data.encounters} scale={scale} />
      </div>
      
      <MedicationTimeline2 
        encounters={data.encounters} 
        MedicationTimeLine1={data.medicationTimeline}
        showingConnection={data.showingConnection}
        highlightEncounterNo={data.highlightEncounterNo}
      />
      {data.labTimeline && (
        <LabTimeline 
          labTimeline={data.labTimeline}
          encounters={data.encounters}
          showingConnection={data.showingConnection}
          highlightBiomarker={data.highlightBiomarker}
        />
      )}
    </TimelineNodeContainer>
  );
}

// Chronomed Timeline Node Component
const ChronomedNodeContainer = styled.div`
  width: 2400px;
  height: 2000px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
  z-index: 1;
  
  /* Override the Dashboard's h-screen to fit within this container */
  & > div {
    height: 100% !important;
    width: 100% !important;
  }
`;


function Canvas4() {
  const [showInvisibleConnections, setShowInvisibleConnections] = useState(false);
  const [showingConnection, setShowingConnection] = useState(false);
  
  // Track timeline-1 position to move invisible connectors with it
  const [timelineOffset, setTimelineOffset] = useState({ x: 0, y: 0 });
  
  // Sample data for MedicationTimeline2
  const sampleEncounters = [
    {
      encounter_no: 1,
      date: "2015-08-10",
      type: "Rheumatology Initial Consult",
      provider: "Dr. Elizabeth Hayes",
      diagnosis: "Seropositive Rheumatoid Arthritis (active)",
      medications: [
        "Methotrexate 10mg weekly",
        "Folic Acid 5mg weekly",
        "Ibuprofen 200mg Occasional previously"
      ],
      notes: "Started MTX therapy with folic acid supplementation"
    },
    {
      encounter_no: 2,
      date: "2016-02-20",
      type: "General Practice",
      provider: "GP",
      diagnosis: "Stable RA on MTX",
      medications: [
        "Methotrexate 10mg weekly",
        "Folic Acid 5mg weekly"
      ],
      notes: "Good RA control on MTX 10 mg weekly; no MTX side effects"
    },
    {
      encounter_no: 3,
      date: "2018-09-05",
      type: "General Practice",
      provider: "GP",
      diagnosis: "New essential hypertension; RA stable; plan MTX dose increase",
      medications: [
        "Methotrexate 20mg weekly",
        "Folic Acid 5mg weekly",
        "Lisinopril 10mg daily"
      ],
      notes: "Elevated BP readings 145–155/90–95; MTX increased to 20mg"
    },
    {
      encounter_no: 4,
      date: "2021-03-15",
      type: "General Practice",
      provider: "GP",
      diagnosis: "Stable RA; controlled HTN; mild CKD (stable)",
      medications: [
        "Methotrexate 20mg weekly",
        "Folic Acid 5mg weekly",
        "Lisinopril 10mg daily"
      ],
      notes: "Overall well; RA controlled on MTX 20 mg; BP controlled"
    },
    {
      encounter_no: 5,
      date: "2025-06-15",
      type: "General Practice",
      provider: "GP",
      diagnosis: "Acute bacterial sinusitis; RA/HTN/CKD stable",
      medications: [
        "Trimethoprim-Sulfamethoxazole 800/160mg BID"
      ],
      notes: "5 days nasal congestion, facial pain, headache, green discharge"
    },
    {
      encounter_no: 6,
      date: "2025-06-21",
      type: "Emergency Medicine",
      provider: "Dr. Sarah Chen",
      diagnosis: "Acute liver injury likely DILI and/or severe methotrexate toxicity",
      medications: [],
      notes: "Severe fatigue, jaundice, epigastric pain, confusion"
    }
  ];

  const sampleMedicationTimeline = [
    {
      name: "Methotrexate",
      startDate: "2015-08-10",
      endDate: "2018-09-05",
      dose: "10mg weekly",
      indication: "RA"
    },
    {
      name: "Methotrexate",
      startDate: "2018-09-05",
      dose: "20mg weekly",
      indication: "RA"
    },
    {
      name: "Folic Acid",
      startDate: "2015-08-10",
      dose: "5mg weekly",
      indication: "MTX supplementation"
    },
    {
      name: "Lisinopril",
      startDate: "2018-09-05",
      dose: "10mg daily",
      indication: "Hypertension"
    },
    {
      name: "Trimethoprim-Sulfamethoxazole",
      startDate: "2025-06-15",
      endDate: "2025-06-25",
      dose: "800/160mg BID",
      indication: "Acute bacterial sinusitis"
    }
  ];

  const sampleLabTimeline = [
    {
      biomarker: "WBC",
      unit: "x10^9/L",
      values: [
        { t: "2015-08-10T11:00:00", value: 7.5 },
        { t: "2016-02-20T09:30:00", value: 6.8 },
        { t: "2018-09-05T10:00:00", value: 7.2 },
        { t: "2025-06-15T10:30:00", value: 6.5 },
        { t: "2025-06-21T14:00:00", value: 5.0 }
      ]
    },
    {
      biomarker: "Hemoglobin",
      unit: "g/dL",
      values: [
        { t: "2015-08-10T11:00:00", value: 14.5 },
        { t: "2018-09-05T10:00:00", value: 14.0 }
      ]
    },
    {
      biomarker: "Platelets",
      unit: "x10^9/L",
      values: [
        { t: "2015-08-10T11:00:00", value: 270 },
        { t: "2018-09-05T10:00:00", value: 250 }
      ]
    },
    {
      biomarker: "ALT",
      unit: "U/L",
      values: [
        { t: "2018-09-05T10:00:00", value: 35 },
        { t: "2025-06-15T10:30:00", value: 1520 },
        { t: "2025-06-21T14:00:00", value: 1380 }
      ]
    },
    {
      biomarker: "AST",
      unit: "U/L",
      values: [
        { t: "2015-09-05T10:00:00", value: 32 },
        { t: "2018-06-15T10:30:00", value: 1380 },
        { t: "2025-06-21T14:00:00", value: 1200 }
      ]
    },
    {
      biomarker: "Alkaline Phosphatase",
      unit: "U/L",
      values: [
        { t: "2018-09-05T10:00:00", value: 110 },
        { t: "2025-06-15T10:30:00", value: 130 }
      ]
    },
    {
      biomarker: "Total Bilirubin",
      unit: "mg/dL",
      values: [
        { t: "2018-09-05T10:00:00", value: 0.9 },
        { t: "2025-06-15T10:30:00", value: 8.4 }
      ]
    }
  ];

  // Base positions for invisible connectors (relative to timeline-1's initial position)
  const timelineBasePosition = { x: 100, y: 100 };
  const invisibleConnector1Offset = { x: 412, y: 373 }; // Relative to timeline-1
  const invisibleConnector2Offset = { x: 1085, y: 1028 }; // Relative to timeline-1
  
  const initialNodes: Node[] = [
    {
      id: 'timeline-1',
      type: 'timeline',
      position: timelineBasePosition,
      data: {
        encounters: sampleEncounters,
        medicationTimeline: sampleMedicationTimeline,
        labTimeline: sampleLabTimeline
      },
      draggable: false
    },
    // Invisible connector nodes - will move with timeline-1
    {
      id: 'invisible-connector-1',
      type: 'invisible',
      position: { 
        x: timelineBasePosition.x + invisibleConnector1Offset.x, 
        y: timelineBasePosition.y + invisibleConnector1Offset.y 
      },
      data: { 
        highlighted: showInvisibleConnections,
        componentType: 'encounter',
        encounterDate: '2016-02-20',
        encounterNo: 2,
        description: 'Feb 20, 2016 Encounter Connection Point'
      },
      draggable: false,
      selectable: false,
    },
    {
      id: 'invisible-connector-2',
      type: 'invisible',
      position: { 
        x: timelineBasePosition.x + invisibleConnector2Offset.x, 
        y: timelineBasePosition.y + invisibleConnector2Offset.y 
      },
      data: { 
        highlighted: showInvisibleConnections,
        componentType: 'labTimeline',
        biomarker: 'ALT',
        description: 'ALT Lab Timeline Connection Point'
      },
      draggable: false,
      selectable: false,
    },
    // New Chronomed Timeline Node - Full size render
    {
      id: 'chronomed-1',
      type: 'chronomed',
      position: { x: 100, y: 1600 },
      data: { label: 'Chronomed Timeline' },
      draggable: true,
      style: {
        width: 2400,
        height: 2000,
      }
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
    timeline: TimelineNode,
    invisible: InvisibleNode,
  }), []);

  // Toggle invisible connections
  const toggleInvisibleConnections = useCallback(() => {
    const newShowInvisible = !showInvisibleConnections;
    const newShowingConnection = !showingConnection;
    
    setShowInvisibleConnections(newShowInvisible);
    setShowingConnection(newShowingConnection);
    
    // Update invisible nodes to show highlight
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'invisible') {
          return {
            ...node,
            data: { ...node.data, highlighted: newShowInvisible },
          };
        }
        if (node.type === 'timeline') {
          return {
            ...node,
            data: {
              ...node.data,
              showingConnection: newShowingConnection,
              highlightEncounterNo: newShowingConnection ? 2 : undefined,
              highlightBiomarker: newShowingConnection ? 'ALT' : undefined,
            },
          };
        }
        return node;
      })
    );

    // Add or remove invisible connection edges
    if (newShowInvisible) {
      const invisibleEdges: Edge[] = [
        {
          id: 'e-invisible-1-2',
          source: 'invisible-connector-1',
          target: 'invisible-connector-2',
          animated: true,
          style: {
            stroke: '#ef4444',
            strokeWidth: 4,
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))',
          },
          zIndex: 9999,
        },
      ];
      setEdges((eds) => [...eds, ...invisibleEdges]);
    } else {
      setEdges((eds) =>
        eds.filter((edge) => !edge.id.includes('invisible'))
      );
    }
  }, [showInvisibleConnections, showingConnection, setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlowWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#e5e7eb"
          />
        </ReactFlow>
      </ReactFlowWrapper>
      

      
      {/* Info Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(103, 126, 234, 0.15)',
        border: '2px solid rgba(103, 126, 234, 0.2)',
        zIndex: 1000,
        fontSize: '14px',
        fontWeight: 600,
        color: '#667eea'
      }}>
        Medication Timeline View
      </div>

      {/* Invisible Connector Button */}
      <ConnectorButton 
        onClick={toggleInvisibleConnections}
        isActive={showingConnection}
      >
        {showingConnection ? '✕ Exit Focus Mode' : 'Show Casual Links'}
      </ConnectorButton>
    </div>
  );
}

export default Canvas4;
