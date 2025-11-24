import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Edit2, Save, X, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, CheckCircle, XCircle, Clock, Plus, Trash2 } from 'lucide-react';

// Styled Components
const ViewContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ViewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const ViewTitle = styled.h2`
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

const ActionButton = styled.button<{ variant?: string }>`
  padding: 6px 14px;
  border: 1px solid ${props => props.variant === 'primary' ? '#1E88E5' : '#dadce0'};
  background: ${props => props.variant === 'primary' ? '#1E88E5' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#5f6368'};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#1976D2' : '#f8f9fa'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ViewSection = styled.div`
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  max-width: 2200px;
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

const ViewSectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #667eea;
    width: 20px;
    height: 20px;
  }
`;

const ViewText = styled.div`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.8;
  white-space: pre-wrap;

  strong {
    color: #1a202c;
    font-weight: 600;
  }
`;

const ViewList = styled.ul`
  margin: 0;
  padding-left: 24px;
  list-style: none;
`;

const ViewListItem = styled.li`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.8;
  margin-bottom: 8px;
  position: relative;
  padding-left: 8px;

  &:before {
    content: "•";
    color: #667eea;
    font-weight: bold;
    font-size: 18px;
    position: absolute;
    left: -16px;
  }
`;

const HighlightBox = styled.div`
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`;

const LabTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
`;

const LabTableHeader = styled.th`
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
`;

const LabTableCell = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
`;

const LabTableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const FlagBadge = styled.span<{ flag: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.flag === 'High' ? '#fee2e2' : props.flag === 'Low' ? '#dbeafe' : '#f3f4f6'};
  color: ${props => props.flag === 'High' ? '#991b1b' : props.flag === 'Low' ? '#1e40af' : '#374151'};
`;

const StatusCard = styled.div<{ status: string }>`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid ${props => 
    props.status === 'PRIMARY' ? '#10b981' :
    props.status === 'INVESTIGATE' ? '#f59e0b' :
    props.status === 'PENDING' ? '#3b82f6' :
    props.status === 'RULED OUT' ? '#6b7280' :
    '#667eea'
  };
  background: white;
  border: 1px solid #e0e0e0;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  background: ${props => 
    props.status === 'PRIMARY' ? '#10b981' :
    props.status === 'INVESTIGATE' ? '#f59e0b' :
    props.status === 'PENDING' ? '#3b82f6' :
    props.status === 'RULED OUT' ? '#6b7280' :
    '#667eea'
  };
  color: white;
`;

const CriterionCard = styled.div<{ met: boolean }>`
  padding: 14px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 3px solid ${props => props.met ? '#10b981' : '#f59e0b'};
  background: white;
  border: 1px solid #e0e0e0;
`;

const Input = styled.input`
  display: block;
  width: 100% !important;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 8px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  display: block;
  width: 100% !important;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  margin-bottom: 8px;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
`;

interface DiagnosticReportProps {
  onEdit?: () => void;
  onSave?: (data: any) => void;
  diagnosticData?: {
    patientInformation?: {
      name?: string;
      mrn?: string;
      dateOfBirth?: string;
      age?: number;
      sex?: string;
    };
    presentingComplaint?: string;
    medicalHistory?: {
      conditions?: string[];
      allergies?: string[];
      socialHistory?: string;
    };
    medications?: {
      chronicPriorToEvent?: string[];
      initiatedAtAcuteEvent?: string;
    };
    keyLaboratoryFindings?: {
      encounterDate?: string;
      results?: Array<{
        test: string;
        value: string;
        flag?: string;
        reference: string;
        note?: string;
      }>;
    };
    diagnosis?: {
      main?: string;
      causality?: string;
      mechanism?: string;
    };
    differentialDiagnosisTracker?: {
      diagnoses?: Array<{
        name: string;
        status: string;
        notes: string;
      }>;
      ruledOut?: Array<{
        name: string;
        status: string;
        notes: string;
      }>;
    };
    easlAssessment?: {
      overallImpression?: string;
      diliDiagnosticCriteriaMet?: Array<{
        criterion: string;
        status: string;
        details: string;
      }>;
      causativeAgentAssessment?: Array<{
        agent: string;
        role: string;
        rationale: string;
      }>;
      severityAssessment?: {
        overallSeverity?: string;
        features?: string[];
        prognosisNote?: string;
      };
      exclusionOfAlternativeCausesRequired?: string[];
      localGuidelinesComparison?: {
        status?: string;
        details?: string;
      };
      references?: string[];
    };
  };
}

const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ diagnosticData, onEdit, onSave }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(diagnosticData || {});

  // Update formData when diagnosticData changes from props
  React.useEffect(() => {
    if (diagnosticData) {
      setFormData(diagnosticData);
    }
  }, [diagnosticData]);

  const handleEditClick = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setFormData(diagnosticData || {});
    setIsEditing(false);
  };

  const handleChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const parts = path.split('.');
      let current = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayChange = (path: string, value: string) => {
    // Split by newline to create array
    const array = value.split('\n').filter(item => item.trim() !== '');
    handleChange(path, array);
  };

  if (!diagnosticData && !isEditing) {
    return <div>No diagnostic data available</div>;
  }

  return (
    <ViewContainer ref={documentRef} data-print-content>
      <ViewHeader>
        <ViewTitle>
          <FileText size={28} />
          Diagnostic Report
        </ViewTitle>
        <ActionButtons>
          {isEditing ? (
            <>
              <ActionButton onClick={handleCancelClick}>
                <X />
                Cancel
              </ActionButton>
              <ActionButton variant="primary" onClick={handleSaveClick}>
                <Save />
                Save
              </ActionButton>
            </>
          ) : (
            <ActionButton onClick={handleEditClick}>
              <Edit2 />
              Edit
            </ActionButton>
          )}
        </ActionButtons>
      </ViewHeader>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          {/* Patient Information */}
          {(formData.patientInformation || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <User />
                Patient Information
              </ViewSectionTitle>
              {isEditing ? (
                <>
                  <Label>Name</Label>
                  <Input value={formData.patientInformation?.name || ''} onChange={(e) => handleChange('patientInformation.name', e.target.value)} />
                  <Label>MRN</Label>
                  <Input value={formData.patientInformation?.mrn || ''} onChange={(e) => handleChange('patientInformation.mrn', e.target.value)} />
                  <Label>Date of Birth</Label>
                  <Input value={formData.patientInformation?.dateOfBirth || ''} onChange={(e) => handleChange('patientInformation.dateOfBirth', e.target.value)} />
                  <Label>Age</Label>
                  <Input type="number" value={formData.patientInformation?.age || ''} onChange={(e) => handleChange('patientInformation.age', parseInt(e.target.value))} />
                  <Label>Sex</Label>
                  <Input value={formData.patientInformation?.sex || ''} onChange={(e) => handleChange('patientInformation.sex', e.target.value)} />
                </>
              ) : (
                <ViewText>
                  <strong>Name:</strong> {formData.patientInformation?.name}<br/>
                  <strong>MRN:</strong> {formData.patientInformation?.mrn}<br/>
                  <strong>Date of Birth:</strong> {formData.patientInformation?.dateOfBirth}<br/>
                  <strong>Age:</strong> {formData.patientInformation?.age} years<br/>
                  <strong>Sex:</strong> {formData.patientInformation?.sex}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Presenting Complaint */}
          {(formData.presentingComplaint || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Presenting Complaint
              </ViewSectionTitle>
              {isEditing ? (
                <TextArea 
                  value={formData.presentingComplaint || ''} 
                  onChange={(e) => handleChange('presentingComplaint', e.target.value)} 
                />
              ) : (
                <ViewText>{formData.presentingComplaint}</ViewText>
              )}
            </ViewSection>
          )}

          {/* Medical History */}
          {(formData.medicalHistory || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Medical History
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Conditions (one per line)</Label>
                  <TextArea 
                    value={(formData.medicalHistory?.conditions || []).join('\n')} 
                    onChange={(e) => handleArrayChange('medicalHistory.conditions', e.target.value)} 
                  />
                  <Label>Allergies (one per line)</Label>
                  <TextArea 
                    value={(formData.medicalHistory?.allergies || []).join('\n')} 
                    onChange={(e) => handleArrayChange('medicalHistory.allergies', e.target.value)} 
                  />
                  <Label>Social History</Label>
                  <TextArea 
                    value={formData.medicalHistory?.socialHistory || ''} 
                    onChange={(e) => handleChange('medicalHistory.socialHistory', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.medicalHistory?.conditions && formData.medicalHistory.conditions.length > 0 && (
                    <>
                      <ViewText><strong>Conditions:</strong></ViewText>
                      <ViewList>
                        {formData.medicalHistory.conditions.map((condition: string, index: number) => (
                          <ViewListItem key={index}>{condition}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.medicalHistory?.allergies && formData.medicalHistory.allergies.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Allergies:</strong></ViewText>
                      <ViewList>
                        {formData.medicalHistory.allergies.map((allergy: string, index: number) => (
                          <ViewListItem key={index}>{allergy}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.medicalHistory?.socialHistory && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Social History:</strong><br/>
                      {formData.medicalHistory.socialHistory}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Medications */}
          {(formData.medications || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Medications
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Chronic Medications (Prior to Event) (one per line)</Label>
                  <TextArea 
                    value={(formData.medications?.chronicPriorToEvent || []).join('\n')} 
                    onChange={(e) => handleArrayChange('medications.chronicPriorToEvent', e.target.value)} 
                  />
                  <Label>Initiated at Acute Event</Label>
                  <TextArea 
                    value={formData.medications?.initiatedAtAcuteEvent || ''} 
                    onChange={(e) => handleChange('medications.initiatedAtAcuteEvent', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.medications?.chronicPriorToEvent && formData.medications.chronicPriorToEvent.length > 0 && (
                    <>
                      <ViewText><strong>Chronic Medications (Prior to Event):</strong></ViewText>
                      <ViewList>
                        {formData.medications.chronicPriorToEvent.map((med: string, index: number) => (
                          <ViewListItem key={index}>{med}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.medications?.initiatedAtAcuteEvent && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Initiated at Acute Event:</strong><br/>
                      {formData.medications.initiatedAtAcuteEvent}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Key Laboratory Findings */}
          {(formData.keyLaboratoryFindings || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Key Laboratory Findings
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Encounter Date</Label>
                  <Input 
                    value={formData.keyLaboratoryFindings?.encounterDate || ''} 
                    onChange={(e) => handleChange('keyLaboratoryFindings.encounterDate', e.target.value)} 
                  />
                  {/* Note: Editing complex array of objects like lab results is simplified here or would require more complex UI */}
                  <ViewText style={{ fontStyle: 'italic', color: '#666' }}>
                    Detailed lab result editing is not supported in this quick edit view.
                  </ViewText>
                </>
              ) : (
                <>
                  {formData.keyLaboratoryFindings?.encounterDate && (
                    <ViewText style={{ marginBottom: '16px' }}>
                      <strong>Encounter Date:</strong> {formData.keyLaboratoryFindings.encounterDate}
                    </ViewText>
                  )}
                  
                  {formData.keyLaboratoryFindings?.results && formData.keyLaboratoryFindings.results.length > 0 && (
                    <LabTable>
                      <thead>
                        <tr>
                          <LabTableHeader>Test</LabTableHeader>
                          <LabTableHeader>Value</LabTableHeader>
                          <LabTableHeader>Flag</LabTableHeader>
                          <LabTableHeader>Reference</LabTableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.keyLaboratoryFindings.results.map((result: any, index: number) => (
                          <LabTableRow key={index}>
                            <LabTableCell><strong>{result.test}</strong></LabTableCell>
                            <LabTableCell>{result.value}</LabTableCell>
                            <LabTableCell>
                              {result.flag && <FlagBadge flag={result.flag}>{result.flag}</FlagBadge>}
                            </LabTableCell>
                            <LabTableCell>
                              {result.reference}
                              {result.note && (
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                  Note: {result.note}
                                </div>
                              )}
                            </LabTableCell>
                          </LabTableRow>
                        ))}
                      </tbody>
                    </LabTable>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Differential Diagnosis Tracker */}
          {(formData.differentialDiagnosisTracker || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Differential Diagnosis Tracker
              </ViewSectionTitle>
              
              {isEditing ? (
                <ViewText style={{ fontStyle: 'italic', color: '#666' }}>
                  Differential diagnosis tracking editing is not supported in this quick edit view.
                </ViewText>
              ) : (
                <>
                  {formData.differentialDiagnosisTracker?.diagnoses && formData.differentialDiagnosisTracker.diagnoses.length > 0 && (
                    <>
                      <ViewText style={{ marginBottom: '12px' }}><strong>Active Diagnoses:</strong></ViewText>
                      {formData.differentialDiagnosisTracker.diagnoses.map((diagnosis: any, index: number) => (
                        <StatusCard key={index} status={diagnosis.status}>
                          <StatusBadge status={diagnosis.status}>
                            {diagnosis.status === 'PRIMARY' && <CheckCircle size={14} />}
                            {diagnosis.status === 'INVESTIGATE' && <AlertCircle size={14} />}
                            {diagnosis.status === 'PENDING' && <Clock size={14} />}
                            {diagnosis.status}
                          </StatusBadge>
                          <ViewText>
                            <strong>{diagnosis.name}</strong><br/>
                            {diagnosis.notes}
                          </ViewText>
                        </StatusCard>
                      ))}
                    </>
                  )}
                  
                  {formData.differentialDiagnosisTracker?.ruledOut && formData.differentialDiagnosisTracker.ruledOut.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '20px', marginBottom: '12px' }}><strong>Ruled Out:</strong></ViewText>
                      {formData.differentialDiagnosisTracker.ruledOut.map((diagnosis: any, index: number) => (
                        <StatusCard key={index} status={diagnosis.status}>
                          <StatusBadge status={diagnosis.status}>
                            <XCircle size={14} />
                            {diagnosis.status}
                          </StatusBadge>
                          <ViewText>
                            <strong>{diagnosis.name}</strong><br/>
                            {diagnosis.notes}
                          </ViewText>
                        </StatusCard>
                      ))}
                    </>
                  )}
                </>
              )}
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Diagnosis */}
          {(formData.diagnosis || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Diagnosis
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Main Diagnosis</Label>
                  <TextArea 
                    value={formData.diagnosis?.main || ''} 
                    onChange={(e) => handleChange('diagnosis.main', e.target.value)} 
                  />
                  <Label>Causality</Label>
                  <TextArea 
                    value={formData.diagnosis?.causality || ''} 
                    onChange={(e) => handleChange('diagnosis.causality', e.target.value)} 
                  />
                  <Label>Mechanism</Label>
                  <TextArea 
                    value={formData.diagnosis?.mechanism || ''} 
                    onChange={(e) => handleChange('diagnosis.mechanism', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.diagnosis?.main && (
                    <HighlightBox>
                      <ViewText><strong>Main Diagnosis:</strong><br/>{formData.diagnosis.main}</ViewText>
                    </HighlightBox>
                  )}
                  
                  {formData.diagnosis?.causality && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Causality:</strong><br/>
                      {formData.diagnosis.causality}
                    </ViewText>
                  )}
                  
                  {formData.diagnosis?.mechanism && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Mechanism:</strong><br/>
                      {formData.diagnosis.mechanism}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* EASL Assessment */}
          {(formData.easlAssessment || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                EASL Assessment
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Overall Impression</Label>
                  <TextArea 
                    value={formData.easlAssessment?.overallImpression || ''} 
                    onChange={(e) => handleChange('easlAssessment.overallImpression', e.target.value)} 
                  />
                  <Label>Overall Severity</Label>
                  <Input 
                    value={formData.easlAssessment?.severityAssessment?.overallSeverity || ''} 
                    onChange={(e) => handleChange('easlAssessment.severityAssessment.overallSeverity', e.target.value)} 
                  />
                  <Label>Prognosis Note</Label>
                  <TextArea 
                    value={formData.easlAssessment?.severityAssessment?.prognosisNote || ''} 
                    onChange={(e) => handleChange('easlAssessment.severityAssessment.prognosisNote', e.target.value)} 
                  />
                  <Label>Exclusion of Alternative Causes Required (one per line)</Label>
                  <TextArea 
                    value={(formData.easlAssessment?.exclusionOfAlternativeCausesRequired || []).join('\n')} 
                    onChange={(e) => handleArrayChange('easlAssessment.exclusionOfAlternativeCausesRequired', e.target.value)} 
                  />

                  <Label style={{ marginTop: '16px', marginBottom: '8px' }}>DILI Diagnostic Criteria</Label>
                  {(formData.easlAssessment?.diliDiagnosticCriteriaMet || []).map((criterion: any, index: number) => (
                    <div key={index} style={{ 
                      padding: '12px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      marginBottom: '12px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Criterion #{index + 1}</span>
                        <button 
                          onClick={() => handleRemoveArrayItem('easlAssessment.diliDiagnosticCriteriaMet', index)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <Label>Criterion</Label>
                      <Input 
                        value={criterion.criterion || ''} 
                        onChange={(e) => handleNestedArrayChange('easlAssessment.diliDiagnosticCriteriaMet', index, 'criterion', e.target.value)} 
                      />
                      
                      <Label>Status</Label>
                      <select
                        value={criterion.status || ''}
                        onChange={(e) => handleNestedArrayChange('easlAssessment.diliDiagnosticCriteriaMet', index, 'status', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          marginBottom: '8px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="MET">MET</option>
                        <option value="NOT MET">NOT MET</option>
                      </select>
                      
                      <Label>Details</Label>
                      <TextArea 
                        value={criterion.details || ''} 
                        onChange={(e) => handleNestedArrayChange('easlAssessment.diliDiagnosticCriteriaMet', index, 'details', e.target.value)} 
                      />
                    </div>
                  ))}
                  
                  <button
                    onClick={() => handleAddArrayItem('easlAssessment.diliDiagnosticCriteriaMet', { criterion: '', status: 'MET', details: '' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      background: '#f0f9ff',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '24px'
                    }}
                  >
                    <Plus size={14} />
                    Add Criterion
                  </button>

                  <Label style={{ marginBottom: '8px' }}>Causative Agent Assessment</Label>
                  {(formData.easlAssessment?.causativeAgentAssessment || []).map((agent: any, index: number) => (
                    <div key={index} style={{ 
                      padding: '12px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      marginBottom: '12px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Agent #{index + 1}</span>
                        <button 
                          onClick={() => handleRemoveArrayItem('easlAssessment.causativeAgentAssessment', index)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <Label>Agent</Label>
                      <Input 
                        value={agent.agent || ''} 
                        onChange={(e) => handleNestedArrayChange('easlAssessment.causativeAgentAssessment', index, 'agent', e.target.value)} 
                      />
                      
                      <Label>Role</Label>
                      <Input 
                        value={agent.role || ''} 
                        onChange={(e) => handleNestedArrayChange('easlAssessment.causativeAgentAssessment', index, 'role', e.target.value)} 
                      />
                      
                      <Label>Rationale</Label>
                      <TextArea 
                        value={agent.rationale || ''} 
                        onChange={(e) => handleNestedArrayChange('easlAssessment.causativeAgentAssessment', index, 'rationale', e.target.value)} 
                      />
                    </div>
                  ))}
                  
                  <button
                    onClick={() => handleAddArrayItem('easlAssessment.causativeAgentAssessment', { agent: '', role: '', rationale: '' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      background: '#f0f9ff',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '24px'
                    }}
                  >
                    <Plus size={14} />
                    Add Agent
                  </button>

                  <Label>Local Guidelines Comparison Status</Label>
                  <Input 
                    value={formData.easlAssessment?.localGuidelinesComparison?.status || ''} 
                    onChange={(e) => handleChange('easlAssessment.localGuidelinesComparison.status', e.target.value)} 
                  />
                  <Label>Local Guidelines Comparison Details</Label>
                  <TextArea 
                    value={formData.easlAssessment?.localGuidelinesComparison?.details || ''} 
                    onChange={(e) => handleChange('easlAssessment.localGuidelinesComparison.details', e.target.value)} 
                  />

                  <Label>References (one per line)</Label>
                  <TextArea 
                    value={(formData.easlAssessment?.references || []).join('\n')} 
                    onChange={(e) => handleArrayChange('easlAssessment.references', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.easlAssessment?.overallImpression && (
                    <HighlightBox>
                      <ViewText><strong>Overall Impression:</strong><br/>{formData.easlAssessment.overallImpression}</ViewText>
                    </HighlightBox>
                  )}
                  
                  {formData.easlAssessment?.diliDiagnosticCriteriaMet && formData.easlAssessment.diliDiagnosticCriteriaMet.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>DILI Diagnostic Criteria:</strong></ViewText>
                      {formData.easlAssessment.diliDiagnosticCriteriaMet.map((criterion: any, index: number) => (
                        <CriterionCard key={index} met={criterion.status === 'MET'}>
                          <ViewText>
                            <strong>{criterion.criterion}</strong><br/>
                            Status: {criterion.status}<br/>
                            {criterion.details}
                          </ViewText>
                        </CriterionCard>
                      ))}
                    </>
                  )}
                  
                  {formData.easlAssessment?.causativeAgentAssessment && formData.easlAssessment.causativeAgentAssessment.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Causative Agent Assessment:</strong></ViewText>
                      {formData.easlAssessment.causativeAgentAssessment.map((agent: any, index: number) => (
                        <ViewText key={index} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #667eea' }}>
                          <strong>{agent.agent}</strong><br/>
                          Role: {agent.role}<br/>
                          {agent.rationale}
                        </ViewText>
                      ))}
                    </>
                  )}
                  
                  {formData.easlAssessment?.severityAssessment && (
                    <>
                      <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Severity Assessment:</strong></ViewText>
                      {formData.easlAssessment.severityAssessment.overallSeverity && (
                        <ViewText style={{ marginBottom: '8px' }}>
                          <strong>Overall Severity:</strong> {formData.easlAssessment.severityAssessment.overallSeverity}
                        </ViewText>
                      )}
                      {formData.easlAssessment.severityAssessment.features && formData.easlAssessment.severityAssessment.features.length > 0 && (
                        <ViewList>
                          {formData.easlAssessment.severityAssessment.features.map((feature: string, index: number) => (
                            <ViewListItem key={index}>{feature}</ViewListItem>
                          ))}
                        </ViewList>
                      )}
                      {formData.easlAssessment.severityAssessment.prognosisNote && (
                        <HighlightBox style={{ marginTop: '12px' }}>
                          <ViewText><strong>Prognosis:</strong><br/>{formData.easlAssessment.severityAssessment.prognosisNote}</ViewText>
                        </HighlightBox>
                      )}
                    </>
                  )}
                  
                  {formData.easlAssessment?.exclusionOfAlternativeCausesRequired && formData.easlAssessment.exclusionOfAlternativeCausesRequired.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Exclusion of Alternative Causes Required:</strong></ViewText>
                      <ViewList>
                        {formData.easlAssessment.exclusionOfAlternativeCausesRequired.map((cause: string, index: number) => (
                          <ViewListItem key={index}>{cause}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.easlAssessment?.localGuidelinesComparison && (
                    <ViewText style={{ marginTop: '16px' }}>
                      <strong>Local Guidelines Comparison:</strong><br/>
                      Status: {formData.easlAssessment.localGuidelinesComparison.status}<br/>
                      {formData.easlAssessment.localGuidelinesComparison.details}
                    </ViewText>
                  )}
                  
                  {formData.easlAssessment?.references && formData.easlAssessment.references.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '16px', marginBottom: '8px' }}><strong>References:</strong></ViewText>
                      <ViewList>
                        {formData.easlAssessment.references.map((ref: string, index: number) => (
                          <ViewListItem key={index} style={{ fontSize: '13px' }}>{ref}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                </>
              )}
            </ViewSection>
          )}
        </RightColumn>
      </TwoColumnLayout>
    </ViewContainer>
  );
};

export default DiagnosticReport;
