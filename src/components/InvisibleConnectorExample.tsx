import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import styled from 'styled-components';
import 'reactflow/dist/style.css';

// Invisible node component - just a small transparent anchor point
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
      {/* Add handles for connections */}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </InvisibleNodeContainer>
  );
}

const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Info = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
`;

function InvisibleConnectorExample() {
  const [isConnected, setIsConnected] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Initial nodes - two invisible anchor points
  const initialNodes: Node[] = [
    {
      id: 'invisible-1',
      type: 'invisible',
      position: { x: 200, y: -1200 },
      data: { label: 'Point A', highlighted: false },
    },
    {
      id: 'invisible-2',
      type: 'invisible',
      position: { x: 600, y: 400 },
      data: { label: 'Point B', highlighted: false },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Connect the invisible nodes
  const handleConnect = useCallback(() => {
    if (!isConnected) {
      const newEdge: Edge = {
        id: 'e-invisible-1-2',
        source: 'invisible-1',
        target: 'invisible-2',
        animated: true,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 3,
        },
        type: 'default',
      };
      setEdges([newEdge]);
      setIsConnected(true);
    } else {
      setEdges([]);
      setIsConnected(false);
      setIsHighlighted(false);
    }
  }, [isConnected, setEdges]);

  // Highlight the connection with animation
  const handleHighlight = useCallback(() => {
    if (isConnected) {
      setIsHighlighted(!isHighlighted);
      
      // Update nodes to show highlight
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, highlighted: !isHighlighted },
        }))
      );

      // Update edge style for highlight
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: true,
          style: {
            ...edge.style,
            stroke: !isHighlighted ? '#ef4444' : '#3b82f6',
            strokeWidth: !isHighlighted ? 4 : 3,
          },
        }))
      );
    }
  }, [isConnected, isHighlighted, setNodes, setEdges]);

  // Add a visible reference node to show the concept
  const addReferenceNode = useCallback(() => {
    const referenceNode: Node = {
      id: 'reference',
      type: 'default',
      position: { x: 400, y: 100 },
      data: { label: 'Visible Reference Node' },
      style: {
        background: '#f0f9ff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '10px',
      },
    };

    setNodes((nds) => {
      const exists = nds.find((n) => n.id === 'reference');
      if (!exists) {
        return [...nds, referenceNode];
      }
      return nds;
    });

    // Connect reference to invisible nodes
    const newEdges: Edge[] = [
      {
        id: 'e-ref-1',
        source: 'reference',
        target: 'invisible-1',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
      },
      {
        id: 'e-ref-2',
        source: 'reference',
        target: 'invisible-2',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
      },
    ];

    setEdges((eds) => [...eds, ...newEdges]);
  }, [setNodes, setEdges]);

  const nodeTypes = {
    invisible: InvisibleNode,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      <ControlPanel>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
          Invisible Node Connector
        </h3>
        
        <Info>
          Two invisible nodes are placed at fixed coordinates. 
          Use the buttons below to connect and highlight them.
        </Info>

        <Button onClick={handleConnect}>
          {isConnected ? 'Disconnect' : 'Connect Invisible Nodes'}
        </Button>

        {isConnected && (
          <Button 
            onClick={handleHighlight}
            style={{ 
              background: isHighlighted ? '#ef4444' : '#10b981' 
            }}
          >
            {isHighlighted ? 'Remove Highlight' : 'Highlight Connection'}
          </Button>
        )}

        <Button 
          onClick={addReferenceNode}
          style={{ background: '#6b7280' }}
        >
          Add Visible Reference Node
        </Button>

        <Info style={{ marginTop: '8px', fontSize: '11px' }}>
          <strong>Invisible nodes at:</strong><br />
          Point A: (200, 200)<br />
          Point B: (600, 400)
        </Info>
      </ControlPanel>
    </div>
  );
}

export default InvisibleConnectorExample;
