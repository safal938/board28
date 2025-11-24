import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Edit2, Save, X, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, Heart } from 'lucide-react';

// View Mode Styles
const ViewContainer = styled.div`
  
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
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  width: 100%;
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

interface PatientReportProps {
  onEdit?: () => void;
  onSave?: (data: any) => void;
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
}

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

const PatientReport: React.FC<PatientReportProps> = ({ patientData, onEdit, onSave }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(patientData || {});

  // Update formData when patientData changes from props (e.g. from backend update)
  React.useEffect(() => {
    if (patientData) {
      setFormData(patientData);
    }
  }, [patientData]);

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
    setFormData(patientData || {});
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

  if (!patientData && !isEditing) {
    return <div>No patient data available</div>;
  }

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
          {/* Patient Demographics */}
          <ViewSection>
            <ViewSectionTitle>
              <User />
              Patient Demographics
            </ViewSectionTitle>
            {isEditing ? (
              <>
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                <Label>MRN</Label>
                <Input value={formData.mrn || ''} onChange={(e) => handleChange('mrn', e.target.value)} />
                <Label>Age/Sex</Label>
                <Input value={formData.age_sex || ''} onChange={(e) => handleChange('age_sex', e.target.value)} />
                <Label>Date of Summary</Label>
                <Input value={formData.date_of_summary || ''} onChange={(e) => handleChange('date_of_summary', e.target.value)} />
              </>
            ) : (
              <ViewText>
                <strong>Name:</strong> {formData.name}<br/>
                <strong>MRN:</strong> {formData.mrn}<br/>
                <strong>Age/Sex:</strong> {formData.age_sex}<br/>
                <strong>Date of Summary:</strong> {formData.date_of_summary}
              </ViewText>
            )}
          </ViewSection>

          {/* One Sentence Impression */}
          {(formData.one_sentence_impression || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Clinical Impression
              </ViewSectionTitle>
              {isEditing ? (
                <TextArea 
                  value={formData.one_sentence_impression || ''} 
                  onChange={(e) => handleChange('one_sentence_impression', e.target.value)} 
                />
              ) : (
                <HighlightBox>
                  <ViewText>{formData.one_sentence_impression}</ViewText>
                </HighlightBox>
              )}
            </ViewSection>
          )}

          {/* Clinical Context Baseline */}
          {(formData.clinical_context_baseline || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Heart />
                Clinical Context - Baseline
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Comorbidities (one per line)</Label>
                  <TextArea 
                    value={(formData.clinical_context_baseline?.comorbidities || []).join('\n')} 
                    onChange={(e) => handleArrayChange('clinical_context_baseline.comorbidities', e.target.value)} 
                  />
                  <Label>Key Baseline Labs</Label>
                  <TextArea 
                    value={formData.clinical_context_baseline?.key_baseline_labs || ''} 
                    onChange={(e) => handleChange('clinical_context_baseline.key_baseline_labs', e.target.value)} 
                  />
                  <Label>Social History</Label>
                  <TextArea 
                    value={formData.clinical_context_baseline?.social_history || ''} 
                    onChange={(e) => handleChange('clinical_context_baseline.social_history', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.clinical_context_baseline?.comorbidities && formData.clinical_context_baseline.comorbidities.length > 0 && (
                    <>
                      <ViewText><strong>Comorbidities:</strong></ViewText>
                      <ViewList>
                        {formData.clinical_context_baseline.comorbidities.map((item: string, index: number) => (
                          <ViewListItem key={index}>{item}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.clinical_context_baseline?.key_baseline_labs && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Key Baseline Labs:</strong><br/>
                      {formData.clinical_context_baseline.key_baseline_labs}
                    </ViewText>
                  )}
                  
                  {formData.clinical_context_baseline?.social_history && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Social History:</strong><br/>
                      {formData.clinical_context_baseline.social_history}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Suspect Drug Timeline */}
          {(formData.suspect_drug_timeline || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Suspect Drug Timeline
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Chief Complaint</Label>
                  <TextArea 
                    value={formData.suspect_drug_timeline?.chief_complaint || ''} 
                    onChange={(e) => handleChange('suspect_drug_timeline.chief_complaint', e.target.value)} 
                  />
                  <Label>History of Present Illness</Label>
                  <TextArea 
                    value={formData.suspect_drug_timeline?.hopi_significant_points || ''} 
                    onChange={(e) => handleChange('suspect_drug_timeline.hopi_significant_points', e.target.value)} 
                  />
                  <Label>Chronic Medications (one per line)</Label>
                  <TextArea 
                    value={(formData.suspect_drug_timeline?.chronic_medications || []).join('\n')} 
                    onChange={(e) => handleArrayChange('suspect_drug_timeline.chronic_medications', e.target.value)} 
                  />
                  <Label>Acute Medication Onset</Label>
                  <TextArea 
                    value={formData.suspect_drug_timeline?.acute_medication_onset || ''} 
                    onChange={(e) => handleChange('suspect_drug_timeline.acute_medication_onset', e.target.value)} 
                  />
                  <Label>Possibilities for DILI (one per line)</Label>
                  <TextArea 
                    value={(formData.suspect_drug_timeline?.possibilities_for_dili || []).join('\n')} 
                    onChange={(e) => handleArrayChange('suspect_drug_timeline.possibilities_for_dili', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.suspect_drug_timeline?.chief_complaint && (
                    <ViewText>
                      <strong>Chief Complaint:</strong><br/>
                      {formData.suspect_drug_timeline.chief_complaint}
                    </ViewText>
                  )}
                  
                  {formData.suspect_drug_timeline?.hopi_significant_points && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>History of Present Illness:</strong><br/>
                      {formData.suspect_drug_timeline.hopi_significant_points}
                    </ViewText>
                  )}
                  
                  {formData.suspect_drug_timeline?.chronic_medications && formData.suspect_drug_timeline.chronic_medications.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Chronic Medications:</strong></ViewText>
                      <ViewList>
                        {formData.suspect_drug_timeline.chronic_medications.map((med: string, index: number) => (
                          <ViewListItem key={index}>{med}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.suspect_drug_timeline?.acute_medication_onset && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Acute Medication Onset:</strong><br/>
                      {formData.suspect_drug_timeline.acute_medication_onset}
                    </ViewText>
                  )}
                  
                  {formData.suspect_drug_timeline?.possibilities_for_dili && formData.suspect_drug_timeline.possibilities_for_dili.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Possibilities for DILI:</strong></ViewText>
                      <ViewList>
                        {formData.suspect_drug_timeline.possibilities_for_dili.map((item: string, index: number) => (
                          <ViewListItem key={index}>{item}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Rule Out Complete */}
          {(formData.rule_out_complete || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Rule Out Assessment
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Viral Hepatitis</Label>
                  <TextArea 
                    value={formData.rule_out_complete?.viral_hepatitis || ''} 
                    onChange={(e) => handleChange('rule_out_complete.viral_hepatitis', e.target.value)} 
                  />
                  <Label>Autoimmune</Label>
                  <TextArea 
                    value={formData.rule_out_complete?.autoimmune || ''} 
                    onChange={(e) => handleChange('rule_out_complete.autoimmune', e.target.value)} 
                  />
                  <Label>Other Competing Diagnoses</Label>
                  <TextArea 
                    value={formData.rule_out_complete?.other_competing_dx_ruled_out || ''} 
                    onChange={(e) => handleChange('rule_out_complete.other_competing_dx_ruled_out', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.rule_out_complete?.viral_hepatitis && (
                    <ViewText>
                      <strong>Viral Hepatitis:</strong><br/>
                      {formData.rule_out_complete.viral_hepatitis}
                    </ViewText>
                  )}
                  
                  {formData.rule_out_complete?.autoimmune && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Autoimmune:</strong><br/>
                      {formData.rule_out_complete.autoimmune}
                    </ViewText>
                  )}
                  
                  {formData.rule_out_complete?.other_competing_dx_ruled_out && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Other Competing Diagnoses:</strong><br/>
                      {formData.rule_out_complete.other_competing_dx_ruled_out}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Severity & Prognosis */}
          {(formData.severity_prognosis || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                Severity & Prognosis
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Severity Features (one per line)</Label>
                  <TextArea 
                    value={(formData.severity_prognosis?.severity_features || []).join('\n')} 
                    onChange={(e) => handleArrayChange('severity_prognosis.severity_features', e.target.value)} 
                  />
                  <Label>Prognosis Statement</Label>
                  <TextArea 
                    value={formData.severity_prognosis?.prognosis_statement || ''} 
                    onChange={(e) => handleChange('severity_prognosis.prognosis_statement', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.severity_prognosis?.severity_features && formData.severity_prognosis.severity_features.length > 0 && (
                    <>
                      <ViewText><strong>Severity Features:</strong></ViewText>
                      <ViewList>
                        {formData.severity_prognosis.severity_features.map((feature: string, index: number) => (
                          <ViewListItem key={index}>{feature}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.severity_prognosis?.prognosis_statement && (
                    <HighlightBox style={{ marginTop: '12px' }}>
                      <ViewText>
                        <strong>Prognosis:</strong><br/>
                        {formData.severity_prognosis.prognosis_statement}
                      </ViewText>
                    </HighlightBox>
                  )}
                </>
              )}
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Injury Pattern & Trends */}
          {(formData.injury_pattern_trends || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Injury Pattern & Trends
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Pattern</Label>
                  <TextArea 
                    value={formData.injury_pattern_trends?.pattern || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.pattern', e.target.value)} 
                  />
                  <Label>Hy's Law</Label>
                  <TextArea 
                    value={formData.injury_pattern_trends?.hys_law || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.hys_law', e.target.value)} 
                  />
                  <Label>MELD-Na</Label>
                  <TextArea 
                    value={formData.injury_pattern_trends?.meld_na || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.meld_na', e.target.value)} 
                  />
                  <Label>Peak Labs - ALT</Label>
                  <Input 
                    value={formData.injury_pattern_trends?.lft_data_peak_onset?.ALT || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_data_peak_onset.ALT', e.target.value)} 
                  />
                  <Label>Peak Labs - AST</Label>
                  <Input 
                    value={formData.injury_pattern_trends?.lft_data_peak_onset?.AST || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_data_peak_onset.AST', e.target.value)} 
                  />
                  <Label>Peak Labs - Alk Phos</Label>
                  <Input 
                    value={formData.injury_pattern_trends?.lft_data_peak_onset?.Alk_Phos || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_data_peak_onset.Alk_Phos', e.target.value)} 
                  />
                  <Label>Peak Labs - Total Bilirubin</Label>
                  <Input 
                    value={formData.injury_pattern_trends?.lft_data_peak_onset?.T_Bili || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_data_peak_onset.T_Bili', e.target.value)} 
                  />
                  <Label>Peak Labs - INR</Label>
                  <Input 
                    value={formData.injury_pattern_trends?.lft_data_peak_onset?.INR || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_data_peak_onset.INR', e.target.value)} 
                  />
                  <Label>LFT Trends</Label>
                  <TextArea 
                    value={formData.injury_pattern_trends?.lft_sparklines_trends || ''} 
                    onChange={(e) => handleChange('injury_pattern_trends.lft_sparklines_trends', e.target.value)} 
                  />
                  <Label>Complications (one per line)</Label>
                  <TextArea 
                    value={(formData.injury_pattern_trends?.complications || []).join('\n')} 
                    onChange={(e) => handleArrayChange('injury_pattern_trends.complications', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.injury_pattern_trends?.pattern && (
                    <ViewText>
                      <strong>Pattern:</strong><br/>
                      {formData.injury_pattern_trends.pattern}
                    </ViewText>
                  )}
                  
                  {formData.injury_pattern_trends?.hys_law && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Hy's Law:</strong><br/>
                      {formData.injury_pattern_trends.hys_law}
                    </ViewText>
                  )}
                  
                  {formData.injury_pattern_trends?.meld_na && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>MELD-Na:</strong><br/>
                      {formData.injury_pattern_trends.meld_na}
                    </ViewText>
                  )}
                  
                  {formData.injury_pattern_trends?.lft_data_peak_onset && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Peak Laboratory Values:</strong></ViewText>
                      <LabGrid>
                        {formData.injury_pattern_trends.lft_data_peak_onset.ALT && (
                          <LabCard>
                            <LabLabel>ALT</LabLabel>
                            <LabValue>{formData.injury_pattern_trends.lft_data_peak_onset.ALT}</LabValue>
                          </LabCard>
                        )}
                        {formData.injury_pattern_trends.lft_data_peak_onset.AST && (
                          <LabCard>
                            <LabLabel>AST</LabLabel>
                            <LabValue>{formData.injury_pattern_trends.lft_data_peak_onset.AST}</LabValue>
                          </LabCard>
                        )}
                        {formData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos && (
                          <LabCard>
                            <LabLabel>Alk Phos</LabLabel>
                            <LabValue>{formData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos}</LabValue>
                          </LabCard>
                        )}
                        {formData.injury_pattern_trends.lft_data_peak_onset.T_Bili && (
                          <LabCard>
                            <LabLabel>Total Bilirubin</LabLabel>
                            <LabValue>{formData.injury_pattern_trends.lft_data_peak_onset.T_Bili}</LabValue>
                          </LabCard>
                        )}
                        {formData.injury_pattern_trends.lft_data_peak_onset.INR && (
                          <LabCard>
                            <LabLabel>INR</LabLabel>
                            <LabValue>{formData.injury_pattern_trends.lft_data_peak_onset.INR}</LabValue>
                          </LabCard>
                        )}
                      </LabGrid>
                    </>
                  )}
                  
                  {formData.injury_pattern_trends?.lft_sparklines_trends && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>LFT Trends:</strong><br/>
                      {formData.injury_pattern_trends.lft_sparklines_trends}
                    </ViewText>
                  )}
                  
                  {formData.injury_pattern_trends?.complications && formData.injury_pattern_trends.complications.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Complications:</strong></ViewText>
                      <ViewList>
                        {formData.injury_pattern_trends.complications.map((comp: string, index: number) => (
                          <ViewListItem key={index}>{comp}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Key Diagnostics */}
          {(formData.key_diagnostics || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Key Diagnostics
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Imaging Performed</Label>
                  <TextArea 
                    value={formData.key_diagnostics?.imaging_performed || ''} 
                    onChange={(e) => handleChange('key_diagnostics.imaging_performed', e.target.value)} 
                  />
                  <Label>Biopsy</Label>
                  <TextArea 
                    value={formData.key_diagnostics?.biopsy || ''} 
                    onChange={(e) => handleChange('key_diagnostics.biopsy', e.target.value)} 
                  />
                  <Label>Methotrexate Level</Label>
                  <TextArea 
                    value={formData.key_diagnostics?.methotrexate_level || ''} 
                    onChange={(e) => handleChange('key_diagnostics.methotrexate_level', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.key_diagnostics?.imaging_performed && (
                    <ViewText>
                      <strong>Imaging:</strong><br/>
                      {formData.key_diagnostics.imaging_performed}
                    </ViewText>
                  )}
                  
                  {formData.key_diagnostics?.biopsy && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Biopsy:</strong><br/>
                      {formData.key_diagnostics.biopsy}
                    </ViewText>
                  )}
                  
                  {formData.key_diagnostics?.methotrexate_level && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Methotrexate Level:</strong><br/>
                      {formData.key_diagnostics.methotrexate_level}
                    </ViewText>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Management & Monitoring */}
          {(formData.management_monitoring || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Management & Monitoring
              </ViewSectionTitle>
              
              {isEditing ? (
                <>
                  <Label>Causality Assessment (RUCAM)</Label>
                  <TextArea 
                    value={formData.management_monitoring?.causality_rucam || ''} 
                    onChange={(e) => handleChange('management_monitoring.causality_rucam', e.target.value)} 
                  />
                  <Label>Stopped Culprit Drugs (one per line)</Label>
                  <TextArea 
                    value={(formData.management_monitoring?.stopped_culprit_drugs || []).join('\n')} 
                    onChange={(e) => handleArrayChange('management_monitoring.stopped_culprit_drugs', e.target.value)} 
                  />
                  <Label>Active Treatments (one per line)</Label>
                  <TextArea 
                    value={(formData.management_monitoring?.active_treatments || []).join('\n')} 
                    onChange={(e) => handleArrayChange('management_monitoring.active_treatments', e.target.value)} 
                  />
                  <Label>Consults Initiated (one per line)</Label>
                  <TextArea 
                    value={(formData.management_monitoring?.consults_initiated || []).join('\n')} 
                    onChange={(e) => handleArrayChange('management_monitoring.consults_initiated', e.target.value)} 
                  />
                  <Label>Nutrition</Label>
                  <TextArea 
                    value={formData.management_monitoring?.nutrition || ''} 
                    onChange={(e) => handleChange('management_monitoring.nutrition', e.target.value)} 
                  />
                  <Label>VTE Prophylaxis</Label>
                  <TextArea 
                    value={formData.management_monitoring?.vte_ppx || ''} 
                    onChange={(e) => handleChange('management_monitoring.vte_ppx', e.target.value)} 
                  />
                  <Label>Monitoring Plan (one per line)</Label>
                  <TextArea 
                    value={(formData.management_monitoring?.monitoring_plan || []).join('\n')} 
                    onChange={(e) => handleArrayChange('management_monitoring.monitoring_plan', e.target.value)} 
                  />
                </>
              ) : (
                <>
                  {formData.management_monitoring?.causality_rucam && (
                    <HighlightBox>
                      <ViewText>
                        <strong>Causality Assessment:</strong><br/>
                        {formData.management_monitoring.causality_rucam}
                      </ViewText>
                    </HighlightBox>
                  )}
                  
                  {formData.management_monitoring?.stopped_culprit_drugs && formData.management_monitoring.stopped_culprit_drugs.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Stopped Culprit Drugs:</strong></ViewText>
                      <ViewList>
                        {formData.management_monitoring.stopped_culprit_drugs.map((drug: string, index: number) => (
                          <ViewListItem key={index}>{drug}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.management_monitoring?.active_treatments && formData.management_monitoring.active_treatments.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Active Treatments:</strong></ViewText>
                      <ViewList>
                        {formData.management_monitoring.active_treatments.map((treatment: string, index: number) => (
                          <ViewListItem key={index}>{treatment}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.management_monitoring?.consults_initiated && formData.management_monitoring.consults_initiated.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Consults Initiated:</strong></ViewText>
                      <ViewList>
                        {formData.management_monitoring.consults_initiated.map((consult: string, index: number) => (
                          <ViewListItem key={index}>{consult}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                  
                  {formData.management_monitoring?.nutrition && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>Nutrition:</strong><br/>
                      {formData.management_monitoring.nutrition}
                    </ViewText>
                  )}
                  
                  {formData.management_monitoring?.vte_ppx && (
                    <ViewText style={{ marginTop: '12px' }}>
                      <strong>VTE Prophylaxis:</strong><br/>
                      {formData.management_monitoring.vte_ppx}
                    </ViewText>
                  )}
                  
                  {formData.management_monitoring?.monitoring_plan && formData.management_monitoring.monitoring_plan.length > 0 && (
                    <>
                      <ViewText style={{ marginTop: '12px' }}><strong>Monitoring Plan:</strong></ViewText>
                      <ViewList>
                        {formData.management_monitoring.monitoring_plan.map((plan: string, index: number) => (
                          <ViewListItem key={index}>{plan}</ViewListItem>
                        ))}
                      </ViewList>
                    </>
                  )}
                </>
              )}
            </ViewSection>
          )}

          {/* Current Status */}
          {(formData.current_status_last_48h || isEditing) && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Current Status (Last 48h)
              </ViewSectionTitle>
              {isEditing ? (
                <TextArea 
                  value={formData.current_status_last_48h || ''} 
                  onChange={(e) => handleChange('current_status_last_48h', e.target.value)} 
                />
              ) : (
                <ViewText>{formData.current_status_last_48h}</ViewText>
              )}
            </ViewSection>
          )}
        </RightColumn>
      </TwoColumnLayout>
    </ViewContainer>
  );
};

export default PatientReport;
