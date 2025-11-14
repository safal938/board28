import React, { useRef } from 'react';
import styled from 'styled-components';
import { Download, Printer, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, CheckCircle, XCircle, Clock } from 'lucide-react';

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

const ActionButton = styled.button`
  padding: 6px 14px;
  border: 1px solid #dadce0;
  background: white;
  color: #5f6368;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
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
}

const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ diagnosticData }) => {
  const documentRef = useRef<HTMLDivElement>(null);

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

  if (!diagnosticData) {
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
          <ActionButton onClick={handleDownload}>
            <Download />
            Download
          </ActionButton>
          <ActionButton onClick={handlePrint}>
            <Printer />
            Print
          </ActionButton>
        </ActionButtons>
      </ViewHeader>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          {/* Patient Information */}
          {diagnosticData.patientInformation && (
            <ViewSection>
              <ViewSectionTitle>
                <User />
                Patient Information
              </ViewSectionTitle>
              <ViewText>
                <strong>Name:</strong> {diagnosticData.patientInformation.name}<br/>
                <strong>MRN:</strong> {diagnosticData.patientInformation.mrn}<br/>
                <strong>Date of Birth:</strong> {diagnosticData.patientInformation.dateOfBirth}<br/>
                <strong>Age:</strong> {diagnosticData.patientInformation.age} years<br/>
                <strong>Sex:</strong> {diagnosticData.patientInformation.sex}
              </ViewText>
            </ViewSection>
          )}

          {/* Presenting Complaint */}
          {diagnosticData.presentingComplaint && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Presenting Complaint
              </ViewSectionTitle>
              <ViewText>{diagnosticData.presentingComplaint}</ViewText>
            </ViewSection>
          )}

          {/* Medical History */}
          {diagnosticData.medicalHistory && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Medical History
              </ViewSectionTitle>
              
              {diagnosticData.medicalHistory.conditions && diagnosticData.medicalHistory.conditions.length > 0 && (
                <>
                  <ViewText><strong>Conditions:</strong></ViewText>
                  <ViewList>
                    {diagnosticData.medicalHistory.conditions.map((condition, index) => (
                      <ViewListItem key={index}>{condition}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {diagnosticData.medicalHistory.allergies && diagnosticData.medicalHistory.allergies.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Allergies:</strong></ViewText>
                  <ViewList>
                    {diagnosticData.medicalHistory.allergies.map((allergy, index) => (
                      <ViewListItem key={index}>{allergy}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {diagnosticData.medicalHistory.socialHistory && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Social History:</strong><br/>
                  {diagnosticData.medicalHistory.socialHistory}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Medications */}
          {diagnosticData.medications && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Medications
              </ViewSectionTitle>
              
              {diagnosticData.medications.chronicPriorToEvent && diagnosticData.medications.chronicPriorToEvent.length > 0 && (
                <>
                  <ViewText><strong>Chronic Medications (Prior to Event):</strong></ViewText>
                  <ViewList>
                    {diagnosticData.medications.chronicPriorToEvent.map((med, index) => (
                      <ViewListItem key={index}>{med}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {diagnosticData.medications.initiatedAtAcuteEvent && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Initiated at Acute Event:</strong><br/>
                  {diagnosticData.medications.initiatedAtAcuteEvent}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Key Laboratory Findings */}
          {diagnosticData.keyLaboratoryFindings && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Key Laboratory Findings
              </ViewSectionTitle>
              
              {diagnosticData.keyLaboratoryFindings.encounterDate && (
                <ViewText style={{ marginBottom: '16px' }}>
                  <strong>Encounter Date:</strong> {diagnosticData.keyLaboratoryFindings.encounterDate}
                </ViewText>
              )}
              
              {diagnosticData.keyLaboratoryFindings.results && diagnosticData.keyLaboratoryFindings.results.length > 0 && (
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
                    {diagnosticData.keyLaboratoryFindings.results.map((result, index) => (
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
            </ViewSection>
          )}

          {/* Differential Diagnosis Tracker */}
          {diagnosticData.differentialDiagnosisTracker && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Differential Diagnosis Tracker
              </ViewSectionTitle>
              
              {diagnosticData.differentialDiagnosisTracker.diagnoses && diagnosticData.differentialDiagnosisTracker.diagnoses.length > 0 && (
                <>
                  <ViewText style={{ marginBottom: '12px' }}><strong>Active Diagnoses:</strong></ViewText>
                  {diagnosticData.differentialDiagnosisTracker.diagnoses.map((diagnosis, index) => (
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
              
              {diagnosticData.differentialDiagnosisTracker.ruledOut && diagnosticData.differentialDiagnosisTracker.ruledOut.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '20px', marginBottom: '12px' }}><strong>Ruled Out:</strong></ViewText>
                  {diagnosticData.differentialDiagnosisTracker.ruledOut.map((diagnosis, index) => (
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
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Diagnosis */}
          {diagnosticData.diagnosis && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Diagnosis
              </ViewSectionTitle>
              
              {diagnosticData.diagnosis.main && (
                <HighlightBox>
                  <ViewText><strong>Main Diagnosis:</strong><br/>{diagnosticData.diagnosis.main}</ViewText>
                </HighlightBox>
              )}
              
              {diagnosticData.diagnosis.causality && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Causality:</strong><br/>
                  {diagnosticData.diagnosis.causality}
                </ViewText>
              )}
              
              {diagnosticData.diagnosis.mechanism && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Mechanism:</strong><br/>
                  {diagnosticData.diagnosis.mechanism}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* EASL Assessment */}
          {diagnosticData.easlAssessment && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                EASL Assessment
              </ViewSectionTitle>
              
              {diagnosticData.easlAssessment.overallImpression && (
                <HighlightBox>
                  <ViewText><strong>Overall Impression:</strong><br/>{diagnosticData.easlAssessment.overallImpression}</ViewText>
                </HighlightBox>
              )}
              
              {diagnosticData.easlAssessment.diliDiagnosticCriteriaMet && diagnosticData.easlAssessment.diliDiagnosticCriteriaMet.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>DILI Diagnostic Criteria:</strong></ViewText>
                  {diagnosticData.easlAssessment.diliDiagnosticCriteriaMet.map((criterion, index) => (
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
              
              {diagnosticData.easlAssessment.causativeAgentAssessment && diagnosticData.easlAssessment.causativeAgentAssessment.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Causative Agent Assessment:</strong></ViewText>
                  {diagnosticData.easlAssessment.causativeAgentAssessment.map((agent, index) => (
                    <ViewText key={index} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #667eea' }}>
                      <strong>{agent.agent}</strong><br/>
                      Role: {agent.role}<br/>
                      {agent.rationale}
                    </ViewText>
                  ))}
                </>
              )}
              
              {diagnosticData.easlAssessment.severityAssessment && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Severity Assessment:</strong></ViewText>
                  {diagnosticData.easlAssessment.severityAssessment.overallSeverity && (
                    <ViewText style={{ marginBottom: '8px' }}>
                      <strong>Overall Severity:</strong> {diagnosticData.easlAssessment.severityAssessment.overallSeverity}
                    </ViewText>
                  )}
                  {diagnosticData.easlAssessment.severityAssessment.features && diagnosticData.easlAssessment.severityAssessment.features.length > 0 && (
                    <ViewList>
                      {diagnosticData.easlAssessment.severityAssessment.features.map((feature, index) => (
                        <ViewListItem key={index}>{feature}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                  {diagnosticData.easlAssessment.severityAssessment.prognosisNote && (
                    <HighlightBox style={{ marginTop: '12px' }}>
                      <ViewText><strong>Prognosis:</strong><br/>{diagnosticData.easlAssessment.severityAssessment.prognosisNote}</ViewText>
                    </HighlightBox>
                  )}
                </>
              )}
              
              {diagnosticData.easlAssessment.exclusionOfAlternativeCausesRequired && diagnosticData.easlAssessment.exclusionOfAlternativeCausesRequired.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '12px' }}><strong>Exclusion of Alternative Causes Required:</strong></ViewText>
                  <ViewList>
                    {diagnosticData.easlAssessment.exclusionOfAlternativeCausesRequired.map((cause, index) => (
                      <ViewListItem key={index}>{cause}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {diagnosticData.easlAssessment.localGuidelinesComparison && (
                <ViewText style={{ marginTop: '16px' }}>
                  <strong>Local Guidelines Comparison:</strong><br/>
                  Status: {diagnosticData.easlAssessment.localGuidelinesComparison.status}<br/>
                  {diagnosticData.easlAssessment.localGuidelinesComparison.details}
                </ViewText>
              )}
              
              {diagnosticData.easlAssessment.references && diagnosticData.easlAssessment.references.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '16px', marginBottom: '8px' }}><strong>References:</strong></ViewText>
                  <ViewList>
                    {diagnosticData.easlAssessment.references.map((ref, index) => (
                      <ViewListItem key={index} style={{ fontSize: '13px' }}>{ref}</ViewListItem>
                    ))}
                  </ViewList>
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
