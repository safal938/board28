import React from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

interface EHRHubNodeProps {
  data: {
    label: string;
    count?: number;
    description?: string;
    color?: string;
  };
}

const NodeContainer = styled.div<{ $borderColor: string }>`
  background: white;
  border: 3px solid ${props => props.$borderColor};
  border-radius: 20px;
  padding: 32px 40px;
  min-width: 320px;
  box-shadow: 0 4px 16px ${props => props.$borderColor}26;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const IconContainer = styled.div<{ $bgColor: string }>`
  background: ${props => props.$bgColor};
  border-radius: 12px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SystemName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
`;

const Description = styled.div`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.4;
  width: 100%;
`;

const EHRHubNode: React.FC<EHRHubNodeProps> = ({ data }) => {
  const { label, count, description, color = '#f59e0b' } = data;

  return (
    <NodeContainer $borderColor={color}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: color, 
          width: 12, 
          height: 12,
          border: '2px solid white'
        }} 
      />
      
      <TopRow>
        <IconContainer $bgColor={color}>
          <Database size={36} color="white" strokeWidth={2.5} />
        </IconContainer>
        <SystemName>{label}</SystemName>
      </TopRow>
      
      {description && (
        <Description>{description}</Description>
      )}
      
      {count !== undefined && (
        <Description style={{ fontWeight: 600, color: '#374151' }}>
          {count} {count === 1 ? 'document' : 'documents'}
        </Description>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: color, 
          width: 12, 
          height: 12,
          border: '2px solid white'
        }} 
      />
    </NodeContainer>
  );
};

export default EHRHubNode;
