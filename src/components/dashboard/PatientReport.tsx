import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Edit2, Save, X, Download, Printer, User, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp, Beaker, Heart } from 'lucide-react';

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

const PatientReport: React.FC<PatientReportProps> = ({ patientData }) => {
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

  if (!patientData) {
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
          {/* Patient Demographics */}
          <ViewSection>
            <ViewSectionTitle>
              <User />
              Patient Demographics
            </ViewSectionTitle>
            <ViewText>
              <strong>Name:</strong> {patientData.name}<br/>
              <strong>MRN:</strong> {patientData.mrn}<br/>
              <strong>Age/Sex:</strong> {patientData.age_sex}<br/>
              <strong>Date of Summary:</strong> {patientData.date_of_summary}
            </ViewText>
          </ViewSection>

          {/* One Sentence Impression */}
          {patientData.one_sentence_impression && (
            <ViewSection>
              <ViewSectionTitle>
                <Stethoscope />
                Clinical Impression
              </ViewSectionTitle>
              <HighlightBox>
                <ViewText>{patientData.one_sentence_impression}</ViewText>
              </HighlightBox>
            </ViewSection>
          )}

          {/* Clinical Context Baseline */}
          {patientData.clinical_context_baseline && (
            <ViewSection>
              <ViewSectionTitle>
                <Heart />
                Clinical Context - Baseline
              </ViewSectionTitle>
              
              {patientData.clinical_context_baseline.comorbidities && patientData.clinical_context_baseline.comorbidities.length > 0 && (
                <>
                  <ViewText><strong>Comorbidities:</strong></ViewText>
                  <ViewList>
                    {patientData.clinical_context_baseline.comorbidities.map((item, index) => (
                      <ViewListItem key={index}>{item}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.clinical_context_baseline.key_baseline_labs && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Key Baseline Labs:</strong><br/>
                  {patientData.clinical_context_baseline.key_baseline_labs}
                </ViewText>
              )}
              
              {patientData.clinical_context_baseline.social_history && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Social History:</strong><br/>
                  {patientData.clinical_context_baseline.social_history}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Suspect Drug Timeline */}
          {patientData.suspect_drug_timeline && (
            <ViewSection>
              <ViewSectionTitle>
                <Pill />
                Suspect Drug Timeline
              </ViewSectionTitle>
              
              {patientData.suspect_drug_timeline.chief_complaint && (
                <ViewText>
                  <strong>Chief Complaint:</strong><br/>
                  {patientData.suspect_drug_timeline.chief_complaint}
                </ViewText>
              )}
              
              {patientData.suspect_drug_timeline.hopi_significant_points && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>History of Present Illness:</strong><br/>
                  {patientData.suspect_drug_timeline.hopi_significant_points}
                </ViewText>
              )}
              
              {patientData.suspect_drug_timeline.chronic_medications && patientData.suspect_drug_timeline.chronic_medications.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Chronic Medications:</strong></ViewText>
                  <ViewList>
                    {patientData.suspect_drug_timeline.chronic_medications.map((med, index) => (
                      <ViewListItem key={index}>{med}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.suspect_drug_timeline.acute_medication_onset && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Acute Medication Onset:</strong><br/>
                  {patientData.suspect_drug_timeline.acute_medication_onset}
                </ViewText>
              )}
              
              {patientData.suspect_drug_timeline.possibilities_for_dili && patientData.suspect_drug_timeline.possibilities_for_dili.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Possibilities for DILI:</strong></ViewText>
                  <ViewList>
                    {patientData.suspect_drug_timeline.possibilities_for_dili.map((item, index) => (
                      <ViewListItem key={index}>{item}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
            </ViewSection>
          )}

          {/* Rule Out Complete */}
          {patientData.rule_out_complete && (
            <ViewSection>
              <ViewSectionTitle>
                <AlertCircle />
                Rule Out Assessment
              </ViewSectionTitle>
              
              {patientData.rule_out_complete.viral_hepatitis && (
                <ViewText>
                  <strong>Viral Hepatitis:</strong><br/>
                  {patientData.rule_out_complete.viral_hepatitis}
                </ViewText>
              )}
              
              {patientData.rule_out_complete.autoimmune && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Autoimmune:</strong><br/>
                  {patientData.rule_out_complete.autoimmune}
                </ViewText>
              )}
              
              {patientData.rule_out_complete.other_competing_dx_ruled_out && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Other Competing Diagnoses:</strong><br/>
                  {patientData.rule_out_complete.other_competing_dx_ruled_out}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Severity & Prognosis */}
          {patientData.severity_prognosis && (
            <ViewSection>
              <ViewSectionTitle>
                <TrendingUp />
                Severity & Prognosis
              </ViewSectionTitle>
              
              {patientData.severity_prognosis.severity_features && patientData.severity_prognosis.severity_features.length > 0 && (
                <>
                  <ViewText><strong>Severity Features:</strong></ViewText>
                  <ViewList>
                    {patientData.severity_prognosis.severity_features.map((feature, index) => (
                      <ViewListItem key={index}>{feature}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.severity_prognosis.prognosis_statement && (
                <HighlightBox style={{ marginTop: '12px' }}>
                  <ViewText>
                    <strong>Prognosis:</strong><br/>
                    {patientData.severity_prognosis.prognosis_statement}
                  </ViewText>
                </HighlightBox>
              )}
            </ViewSection>
          )}
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Injury Pattern & Trends */}
          {patientData.injury_pattern_trends && (
            <ViewSection>
              <ViewSectionTitle>
                <Beaker />
                Injury Pattern & Trends
              </ViewSectionTitle>
              
              {patientData.injury_pattern_trends.pattern && (
                <ViewText>
                  <strong>Pattern:</strong><br/>
                  {patientData.injury_pattern_trends.pattern}
                </ViewText>
              )}
              
              {patientData.injury_pattern_trends.hys_law && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Hy's Law:</strong><br/>
                  {patientData.injury_pattern_trends.hys_law}
                </ViewText>
              )}
              
              {patientData.injury_pattern_trends.meld_na && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>MELD-Na:</strong><br/>
                  {patientData.injury_pattern_trends.meld_na}
                </ViewText>
              )}
              
              {patientData.injury_pattern_trends.lft_data_peak_onset && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Peak Laboratory Values:</strong></ViewText>
                  <LabGrid>
                    {patientData.injury_pattern_trends.lft_data_peak_onset.ALT && (
                      <LabCard>
                        <LabLabel>ALT</LabLabel>
                        <LabValue>{patientData.injury_pattern_trends.lft_data_peak_onset.ALT}</LabValue>
                      </LabCard>
                    )}
                    {patientData.injury_pattern_trends.lft_data_peak_onset.AST && (
                      <LabCard>
                        <LabLabel>AST</LabLabel>
                        <LabValue>{patientData.injury_pattern_trends.lft_data_peak_onset.AST}</LabValue>
                      </LabCard>
                    )}
                    {patientData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos && (
                      <LabCard>
                        <LabLabel>Alk Phos</LabLabel>
                        <LabValue>{patientData.injury_pattern_trends.lft_data_peak_onset.Alk_Phos}</LabValue>
                      </LabCard>
                    )}
                    {patientData.injury_pattern_trends.lft_data_peak_onset.T_Bili && (
                      <LabCard>
                        <LabLabel>Total Bilirubin</LabLabel>
                        <LabValue>{patientData.injury_pattern_trends.lft_data_peak_onset.T_Bili}</LabValue>
                      </LabCard>
                    )}
                    {patientData.injury_pattern_trends.lft_data_peak_onset.INR && (
                      <LabCard>
                        <LabLabel>INR</LabLabel>
                        <LabValue>{patientData.injury_pattern_trends.lft_data_peak_onset.INR}</LabValue>
                      </LabCard>
                    )}
                  </LabGrid>
                </>
              )}
              
              {patientData.injury_pattern_trends.lft_sparklines_trends && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>LFT Trends:</strong><br/>
                  {patientData.injury_pattern_trends.lft_sparklines_trends}
                </ViewText>
              )}
              
              {patientData.injury_pattern_trends.complications && patientData.injury_pattern_trends.complications.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Complications:</strong></ViewText>
                  <ViewList>
                    {patientData.injury_pattern_trends.complications.map((comp, index) => (
                      <ViewListItem key={index}>{comp}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
            </ViewSection>
          )}

          {/* Key Diagnostics */}
          {patientData.key_diagnostics && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Key Diagnostics
              </ViewSectionTitle>
              
              {patientData.key_diagnostics.imaging_performed && (
                <ViewText>
                  <strong>Imaging:</strong><br/>
                  {patientData.key_diagnostics.imaging_performed}
                </ViewText>
              )}
              
              {patientData.key_diagnostics.biopsy && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Biopsy:</strong><br/>
                  {patientData.key_diagnostics.biopsy}
                </ViewText>
              )}
              
              {patientData.key_diagnostics.methotrexate_level && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Methotrexate Level:</strong><br/>
                  {patientData.key_diagnostics.methotrexate_level}
                </ViewText>
              )}
            </ViewSection>
          )}

          {/* Management & Monitoring */}
          {patientData.management_monitoring && (
            <ViewSection>
              <ViewSectionTitle>
                <ClipboardList />
                Management & Monitoring
              </ViewSectionTitle>
              
              {patientData.management_monitoring.causality_rucam && (
                <HighlightBox>
                  <ViewText>
                    <strong>Causality Assessment:</strong><br/>
                    {patientData.management_monitoring.causality_rucam}
                  </ViewText>
                </HighlightBox>
              )}
              
              {patientData.management_monitoring.stopped_culprit_drugs && patientData.management_monitoring.stopped_culprit_drugs.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Stopped Culprit Drugs:</strong></ViewText>
                  <ViewList>
                    {patientData.management_monitoring.stopped_culprit_drugs.map((drug, index) => (
                      <ViewListItem key={index}>{drug}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.management_monitoring.active_treatments && patientData.management_monitoring.active_treatments.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Active Treatments:</strong></ViewText>
                  <ViewList>
                    {patientData.management_monitoring.active_treatments.map((treatment, index) => (
                      <ViewListItem key={index}>{treatment}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.management_monitoring.consults_initiated && patientData.management_monitoring.consults_initiated.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Consults Initiated:</strong></ViewText>
                  <ViewList>
                    {patientData.management_monitoring.consults_initiated.map((consult, index) => (
                      <ViewListItem key={index}>{consult}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
              
              {patientData.management_monitoring.nutrition && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>Nutrition:</strong><br/>
                  {patientData.management_monitoring.nutrition}
                </ViewText>
              )}
              
              {patientData.management_monitoring.vte_ppx && (
                <ViewText style={{ marginTop: '12px' }}>
                  <strong>VTE Prophylaxis:</strong><br/>
                  {patientData.management_monitoring.vte_ppx}
                </ViewText>
              )}
              
              {patientData.management_monitoring.monitoring_plan && patientData.management_monitoring.monitoring_plan.length > 0 && (
                <>
                  <ViewText style={{ marginTop: '12px' }}><strong>Monitoring Plan:</strong></ViewText>
                  <ViewList>
                    {patientData.management_monitoring.monitoring_plan.map((plan, index) => (
                      <ViewListItem key={index}>{plan}</ViewListItem>
                    ))}
                  </ViewList>
                </>
              )}
            </ViewSection>
          )}

          {/* Current Status */}
          {patientData.current_status_last_48h && (
            <ViewSection>
              <ViewSectionTitle>
                <Activity />
                Current Status (Last 48h)
              </ViewSectionTitle>
              <ViewText>{patientData.current_status_last_48h}</ViewText>
            </ViewSection>
          )}
        </RightColumn>
      </TwoColumnLayout>
    </ViewContainer>
  );
};

export default PatientReport;
