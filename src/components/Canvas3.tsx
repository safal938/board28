import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  NodeProps,
} from 'reactflow';
import styled from 'styled-components';
import 'reactflow/dist/style.css';
import { Dashboard } from './chronomed/Dashboard';

const ReactFlowWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  .react-flow__node.selected {
    .react-flow__node-default,
    & > div {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(0, 0, 0, 0.2) !important;
    }
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

function Canvas3() {
  const initialNodes: Node[] = [
    {
      id: 'dashboard-1',
      type: 'dashboard',
      position: { x: 100, y: 100 },
      data: { label: 'Chronomed Dashboard' },
      draggable: true,
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({
    dashboard: DashboardNode,
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
        </ReactFlow>
      </ReactFlowWrapper>
    </div>
  );
}

export default Canvas3;
