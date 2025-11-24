import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Download, Printer, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, CheckCircle, XCircle, Clock, Edit, Save, X } from 'lucide-react';

// Dynamic imports for print libraries
let jsPDF: any = null;
let html2canvas: any = null;

try {
  jsPDF = require('jspdf').jsPDF;
  html2canvas = require('html2canvas');
} catch (e) {
  console.log('Print libraries not installed. Run: npm install jspdf html2canvas');
}

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

interface DiagnosticReportProps {
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
  onSave?: (updatedData: DiagnosticReportProps['diagnosticData']) => void;
}

const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ diagnosticData, onSave }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(diagnosticData);

  const handleDownload = async () => {
    if (!jsPDF || !html2canvas) {
      alert('PDF libraries not installed. Please run: npm install jspdf html2canvas');
      return;
    }

    const element = documentRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Diagnostic_Report_${diagnosticData?.patientInformation?.name?.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(diagnosticData);
  };

  const handleSave = () => {
    if (onSave && editedData) {
      onSave(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(diagnosticData);
  };

  const updateField = (path: string[], value: any) => {
    setEditedData(prev => {
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

  if (!diagnosticData) {
    return <div>No diagnostic data available</div>;
  }

  const displayData = isEditing ? editedData : diagnosticData;

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
      </ViewHeader>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          {/* Patient Information */}
          {displayData?.patientInformation && (
            <ViewSection>
              <ViewSectionTitle>
                <User />
                Patient Information
              </ViewSectionTitle>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <strong>Name:</strong>
                    <EditableInput
                      value={displayData.patientInformation.name || ''}
                      onChange={(e) => updateField(['patientInformation', 'name'], e.target.value)}
                    />
                  </div>
                  <div>
                    <strong>MRN:</strong>
                    <EditableInput
                      value={displayData.patientInformation.mrn || ''}
                      onChange={(e) => updateField(['patientInformation', 'mrn'], e.target.value)}
                    />
                  </div>
                  <div>
                    <strong>Date of Birth:</strong>
                    <EditableInput
                      value={displayData.patientInformation.dateOfBirth || ''}
                      onChange={(e) => updateField(['patientInformation', 'dateOfBirth'], e.target.value)}
                    />
                  </div>
                  <div>
                    <strong>Age:</strong>
                    <EditableInput
                      type="number"
                      value={displayData.patientInformation.age || ''}
                      onChange={(e) => updateField(['patientInformation', 'age'], parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <strong>Sex:</strong>
                    <EditableInput
                      value={displayData.patientInformation.sex || ''}
                      onChange={(e) => updateField(['patientInformation', 'sex'], e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <ViewText>
                  <strong>Name:</strong> {displayData.patientInformation.name}<br/>
                  <strong>MRN:</strong> {displayData.patientInformation.mrn}<br/>
                  <strong>Date of Birth:</strong> {displayData.patientInformation.dateOfBirth}<br/>
                  <strong>Age:</strong> {displayData.patientInformation.age} years<br/>
                  <strong>Sex:</strong> {displayData.patientInformation.sex}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Presenting Complaint */}
          {displayData?.presentingComplaint && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Presenting Complaint
              </ViewSectionTitle>
              {isEditing ? (
                <EditableTextarea
                  value={displayData.presentingComplaint}
                  onChange={(e) => updateField(['presentingComplaint'], e.target.value)}
                />
              ) : (
                <ViewText>{displayData.presentingComplaint}</ViewText>
              )}
            </ViewSection>
          )}

          {/* Medical History */}
          {displayData?.medicalHistory && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Medical History
              </ViewSectionTitle>
              
              {displayData.medicalHistory.conditions && displayData.medicalHistory.conditions.length > 0 && (
                <>
                  <ViewText><strong>Conditions:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.medicalHistory.conditions.join('\n')}
                      onChange={(e) => updateField(['medicalHistory', 'conditions'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One condition per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.medicalHistory.conditions.map((condition, index) => (
                        <ViewListItem key={index}>{condition}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.medicalHistory.allergies && displayData.medicalHistory.allergies.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Allergies:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.medicalHistory.allergies.join('\n')}
                      onChange={(e) => updateField(['medicalHistory', 'allergies'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One allergy per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.medicalHistory.allergies.map((allergy, index) => (
                        <ViewListItem key={index}>{allergy}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.medicalHistory.socialHistory && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Social History:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.medicalHistory.socialHistory}
                      onChange={(e) => updateField(['medicalHistory', 'socialHistory'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.medicalHistory.socialHistory}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Medications */}
          {displayData?.medications && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Medications
              </ViewSectionTitle>
              
              {displayData.medications.chronicPriorToEvent && displayData.medications.chronicPriorToEvent.length > 0 && (
                <>
                  <ViewText><strong>Chronic Medications (Prior to Event):</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.medications.chronicPriorToEvent.join('\n')}
                      onChange={(e) => updateField(['medications', 'chronicPriorToEvent'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One medication per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.medications.chronicPriorToEvent.map((med, index) => (
                        <ViewListItem key={index}>{med}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.medications.initiatedAtAcuteEvent && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Initiated at Acute Event:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.medications.initiatedAtAcuteEvent}
                      onChange={(e) => updateField(['medications', 'initiatedAtAcuteEvent'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.medications.initiatedAtAcuteEvent}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Key Laboratory Findings */}
          {displayData?.keyLaboratoryFindings && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Key Laboratory Findings
              </ViewSectionTitle>
              
              {displayData.keyLaboratoryFindings.encounterDate && (
                <>
                  <ViewText style={{ marginBottom: '16px' }}><strong>Encounter Date:</strong></ViewText>
                  {isEditing ? (
                    <EditableInput
                      value={displayData.keyLaboratoryFindings.encounterDate}
                      onChange={(e) => updateField(['keyLaboratoryFindings', 'encounterDate'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.keyLaboratoryFindings.encounterDate}</ViewText>
                  )}
                </>
              )}
              
              {displayData.keyLaboratoryFindings.results && displayData.keyLaboratoryFindings.results.length > 0 && (
                <LabTable>
                  <thead>
                    <tr>
                      <LabTableHeader>Test</LabTableHeader>
                      <LabTableHeader>Value</LabTableHeader>
                      <LabTableHeader>Flag</LabTableHeader>
                      <LabTableHeader>Reference</LabTableHeader>
                      {isEditing && <LabTableHeader>Note</LabTableHeader>}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.keyLaboratoryFindings.results.map((result, index) => (
                      <LabTableRow key={index}>
                        <LabTableCell>
                          {isEditing ? (
                            <EditableInput
                              value={result.test}
                              onChange={(e) => {
                                const updated = [...(displayData.keyLaboratoryFindings?.results || [])];
                                updated[index] = { ...updated[index], test: e.target.value };
                                updateField(['keyLaboratoryFindings', 'results'], updated);
                              }}
                            />
                          ) : (
                            <strong>{result.test}</strong>
                          )}
                        </LabTableCell>
                        <LabTableCell>
                          {isEditing ? (
                            <EditableInput
                              value={result.value}
                              onChange={(e) => {
                                const updated = [...(displayData.keyLaboratoryFindings?.results || [])];
                                updated[index] = { ...updated[index], value: e.target.value };
                                updateField(['keyLaboratoryFindings', 'results'], updated);
                              }}
                            />
                          ) : (
                            result.value
                          )}
                        </LabTableCell>
                        <LabTableCell>
                          {isEditing ? (
                            <EditableInput
                              value={result.flag || ''}
                              onChange={(e) => {
                                const updated = [...(displayData.keyLaboratoryFindings?.results || [])];
                                updated[index] = { ...updated[index], flag: e.target.value };
                                updateField(['keyLaboratoryFindings', 'results'], updated);
                              }}
                              placeholder="High/Low/Normal"
                            />
                          ) : (
                            result.flag && <FlagBadge flag={result.flag}>{result.flag}</FlagBadge>
                          )}
                        </LabTableCell>
                        <LabTableCell>
                          {isEditing ? (
                            <EditableInput
                              value={result.reference}
                              onChange={(e) => {
                                const updated = [...(displayData.keyLaboratoryFindings?.results || [])];
                                updated[index] = { ...updated[index], reference: e.target.value };
                                updateField(['keyLaboratoryFindings', 'results'], updated);
                              }}
                            />
                          ) : (
                            <>
                              {result.reference}
                              {result.note && (
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                  Note: {result.note}
                                </div>
                              )}
                            </>
                          )}
                        </LabTableCell>
                        {isEditing && (
                          <LabTableCell>
                            <EditableInput
                              value={result.note || ''}
                              onChange={(e) => {
                                const updated = [...(displayData.keyLaboratoryFindings?.results || [])];
                                updated[index] = { ...updated[index], note: e.target.value };
                                updateField(['keyLaboratoryFindings', 'results'], updated);
                              }}
                              placeholder="Optional note"
                            />
                          </LabTableCell>
                        )}
                      </LabTableRow>
                    ))}
                  </tbody>
                </LabTable>
              )}
            </ViewSection>
          )}

          {/* Differential Diagnosis Tracker */}
          {displayData?.differentialDiagnosisTracker && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Differential Diagnosis Tracker
              </ViewSectionTitle>
              
              {displayData.differentialDiagnosisTracker.diagnoses && displayData.differentialDiagnosisTracker.diagnoses.length > 0 && (
                <>
                  <ViewText style={{ marginBottom: '12px' }}><strong>Active Diagnoses:</strong></ViewText>
                  {displayData.differentialDiagnosisTracker.diagnoses.map((diagnosis, index) => (
                    <StatusCard key={index} status={diagnosis.status}>
                      <StatusBadge status={diagnosis.status}>
                        {diagnosis.status === 'PRIMARY' && <CheckCircle size={14} />}
                        {diagnosis.status === 'INVESTIGATE' && <AlertCircle size={14} />}
                        {diagnosis.status === 'PENDING' && <Clock size={14} />}
                        {diagnosis.status}
                      </StatusBadge>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <EditableInput
                            value={diagnosis.name}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.diagnoses || [])];
                              updated[index] = { ...updated[index], name: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'diagnoses'], updated);
                            }}
                            placeholder="Diagnosis name"
                          />
                          <EditableInput
                            value={diagnosis.status}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.diagnoses || [])];
                              updated[index] = { ...updated[index], status: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'diagnoses'], updated);
                            }}
                            placeholder="Status"
                          />
                          <EditableTextarea
                            value={diagnosis.notes}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.diagnoses || [])];
                              updated[index] = { ...updated[index], notes: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'diagnoses'], updated);
                            }}
                            placeholder="Notes"
                          />
                        </div>
                      ) : (
                        <ViewText>
                          <strong>{diagnosis.name}</strong><br/>
                          {diagnosis.notes}
                        </ViewText>
                      )}
                    </StatusCard>
                  ))}
                </>
              )}
              
              {displayData.differentialDiagnosisTracker.ruledOut && displayData.differentialDiagnosisTracker.ruledOut.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '20px', marginBottom: '12px' }}><strong>Ruled Out:</strong></ViewText>
                  {displayData.differentialDiagnosisTracker.ruledOut.map((diagnosis, index) => (
                    <StatusCard key={index} status={diagnosis.status}>
                      <StatusBadge status={diagnosis.status}>
                        <XCircle size={14} />
                        {diagnosis.status}
                      </StatusBadge>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <EditableInput
                            value={diagnosis.name}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.ruledOut || [])];
                              updated[index] = { ...updated[index], name: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'ruledOut'], updated);
                            }}
                            placeholder="Diagnosis name"
                          />
                          <EditableInput
                            value={diagnosis.status}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.ruledOut || [])];
                              updated[index] = { ...updated[index], status: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'ruledOut'], updated);
                            }}
                            placeholder="Status"
                          />
                          <EditableTextarea
                            value={diagnosis.notes}
                            onChange={(e) => {
                              const updated = [...(displayData.differentialDiagnosisTracker?.ruledOut || [])];
                              updated[index] = { ...updated[index], notes: e.target.value };
                              updateField(['differentialDiagnosisTracker', 'ruledOut'], updated);
                            }}
                            placeholder="Notes"
                          />
                        </div>
                      ) : (
                        <ViewText>
                          <strong>{diagnosis.name}</strong><br/>
                          {diagnosis.notes}
                        </ViewText>
                      )}
                    </StatusCard>
                  ))}
                </>
              )}
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Diagnosis */}
          {displayData?.diagnosis && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Diagnosis
              </ViewSectionTitle>
              
              {displayData.diagnosis.main && (
                <HighlightBox>
                  <ViewText><strong>Main Diagnosis:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.diagnosis.main}
                      onChange={(e) => updateField(['diagnosis', 'main'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.diagnosis.main}</ViewText>
                  )}
                </HighlightBox>
              )}
              
              {displayData.diagnosis.causality && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Causality:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.diagnosis.causality}
                      onChange={(e) => updateField(['diagnosis', 'causality'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.diagnosis.causality}</ViewText>
                  )}
                </>
              )}
              
              {displayData.diagnosis.mechanism && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Mechanism:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.diagnosis.mechanism}
                      onChange={(e) => updateField(['diagnosis', 'mechanism'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.diagnosis.mechanism}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* EASL Assessment */}
          {displayData?.easlAssessment && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                EASL Assessment
              </ViewSectionTitle>
              
              {displayData.easlAssessment.overallImpression && (
                <HighlightBox>
                  <ViewText><strong>Overall Impression:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.easlAssessment.overallImpression}
                      onChange={(e) => updateField(['easlAssessment', 'overallImpression'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.easlAssessment.overallImpression}</ViewText>
                  )}
                </HighlightBox>
              )}
              
              {displayData.easlAssessment.diliDiagnosticCriteriaMet && displayData.easlAssessment.diliDiagnosticCriteriaMet.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>DILI Diagnostic Criteria:</strong></ViewText>
                  {displayData.easlAssessment.diliDiagnosticCriteriaMet.map((criterion, index) => (
                    <CriterionCard key={index} met={criterion.status === 'MET'}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <EditableInput
                            value={criterion.criterion}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.diliDiagnosticCriteriaMet || [])];
                              updated[index] = { ...updated[index], criterion: e.target.value };
                              updateField(['easlAssessment', 'diliDiagnosticCriteriaMet'], updated);
                            }}
                            placeholder="Criterion"
                          />
                          <EditableInput
                            value={criterion.status}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.diliDiagnosticCriteriaMet || [])];
                              updated[index] = { ...updated[index], status: e.target.value };
                              updateField(['easlAssessment', 'diliDiagnosticCriteriaMet'], updated);
                            }}
                            placeholder="Status"
                          />
                          <EditableTextarea
                            value={criterion.details}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.diliDiagnosticCriteriaMet || [])];
                              updated[index] = { ...updated[index], details: e.target.value };
                              updateField(['easlAssessment', 'diliDiagnosticCriteriaMet'], updated);
                            }}
                            placeholder="Details"
                          />
                        </div>
                      ) : (
                        <ViewText>
                          <strong>{criterion.criterion}</strong><br/>
                          Status: {criterion.status}<br/>
                          {criterion.details}
                        </ViewText>
                      )}
                    </CriterionCard>
                  ))}
                </>
              )}
              
              {displayData.easlAssessment.causativeAgentAssessment && displayData.easlAssessment.causativeAgentAssessment.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Causative Agent Assessment:</strong></ViewText>
                  {displayData.easlAssessment.causativeAgentAssessment.map((agent, index) => (
                    <div key={index} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #667eea' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <EditableInput
                            value={agent.agent}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.causativeAgentAssessment || [])];
                              updated[index] = { ...updated[index], agent: e.target.value };
                              updateField(['easlAssessment', 'causativeAgentAssessment'], updated);
                            }}
                            placeholder="Agent name"
                          />
                          <EditableInput
                            value={agent.role}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.causativeAgentAssessment || [])];
                              updated[index] = { ...updated[index], role: e.target.value };
                              updateField(['easlAssessment', 'causativeAgentAssessment'], updated);
                            }}
                            placeholder="Role"
                          />
                          <EditableTextarea
                            value={agent.rationale}
                            onChange={(e) => {
                              const updated = [...(displayData.easlAssessment?.causativeAgentAssessment || [])];
                              updated[index] = { ...updated[index], rationale: e.target.value };
                              updateField(['easlAssessment', 'causativeAgentAssessment'], updated);
                            }}
                            placeholder="Rationale"
                          />
                        </div>
                      ) : (
                        <ViewText>
                          <strong>{agent.agent}</strong><br/>
                          Role: {agent.role}<br/>
                          {agent.rationale}
                        </ViewText>
                      )}
                    </div>
                  ))}
                </>
              )}
              
              {displayData.easlAssessment.severityAssessment && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Severity Assessment:</strong></ViewText>
                  {displayData.easlAssessment.severityAssessment.overallSeverity && (
                    <>
                      <ViewText style={{ marginBottom: '8px' }}><strong>Overall Severity:</strong></ViewText>
                      {isEditing ? (
                        <EditableInput
                          value={displayData.easlAssessment.severityAssessment.overallSeverity}
                          onChange={(e) => updateField(['easlAssessment', 'severityAssessment', 'overallSeverity'], e.target.value)}
                        />
                      ) : (
                        <ViewText>{displayData.easlAssessment.severityAssessment.overallSeverity}</ViewText>
                      )}
                    </>
                  )}
                  {displayData.easlAssessment.severityAssessment.features && displayData.easlAssessment.severityAssessment.features.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Features:</strong></ViewText>
                      {isEditing ? (
                        <EditableTextarea
                          value={displayData.easlAssessment.severityAssessment.features.join('\n')}
                          onChange={(e) => updateField(['easlAssessment', 'severityAssessment', 'features'], e.target.value.split('\n').filter(Boolean))}
                          placeholder="One feature per line"
                        />
                      ) : (
                        <ViewList>
                          {displayData.easlAssessment.severityAssessment.features.map((feature, index) => (
                            <ViewListItem key={index}>{feature}</ViewListItem>
                          ))}
                        </ViewList>
                      )}
                    </>
                  )}
                  {displayData.easlAssessment.severityAssessment.prognosisNote && (
                    <HighlightBox style={{ marginTop: '12px' }}>
                      <ViewText><strong>Prognosis:</strong></ViewText>
                      {isEditing ? (
                        <EditableTextarea
                          value={displayData.easlAssessment.severityAssessment.prognosisNote}
                          onChange={(e) => updateField(['easlAssessment', 'severityAssessment', 'prognosisNote'], e.target.value)}
                        />
                      ) : (
                        <ViewText>{displayData.easlAssessment.severityAssessment.prognosisNote}</ViewText>
                      )}
                    </HighlightBox>
                  )}
                </>
              )}
              
              {displayData.easlAssessment.exclusionOfAlternativeCausesRequired && displayData.easlAssessment.exclusionOfAlternativeCausesRequired.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Exclusion of Alternative Causes Required:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.easlAssessment.exclusionOfAlternativeCausesRequired.join('\n')}
                      onChange={(e) => updateField(['easlAssessment', 'exclusionOfAlternativeCausesRequired'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One cause per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.easlAssessment.exclusionOfAlternativeCausesRequired.map((cause, index) => (
                        <ViewListItem key={index}>{cause}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.easlAssessment.localGuidelinesComparison && (
                <>
                  <ViewText style={{ marginTop: '16px' }}><strong>Local Guidelines Comparison:</strong></ViewText>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <div>
                        <strong>Status:</strong>
                        <EditableInput
                          value={displayData.easlAssessment.localGuidelinesComparison.status || ''}
                          onChange={(e) => updateField(['easlAssessment', 'localGuidelinesComparison', 'status'], e.target.value)}
                        />
                      </div>
                      <div>
                        <strong>Details:</strong>
                        <EditableTextarea
                          value={displayData.easlAssessment.localGuidelinesComparison.details || ''}
                          onChange={(e) => updateField(['easlAssessment', 'localGuidelinesComparison', 'details'], e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <ViewText>
                      Status: {displayData.easlAssessment.localGuidelinesComparison.status}<br/>
                      {displayData.easlAssessment.localGuidelinesComparison.details}
                    </ViewText>
                  )}
                </>
              )}
              
              {displayData.easlAssessment.references && displayData.easlAssessment.references.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '8px' }}><strong>References:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.easlAssessment.references.join('\n')}
                      onChange={(e) => updateField(['easlAssessment', 'references'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One reference per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.easlAssessment.references.map((ref, index) => (
                        <ViewListItem key={index} style={{ fontSize: '13px' }}>{ref}</ViewListItem>
                      ))}
                    </ViewList>
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