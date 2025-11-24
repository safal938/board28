import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle, AlertCircle, FileText, Shield, Brain, MessageSquare, BookOpen, Flag, Stethoscope, Users, FileCheck, AlertTriangle, ChevronDown, ChevronUp, Edit, Save, X } from 'lucide-react';
import formQuestions from '../data/legal_form_question.json';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #667eea;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 6px 14px;
  border: 1px solid ${props => props.variant === 'primary' ? '#667eea' : props.variant === 'danger' ? '#ef4444' : '#dadce0'};
  background: ${props => props.variant === 'primary' ? '#667eea' : props.variant === 'danger' ? '#ef4444' : 'white'};
  color: ${props => props.variant === 'primary' || props.variant === 'danger' ? 'white' : '#5f6368'};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#5568d3' : props.variant === 'danger' ? '#dc2626' : '#f8f9fa'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;



const PatientInfoSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const InfoItem = styled.div`
  font-size: 15px;
  color: #2d3748;
  
  strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 2000px;
  margin: 0 auto;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div<{ isExpanded: boolean }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background: #f0f0f0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #667eea;
    width: 20px;
    height: 20px;
  }
`;

const SectionContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '3000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${props => props.isExpanded ? '24px' : '0 24px'};
  background: white;
`;

const FormItem = styled.div<{ isHighlighted?: boolean }>`
  padding: 16px;
  border-radius: 6px;
  background: ${props => props.isHighlighted ? '#fffbeb' : '#fafafa'};
  border: 1px solid ${props => props.isHighlighted ? '#fbbf24' : '#e0e0e0'};
  border-left: 3px solid ${props => props.isHighlighted ? '#f59e0b' : '#667eea'};
  margin-bottom: 12px;
  transition: all 0.2s ease;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FormTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormId = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;

const FormTitle = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #1a202c;
`;

const StatusBadge = styled.div<{ status: boolean | null }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.status === true ? '#d1fae5' : 
    props.status === false ? '#fee2e2' : 
    '#fef3c7'};
  color: ${props => 
    props.status === true ? '#065f46' : 
    props.status === false ? '#991b1b' : 
    '#92400e'};
  border: 1px solid ${props => 
    props.status === true ? '#10b981' : 
    props.status === false ? '#ef4444' : 
    '#fbbf24'};
`;

const Notes = styled.div`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.8;
  white-space: pre-wrap;
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 15px;
  color: #2d3748;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 15px;
  color: #2d3748;
  font-family: inherit;
  line-height: 1.8;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FlagItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 3px solid #10b981;
`;

const FlagContent = styled.div`
  flex: 1;
`;

const FlagTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
  font-size: 15px;
`;

const FlagNotes = styled.div`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.7;
`;

const DiagnosisBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
`;

const DiagnosisLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DiagnosisText = styled.div`
  font-size: 15px;
  color: #1a202c;
  line-height: 1.7;
  font-weight: 600;
`;

const SignatureSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8e8e8;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;
`;

const SignatureBox = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 2px dashed #d1d5db;
`;

const SignatureLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const SignatureValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  font-family: 'Brush Script MT', cursive;
`;


interface LegalComplianceProps {
  data: any;
  onSave?: (updatedData: any) => void;
}

const LegalCompliance: React.FC<LegalComplianceProps> = ({ data, onSave }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    identification_verification: true,
    compliant_consent: true,
    mental_capacity: true,
    duty_candour: true,
    guideline_adherence: true,
    red_flags_diagnosis: true,
    procedural: true,
    safety_net: true,
    communication: true,
    attendance: true,
    practitioner: true,
    incident: true,
  });

  const documentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  // Sync editedData when data prop changes (e.g., after save)
  useEffect(() => {
    if (!isEditing) {
      setEditedData(data);
    }
  }, [data, isEditing]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(data);
  };

  const handleSave = () => {
    if (onSave && editedData) {
      onSave(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(data);
  };

  const updateField = (path: string[], value: any) => {
    setEditedData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const getSectionIcon = (sectionKey: string) => {
    const icons: { [key: string]: any } = {
      identification_verification: FileText,
      compliant_consent: Shield,
      mental_capacity: Brain,
      duty_candour: MessageSquare,
      guideline_adherence: BookOpen,
      red_flags_diagnosis: Flag,
      procedural: Stethoscope,
      safety_net: AlertTriangle,
      communication: Users,
      attendance: FileCheck,
      practitioner: Users,
      incident: AlertCircle,
    };
    return icons[sectionKey] || FileText;
  };

  const getSectionTitle = (sectionKey: string) => {
    const titles: { [key: string]: string } = {
      identification_verification: 'Identification Verification',
      compliant_consent: 'Compliant Consent',
      mental_capacity: 'Mental Capacity',
      duty_candour: 'Duty of Candour',
      guideline_adherence: 'Guideline Adherence',
      red_flags_diagnosis: 'Red Flags & Diagnosis',
      procedural: 'Procedural Compliance',
      safety_net: 'Safety Net',
      communication: 'Communication',
      attendance: 'Attendance',
      practitioner: 'Practitioner',
      incident: 'Incident Reporting',
    };
    return titles[sectionKey] || sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderStatusIcon = (status: boolean | null) => {
    if (status === true) return <CheckCircle size={16} />;
    if (status === false) return <XCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  const getFormTitle = (formId: string): string => {
    return (formQuestions as any)[formId] || formId;
  };

  const displayData = isEditing ? editedData : data;

  const renderSection = (sectionKey: string, sectionData: any) => {
    if (sectionKey === 'red_flags_diagnosis') {
      return (
        <Section key={sectionKey} isExpanded={expandedSections[sectionKey]}>
          <SectionHeader onClick={() => toggleSection(sectionKey)}>
            <SectionTitle>
              {React.createElement(getSectionIcon(sectionKey), { size: 20 })}
              {getSectionTitle(sectionKey)}
            </SectionTitle>
            {expandedSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </SectionHeader>
          <SectionContent isExpanded={expandedSections[sectionKey]}>
            {sectionData.flag_list?.map((flag: any, index: number) => (
              <FlagItem key={index}>
                <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <FlagContent>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <EditableInput
                        value={flag.flag || ''}
                        onChange={(e) => {
                          const updated = [...(sectionData.flag_list || [])];
                          updated[index] = { ...updated[index], flag: e.target.value };
                          updateField([sectionKey, 'flag_list'], updated);
                        }}
                        placeholder="Flag title"
                      />
                      <EditableTextarea
                        value={flag.notes || ''}
                        onChange={(e) => {
                          const updated = [...(sectionData.flag_list || [])];
                          updated[index] = { ...updated[index], notes: e.target.value };
                          updateField([sectionKey, 'flag_list'], updated);
                        }}
                        placeholder="Flag notes"
                      />
                    </div>
                  ) : (
                    <>
                      <FlagTitle>{flag.flag}</FlagTitle>
                      <FlagNotes>{flag.notes}</FlagNotes>
                    </>
                  )}
                </FlagContent>
              </FlagItem>
            ))}
            
            {sectionData.diagnosis && (
              <DiagnosisBox>
                <DiagnosisLabel>Final Diagnosis</DiagnosisLabel>
                {isEditing ? (
                  <EditableTextarea
                    value={sectionData.diagnosis || ''}
                    onChange={(e) => updateField([sectionKey, 'diagnosis'], e.target.value)}
                    placeholder="Final diagnosis"
                  />
                ) : (
                  <DiagnosisText>{sectionData.diagnosis}</DiagnosisText>
                )}
              </DiagnosisBox>
            )}
          </SectionContent>
        </Section>
      );
    }

    if (sectionKey === 'signature') {
      return null; // Handled separately
    }

    if (sectionKey === 'attendance' && sectionData.checks !== undefined) {
      return (
        <Section key={sectionKey} isExpanded={expandedSections[sectionKey]}>
          <SectionHeader onClick={() => toggleSection(sectionKey)}>
            <SectionTitle>
              {React.createElement(getSectionIcon(sectionKey), { size: 20 })}
              {getSectionTitle(sectionKey)}
            </SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatusBadge status={sectionData.checks}>
                {renderStatusIcon(sectionData.checks)}
                {sectionData.checks ? 'Verified' : 'Not Verified'}
              </StatusBadge>
              {expandedSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </SectionHeader>
          <SectionContent isExpanded={expandedSections[sectionKey]}>
            {/* Empty content for attendance */}
          </SectionContent>
        </Section>
      );
    }

    const forms = sectionData.forms || [];
    if (forms.length === 0) return null;

    return (
      <Section key={sectionKey} isExpanded={expandedSections[sectionKey]}>
        <SectionHeader onClick={() => toggleSection(sectionKey)}>
          <SectionTitle>
            {React.createElement(getSectionIcon(sectionKey), { size: 20 })}
            {getSectionTitle(sectionKey)}
          </SectionTitle>
          {expandedSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </SectionHeader>
        <SectionContent isExpanded={expandedSections[sectionKey]}>
          {forms.map((form: any, index: number) => (
            <FormItem key={index} isHighlighted={form.checks === false}>
              <FormHeader>
                <FormTitleWrapper>
                  {form.form_id && (
                    <>
                      <FormId>{form.form_id}</FormId>
                      <FormTitle>{getFormTitle(form.form_id)}</FormTitle>
                    </>
                  )}
                  {!form.form_id && form.appointment && <FormId>{form.appointment}</FormId>}
                  {!form.form_id && !form.appointment && <FormId>Item {index + 1}</FormId>}
                </FormTitleWrapper>
                {form.checks !== undefined && (
                  <StatusBadge status={form.checks}>
                    {renderStatusIcon(form.checks)}
                    {form.checks === true ? 'Compliant' : form.checks === false ? 'Non-Compliant' : 'Pending'}
                  </StatusBadge>
                )}
              </FormHeader>
              {isEditing ? (
                <EditableTextarea
                  value={form.notes || ''}
                  onChange={(e) => {
                    const updated = [...forms];
                    updated[index] = { ...updated[index], notes: e.target.value };
                    updateField([sectionKey, 'forms'], updated);
                  }}
                  placeholder="Notes"
                />
              ) : (
                form.notes && <Notes>{form.notes}</Notes>
              )}
            </FormItem>
          ))}
        </SectionContent>
      </Section>
    );
  };

  // Organize sections into left and right columns
  const leftColumnSections = [
    'identification_verification',
    'compliant_consent',
    'mental_capacity',
    'duty_candour',
    'guideline_adherence',
    'practitioner',
  ];

  const rightColumnSections = [
    'red_flags_diagnosis',
    'procedural',
    'safety_net',
    'communication',
    'attendance',
    'incident',
  ];

  return (
    <Container ref={documentRef} data-print-content>
      <Header>
        <Title>
          <Shield size={28} />
          Legal Compliance Report
        </Title>
        <ActionButtons>
          {isEditing ? (
            <>
              <ActionButton variant="primary" onClick={handleSave}>
                <Save />
                Save
              </ActionButton>
              <ActionButton variant="danger" onClick={handleCancel}>
                <X />
                Cancel
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton onClick={handleEdit}>
                <Edit />
                Edit
              </ActionButton>
            </>
          )}
        </ActionButtons>
      </Header>

      {displayData.identification_verification && (
        <PatientInfoSection>
          <PatientInfoGrid>
            <InfoItem>
              <strong>Patient ID</strong>
              {isEditing ? (
                <EditableInput
                  value={displayData.identification_verification?.patient_id || ''}
                  onChange={(e) => updateField(['identification_verification', 'patient_id'], e.target.value)}
                />
              ) : (
                displayData.identification_verification?.patient_id
              )}
            </InfoItem>
            <InfoItem>
              <strong>Patient Name</strong>
              {isEditing ? (
                <EditableInput
                  value={displayData.identification_verification?.patient_name || ''}
                  onChange={(e) => updateField(['identification_verification', 'patient_name'], e.target.value)}
                />
              ) : (
                displayData.identification_verification?.patient_name
              )}
            </InfoItem>
            <InfoItem>
              <strong>Date of Birth</strong>
              {isEditing ? (
                <EditableInput
                  value={displayData.identification_verification?.dob || ''}
                  onChange={(e) => updateField(['identification_verification', 'dob'], e.target.value)}
                />
              ) : (
                displayData.identification_verification?.dob
              )}
            </InfoItem>
            <InfoItem>
              <strong>MRN</strong>
              {isEditing ? (
                <EditableInput
                  value={displayData.identification_verification?.mrn || ''}
                  onChange={(e) => updateField(['identification_verification', 'mrn'], e.target.value)}
                />
              ) : (
                displayData.identification_verification?.mrn
              )}
            </InfoItem>
          </PatientInfoGrid>
        </PatientInfoSection>
      )}

      <TwoColumnLayout>
        <LeftColumn>
          {leftColumnSections.map(sectionKey => {
            if (displayData[sectionKey]) {
              return renderSection(sectionKey, displayData[sectionKey]);
            }
            return null;
          })}
        </LeftColumn>

        <RightColumn>
          {rightColumnSections.map(sectionKey => {
            if (displayData[sectionKey]) {
              return renderSection(sectionKey, displayData[sectionKey]);
            }
            return null;
          })}
        </RightColumn>
      </TwoColumnLayout>

      {displayData.signature && (
        <SignatureSection>
          <SignatureBox>
            <SignatureLabel>Patient Signature</SignatureLabel>
            {isEditing ? (
              <EditableInput
                value={displayData.signature?.patient_signature || ''}
                onChange={(e) => updateField(['signature', 'patient_signature'], e.target.value)}
              />
            ) : (
              <SignatureValue>{displayData.signature?.patient_signature}</SignatureValue>
            )}
          </SignatureBox>
          <SignatureBox>
            <SignatureLabel>Practitioner Signature</SignatureLabel>
            {isEditing ? (
              <EditableInput
                value={displayData.signature?.practitioner_signature || ''}
                onChange={(e) => updateField(['signature', 'practitioner_signature'], e.target.value)}
              />
            ) : (
              <SignatureValue>{displayData.signature?.practitioner_signature}</SignatureValue>
            )}
          </SignatureBox>
        </SignatureSection>
      )}
    </Container>
  );
};

export default LegalCompliance;
