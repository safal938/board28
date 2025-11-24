import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Download, Printer, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, Heart, Edit, Save, X } from 'lucide-react';

// Dynamic imports for print libraries
let jsPDF: any = null;
let html2canvas: any = null;

try {
  jsPDF = require('jspdf').jsPDF;
  html2canvas = require('html2canvas');
} catch (e) {
  console.log('Print libraries not installed. Run: npm install jspdf html2canvas');
}

// View Mode Styles
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
  width: 100%;
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

const LabGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin: 16px 0;
`;

const LabCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 14px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LabLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LabValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.4;
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

interface PatientReportProps {
  patientData?: {
    name?: string;
    mrn?: string;
    age_sex?: string;
    date_of_summary?: string;
    one_sentence_impression?: string;
    clinical_context_baseline?: {
      comorbidities?: string[];
      key_baseline_labs?: string;
      social_history?: string;
    };
    suspect_drug_timeline?: {
      chief_complaint?: string;
      hopi_significant_points?: string;
      chronic_medications?: string[];
      acute_medication_onset?: string;
      possibilities_for_dili?: string[];
    };
    rule_out_complete?: {
      viral_hepatitis?: string;
      autoimmune?: string;
      other_competing_dx_ruled_out?: string;
    };
    injury_pattern_trends?: {
      pattern?: string;
      hys_law?: string;
      meld_na?: string;
      lft_data_peak_onset?: {
        ALT?: string;
        AST?: string;
        Alk_Phos?: string;
        T_Bili?: string;
        INR?: string;
      };
      lft_sparklines_trends?: string;
      complications?: string[];
      noh_graz_law?: string;
    };
    severity_prognosis?: {
      severity_features?: string[];
      prognosis_statement?: string;
    };
    key_diagnostics?: {
      imaging_performed?: string;
      biopsy?: string;
      methotrexate_level?: string;
    };
    management_monitoring?: {
      stopped_culprit_drugs?: string[];
      active_treatments?: string[];
      consults_initiated?: string[];
      nutrition?: string;
      vte_ppx?: string;
      causality_rucam?: string;
      monitoring_plan?: string[];
    };
    current_status_last_48h?: string;
  };
  onSave?: (updatedData: PatientReportProps['patientData']) => void;
}

const PatientReport: React.FC<PatientReportProps> = ({ patientData, onSave }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(patientData);

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
      const filename = `Patient_Report_${patientData?.name?.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
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
    setEditedData(patientData);
  };

  const handleSave = () => {
    if (onSave && editedData) {
      onSave(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(patientData);
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

  if (!patientData) {
    return <div>No patient data available</div>;
  }

  const displayData = isEditing ? editedData : patientData;

  return (
    <ViewContainer ref={documentRef} data-print-content>
      <ViewHeader>
        <ViewTitle>
          <FileText size={28} />
          Patient Summary Report
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
              <ActionButton onClick={handleDownload}>
                <Download />
                Download
              </ActionButton>
              <ActionButton onClick={handlePrint}>
                <Printer />
                Print
              </ActionButton>
            </>
          )}
        </ActionButtons>
      </ViewHeader>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          {/* Patient Demographics */}
          <ViewSection>
            <ViewSectionTitle>
              <User />
              Patient Demographics
            </ViewSectionTitle>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <strong>Name:</strong>
                  <EditableInput
                    value={displayData?.name || ''}
                    onChange={(e) => updateField(['name'], e.target.value)}
                  />
                </div>
                <div>
                  <strong>MRN:</strong>
                  <EditableInput
                    value={displayData?.mrn || ''}
                    onChange={(e) => updateField(['mrn'], e.target.value)}
                  />
                </div>
                <div>
                  <strong>Age/Sex:</strong>
                  <EditableInput
                    value={displayData?.age_sex || ''}
                    onChange={(e) => updateField(['age_sex'], e.target.value)}
                  />
                </div>
                <div>
                  <strong>Date of Summary:</strong>
                  <EditableInput
                    value={displayData?.date_of_summary || ''}
                    onChange={(e) => updateField(['date_of_summary'], e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <ViewText>
                <strong>Name:</strong> {displayData?.name}<br/>
                <strong>MRN:</strong> {displayData?.mrn}<br/>
                <strong>Age/Sex:</strong> {displayData?.age_sex}<br/>
                <strong>Date of Summary:</strong> {displayData?.date_of_summary}
              </ViewText>
            )}
          </ViewSection>

          {/* One Sentence Impression */}
          {displayData?.one_sentence_impression && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Clinical Impression
              </ViewSectionTitle>
              <HighlightBox>
                {isEditing ? (
                  <EditableTextarea
                    value={displayData.one_sentence_impression}
                    onChange={(e) => updateField(['one_sentence_impression'], e.target.value)}
                  />
                ) : (
                  <ViewText>{displayData.one_sentence_impression}</ViewText>
                )}
              </HighlightBox>
            </ViewSection>
          )}

          {/* Clinical Context Baseline */}
          {displayData?.clinical_context_baseline && (
            <ViewSection>
              <ViewSectionTitle>
                <Heart />
                Clinical Context - Baseline
              </ViewSectionTitle>
              
              {displayData.clinical_context_baseline?.comorbidities && displayData.clinical_context_baseline.comorbidities.length > 0 && (
                <>
                  <ViewText><strong>Comorbidities:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.clinical_context_baseline.comorbidities.join('\n')}
                      onChange={(e) => updateField(['clinical_context_baseline', 'comorbidities'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One comorbidity per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.clinical_context_baseline.comorbidities.map((item: string, index: number) => (
                        <ViewListItem key={index}>{item}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.clinical_context_baseline?.key_baseline_labs && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Key Baseline Labs:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.clinical_context_baseline.key_baseline_labs}
                      onChange={(e) => updateField(['clinical_context_baseline', 'key_baseline_labs'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.clinical_context_baseline.key_baseline_labs}</ViewText>
                  )}
                </>
              )}
              
              {displayData.clinical_context_baseline?.social_history && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Social History:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.clinical_context_baseline.social_history}
                      onChange={(e) => updateField(['clinical_context_baseline', 'social_history'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.clinical_context_baseline.social_history}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Suspect Drug Timeline */}
          {displayData?.suspect_drug_timeline && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Suspect Drug Timeline
              </ViewSectionTitle>
              
              {displayData.suspect_drug_timeline?.chief_complaint && (
                <>
                  <ViewText><strong>Chief Complaint:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.suspect_drug_timeline.chief_complaint}
                      onChange={(e) => updateField(['suspect_drug_timeline', 'chief_complaint'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.suspect_drug_timeline.chief_complaint}</ViewText>
                  )}
                </>
              )}
              
              {displayData.suspect_drug_timeline?.hopi_significant_points && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>History of Present Illness:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.suspect_drug_timeline.hopi_significant_points}
                      onChange={(e) => updateField(['suspect_drug_timeline', 'hopi_significant_points'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.suspect_drug_timeline.hopi_significant_points}</ViewText>
                  )}
                </>
              )}
              
              {displayData.suspect_drug_timeline?.chronic_medications && displayData.suspect_drug_timeline.chronic_medications.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Chronic Medications:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.suspect_drug_timeline.chronic_medications.join('\n')}
                      onChange={(e) => updateField(['suspect_drug_timeline', 'chronic_medications'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One medication per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.suspect_drug_timeline.chronic_medications.map((med: string, index: number) => (
                        <ViewListItem key={index}>{med}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.suspect_drug_timeline?.acute_medication_onset && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Acute Medication Onset:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.suspect_drug_timeline.acute_medication_onset}
                      onChange={(e) => updateField(['suspect_drug_timeline', 'acute_medication_onset'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.suspect_drug_timeline.acute_medication_onset}</ViewText>
                  )}
                </>
              )}
              
              {displayData.suspect_drug_timeline?.possibilities_for_dili && displayData.suspect_drug_timeline.possibilities_for_dili.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Possibilities for DILI:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.suspect_drug_timeline.possibilities_for_dili.join('\n')}
                      onChange={(e) => updateField(['suspect_drug_timeline', 'possibilities_for_dili'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One possibility per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.suspect_drug_timeline.possibilities_for_dili.map((item: string, index: number) => (
                        <ViewListItem key={index}>{item}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Rule Out Complete */}
          {displayData?.rule_out_complete && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Rule Out Assessment
              </ViewSectionTitle>
              
              {displayData.rule_out_complete?.viral_hepatitis && (
                <>
                  <ViewText><strong>Viral Hepatitis:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.rule_out_complete.viral_hepatitis}
                      onChange={(e) => updateField(['rule_out_complete', 'viral_hepatitis'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.rule_out_complete.viral_hepatitis}</ViewText>
                  )}
                </>
              )}
              
              {displayData.rule_out_complete?.autoimmune && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Autoimmune:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.rule_out_complete.autoimmune}
                      onChange={(e) => updateField(['rule_out_complete', 'autoimmune'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.rule_out_complete.autoimmune}</ViewText>
                  )}
                </>
              )}
              
              {displayData.rule_out_complete?.other_competing_dx_ruled_out && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Other Competing Diagnoses:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.rule_out_complete.other_competing_dx_ruled_out}
                      onChange={(e) => updateField(['rule_out_complete', 'other_competing_dx_ruled_out'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.rule_out_complete.other_competing_dx_ruled_out}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Severity & Prognosis */}
          {displayData?.severity_prognosis && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                Severity & Prognosis
              </ViewSectionTitle>
              
              {displayData.severity_prognosis?.severity_features && displayData.severity_prognosis.severity_features.length > 0 && (
                <>
                  <ViewText><strong>Severity Features:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.severity_prognosis.severity_features.join('\n')}
                      onChange={(e) => updateField(['severity_prognosis', 'severity_features'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One feature per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.severity_prognosis.severity_features.map((feature: string, index: number) => (
                        <ViewListItem key={index}>{feature}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.severity_prognosis?.prognosis_statement && (
                <HighlightBox style={{ marginTop: '12px' }}>
                  <ViewText><strong>Prognosis:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.severity_prognosis.prognosis_statement}
                      onChange={(e) => updateField(['severity_prognosis', 'prognosis_statement'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.severity_prognosis.prognosis_statement}</ViewText>
                  )}
                </HighlightBox>
              )}
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Injury Pattern & Trends */}
          {displayData?.injury_pattern_trends && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Injury Pattern & Trends
              </ViewSectionTitle>
              
              {displayData.injury_pattern_trends?.pattern && (
                <>
                  <ViewText><strong>Pattern:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.injury_pattern_trends.pattern}
                      onChange={(e) => updateField(['injury_pattern_trends', 'pattern'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.injury_pattern_trends.pattern}</ViewText>
                  )}
                </>
              )}
              
              {displayData.injury_pattern_trends?.hys_law && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Hy's Law:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.injury_pattern_trends.hys_law}
                      onChange={(e) => updateField(['injury_pattern_trends', 'hys_law'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.injury_pattern_trends.hys_law}</ViewText>
                  )}
                </>
              )}
              
              {displayData.injury_pattern_trends?.meld_na && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>MELD-Na:</strong></ViewText>
                  {isEditing ? (
                    <EditableInput
                      value={displayData.injury_pattern_trends.meld_na}
                      onChange={(e) => updateField(['injury_pattern_trends', 'meld_na'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.injury_pattern_trends.meld_na}</ViewText>
                  )}
                </>
              )}
              
              {displayData.injury_pattern_trends?.lft_data_peak_onset && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Peak Laboratory Values:</strong></ViewText>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <div>
                        <strong>ALT:</strong>
                        <EditableInput
                          value={displayData.injury_pattern_trends.lft_data_peak_onset.ALT || ''}
                          onChange={(e) => updateField(['injury_pattern_trends', 'lft_data_peak_onset', 'ALT'], e.target.value)}
                        />
                      </div>
                      <div>
                        <strong>AST:</strong>
                        <EditableInput
                          value={displayData.injury_pattern_trends.lft_data_peak_onset.AST || ''}
                          onChange={(e) => updateField(['injury_pattern_trends', 'lft_data_peak_onset', 'AST'], e.target.value)}
                        />
                      </div>
                      <div>
                        <strong>Alk Phos:</strong>
                        <EditableInput
                          value={displayData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos || ''}
                          onChange={(e) => updateField(['injury_pattern_trends', 'lft_data_peak_onset', 'Alk_Phos'], e.target.value)}
                        />
                      </div>
                      <div>
                        <strong>Total Bilirubin:</strong>
                        <EditableInput
                          value={displayData.injury_pattern_trends.lft_data_peak_onset.T_Bili || ''}
                          onChange={(e) => updateField(['injury_pattern_trends', 'lft_data_peak_onset', 'T_Bili'], e.target.value)}
                        />
                      </div>
                      <div>
                        <strong>INR:</strong>
                        <EditableInput
                          value={displayData.injury_pattern_trends.lft_data_peak_onset.INR || ''}
                          onChange={(e) => updateField(['injury_pattern_trends', 'lft_data_peak_onset', 'INR'], e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <LabGrid>
                      {displayData.injury_pattern_trends.lft_data_peak_onset.ALT && (
                        <LabCard>
                          <LabLabel>ALT</LabLabel>
                          <LabValue>{displayData.injury_pattern_trends.lft_data_peak_onset.ALT}</LabValue>
                        </LabCard>
                      )}
                      {displayData.injury_pattern_trends.lft_data_peak_onset.AST && (
                        <LabCard>
                          <LabLabel>AST</LabLabel>
                          <LabValue>{displayData.injury_pattern_trends.lft_data_peak_onset.AST}</LabValue>
                        </LabCard>
                      )}
                      {displayData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos && (
                        <LabCard>
                          <LabLabel>Alk Phos</LabLabel>
                          <LabValue>{displayData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos}</LabValue>
                        </LabCard>
                      )}
                      {displayData.injury_pattern_trends.lft_data_peak_onset.T_Bili && (
                        <LabCard>
                          <LabLabel>Total Bilirubin</LabLabel>
                          <LabValue>{displayData.injury_pattern_trends.lft_data_peak_onset.T_Bili}</LabValue>
                        </LabCard>
                      )}
                      {displayData.injury_pattern_trends.lft_data_peak_onset.INR && (
                        <LabCard>
                          <LabLabel>INR</LabLabel>
                          <LabValue>{displayData.injury_pattern_trends.lft_data_peak_onset.INR}</LabValue>
                        </LabCard>
                      )}
                    </LabGrid>
                  )}
                </>
              )}
              
              {displayData.injury_pattern_trends?.lft_sparklines_trends && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>LFT Trends:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.injury_pattern_trends.lft_sparklines_trends}
                      onChange={(e) => updateField(['injury_pattern_trends', 'lft_sparklines_trends'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.injury_pattern_trends.lft_sparklines_trends}</ViewText>
                  )}
                </>
              )}
              
              {displayData.injury_pattern_trends?.complications && displayData.injury_pattern_trends.complications.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Complications:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.injury_pattern_trends.complications.join('\n')}
                      onChange={(e) => updateField(['injury_pattern_trends', 'complications'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One complication per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.injury_pattern_trends.complications.map((comp: string, index: number) => (
                        <ViewListItem key={index}>{comp}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Key Diagnostics */}
          {displayData?.key_diagnostics && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Key Diagnostics
              </ViewSectionTitle>
              
              {displayData.key_diagnostics?.imaging_performed && (
                <>
                  <ViewText><strong>Imaging:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.key_diagnostics.imaging_performed}
                      onChange={(e) => updateField(['key_diagnostics', 'imaging_performed'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.key_diagnostics.imaging_performed}</ViewText>
                  )}
                </>
              )}
              
              {displayData.key_diagnostics?.biopsy && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Biopsy:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.key_diagnostics.biopsy}
                      onChange={(e) => updateField(['key_diagnostics', 'biopsy'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.key_diagnostics.biopsy}</ViewText>
                  )}
                </>
              )}
              
              {displayData.key_diagnostics?.methotrexate_level && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Methotrexate Level:</strong></ViewText>
                  {isEditing ? (
                    <EditableInput
                      value={displayData.key_diagnostics.methotrexate_level}
                      onChange={(e) => updateField(['key_diagnostics', 'methotrexate_level'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.key_diagnostics.methotrexate_level}</ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Management & Monitoring */}
          {displayData?.management_monitoring && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Management & Monitoring
              </ViewSectionTitle>
              
              {displayData.management_monitoring?.causality_rucam && (
                <HighlightBox>
                  <ViewText><strong>Causality Assessment:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.causality_rucam}
                      onChange={(e) => updateField(['management_monitoring', 'causality_rucam'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.management_monitoring.causality_rucam}</ViewText>
                  )}
                </HighlightBox>
              )}
              
              {displayData.management_monitoring?.stopped_culprit_drugs && displayData.management_monitoring.stopped_culprit_drugs.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Stopped Culprit Drugs:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.stopped_culprit_drugs.join('\n')}
                      onChange={(e) => updateField(['management_monitoring', 'stopped_culprit_drugs'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One drug per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.management_monitoring.stopped_culprit_drugs.map((drug: string, index: number) => (
                        <ViewListItem key={index}>{drug}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.management_monitoring?.active_treatments && displayData.management_monitoring.active_treatments.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Active Treatments:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.active_treatments.join('\n')}
                      onChange={(e) => updateField(['management_monitoring', 'active_treatments'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One treatment per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.management_monitoring.active_treatments.map((treatment: string, index: number) => (
                        <ViewListItem key={index}>{treatment}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.management_monitoring?.consults_initiated && displayData.management_monitoring.consults_initiated.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Consults Initiated:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.consults_initiated.join('\n')}
                      onChange={(e) => updateField(['management_monitoring', 'consults_initiated'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One consult per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.management_monitoring.consults_initiated.map((consult: string, index: number) => (
                        <ViewListItem key={index}>{consult}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
              
              {displayData.management_monitoring?.nutrition && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Nutrition:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.nutrition}
                      onChange={(e) => updateField(['management_monitoring', 'nutrition'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.management_monitoring.nutrition}</ViewText>
                  )}
                </>
              )}
              
              {displayData.management_monitoring?.vte_ppx && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>VTE Prophylaxis:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.vte_ppx}
                      onChange={(e) => updateField(['management_monitoring', 'vte_ppx'], e.target.value)}
                    />
                  ) : (
                    <ViewText>{displayData.management_monitoring.vte_ppx}</ViewText>
                  )}
                </>
              )}
              
              {displayData.management_monitoring?.monitoring_plan && displayData.management_monitoring.monitoring_plan.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Monitoring Plan:</strong></ViewText>
                  {isEditing ? (
                    <EditableTextarea
                      value={displayData.management_monitoring.monitoring_plan.join('\n')}
                      onChange={(e) => updateField(['management_monitoring', 'monitoring_plan'], e.target.value.split('\n').filter(Boolean))}
                      placeholder="One plan item per line"
                    />
                  ) : (
                    <ViewList>
                      {displayData.management_monitoring.monitoring_plan.map((plan: string, index: number) => (
                        <ViewListItem key={index}>{plan}</ViewListItem>
                      ))}
                    </ViewList>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Current Status */}
          {displayData?.current_status_last_48h && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Current Status (Last 48h)
              </ViewSectionTitle>
              {isEditing ? (
                <EditableTextarea
                  value={displayData.current_status_last_48h}
                  onChange={(e) => updateField(['current_status_last_48h'], e.target.value)}
                />
              ) : (
                <ViewText>{displayData.current_status_last_48h}</ViewText>
              )}
            </ViewSection>
          )}
        </RightColumn>
      </TwoColumnLayout>
    </ViewContainer>
  );
};

export default PatientReport;
