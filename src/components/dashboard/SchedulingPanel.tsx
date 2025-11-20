import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, AlertCircle, Activity } from 'lucide-react';

const Card = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f7faff 0%, #eef5ff 100%);
  border-bottom: 1px solid #e6eefb;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1e3a8a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex-grow: 1;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #334155;
`;

const Label = styled.span`
  font-weight: 600;
  color: #475569;
  min-width: 80px;
`;

const Value = styled.span`
  color: #1e293b;
  flex: 1;
`;

const StatusChip = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &.pending {
    background: #fff7ed;
    color: #c2410c;
    border: 1px solid #ffedd5;
  }
  
  &.confirmed {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #dcfce7;
  }

  &.routine {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #334155;
`;

const ItemMeta = styled.div`
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #475569;
  
  li {
    margin-bottom: 4px;
  }
`;

const CorrespondencePreview = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 8px;
  border-radius: 4px;
  color: #1e40af;
  line-height: 1.4;
`;

interface SchedulingPanelProps {
  title?: string;
  patientId?: string;
  currentStatus?: string;
  schedulingContext?: {
    nextAvailableSlot?: {
      date: string;
      provider: string;
      clinicType: string;
      location: string;
      wait_time: string;
    };
    outstandingInvestigations?: Array<{
      id: string;
      name: string;
      status: string;
      priority: string;
      notes: string;
    }>;
    bookingAction?: {
      status: string;
      lastUpdated: string;
      actionsTaken: string[];
      correspondencePreview: string;
    };
  };
}

const SchedulingPanel: React.FC<SchedulingPanelProps> = ({ 
  title = "Scheduling Panel", 
  patientId, 
  currentStatus, 
  schedulingContext 
}) => {
  if (!schedulingContext) return <Card><Body>No scheduling context available</Body></Card>;

  const { nextAvailableSlot, outstandingInvestigations, bookingAction } = schedulingContext;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
    });
  };

  return (
    <Card>
      <Header>
        <Title>
          <Calendar size={16} />
          {title}
        </Title>
        <StatusChip className="routine">
          <User size={12} />
          {patientId}
        </StatusChip>
      </Header>
      
      <Body>
        {/* Patient Status */}
        {currentStatus && (
          <div style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} />
            Current Status: <strong style={{ color: '#0f172a' }}>{currentStatus}</strong>
          </div>
        )}

        {/* Next Available Slot */}
        {nextAvailableSlot && (
          <Section>
            <SectionTitle>
              <Clock size={14} /> Next Available Slot
            </SectionTitle>
            <InfoCard>
              <InfoRow>
                <Label>Date:</Label>
                <Value style={{ fontWeight: 600, color: '#2563eb' }}>{formatDate(nextAvailableSlot.date)}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Provider:</Label>
                <Value>{nextAvailableSlot.provider}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Clinic:</Label>
                <Value>{nextAvailableSlot.clinicType}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Location:</Label>
                <Value style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {nextAvailableSlot.location}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>Wait Time:</Label>
                <Value style={{ color: '#d97706' }}>{nextAvailableSlot.wait_time}</Value>
              </InfoRow>
            </InfoCard>
          </Section>
        )}

        {/* Outstanding Investigations */}
        {outstandingInvestigations && outstandingInvestigations.length > 0 && (
          <Section>
            <SectionTitle>
              <FileText size={14} /> Outstanding Investigations
            </SectionTitle>
            <List>
              {outstandingInvestigations.map((inv) => (
                <ListItem key={inv.id}>
                  <ItemHeader>
                    <ItemName>{inv.name}</ItemName>
                    <StatusChip className={inv.status === 'Pending Request' ? 'pending' : 'routine'}>
                      {inv.status}
                    </StatusChip>
                  </ItemHeader>
                  <ItemMeta>
                    <span>Priority: {inv.priority}</span>
                  </ItemMeta>
                  {inv.notes && (
                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      "{inv.notes}"
                    </div>
                  )}
                </ListItem>
              ))}
            </List>
          </Section>
        )}

        {/* Booking Action */}
        {bookingAction && (
          <Section>
            <SectionTitle>
              <CheckCircle size={14} /> Booking Action
            </SectionTitle>
            <InfoCard style={{ background: '#f0fdf4', borderColor: '#dcfce7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <StatusChip className="confirmed">
                  {bookingAction.status}
                </StatusChip>
                <span style={{ fontSize: '10px', color: '#64748b' }}>
                  Updated: {new Date(bookingAction.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
              
              <Label style={{ fontSize: '12px', marginBottom: '4px' }}>Actions Taken:</Label>
              <ActionList>
                {bookingAction.actionsTaken.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ActionList>

              {bookingAction.correspondencePreview && (
                <div style={{ marginTop: '8px' }}>
                  <Label style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>Correspondence:</Label>
                  <CorrespondencePreview>
                    {bookingAction.correspondencePreview}
                  </CorrespondencePreview>
                </div>
              )}
            </InfoCard>
          </Section>
        )}
      </Body>
    </Card>
  );
};

export default SchedulingPanel;
