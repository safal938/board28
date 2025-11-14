import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  ChevronDown, 
  ChevronUp, 
  Download
} from 'lucide-react';

// Dynamic imports for print libraries
let jsPDF: any = null;
let html2canvas: any = null;

try {
  jsPDF = require('jspdf').jsPDF;
  html2canvas = require('html2canvas');
} catch (e) {
  console.log('Print libraries not installed. Run: npm install jspdf html2canvas');
}

const DiagnosticContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d0d0d0;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #5f6368;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #a0a0a0;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Section = styled.div<{ isExpanded: boolean }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
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
`;

const SectionContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${props => props.isExpanded ? '24px' : '0 24px'};
  background: white;
`;

const LabGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const LabCard = styled.div`
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
`;

const LabLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const LabValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LabIndicator = styled.span<{ type: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => {
    if (props.type.includes('↑↑')) return '#c53030';
    if (props.type.includes('↑')) return '#d69e2e';
    return '#38a169';
  }};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  min-width: 160px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #1a202c;
  line-height: 1.7;
  flex: 1;
`;

const SimpleList = styled.ul`
  margin: 0;
  padding-left: 24px;
  list-style: disc;
  margin-bottom: 16px;
`;

const SimpleListItem = styled.li`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.8;
  margin-bottom: 8px;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 24px;
  list-style: disc;
`;

const ListItem = styled.li`
  font-size: 15px;
  color: #2d3748;
  line-height: 1.8;
  margin-bottom: 8px;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 15px;
  color: #1a202c;
  line-height: 1.7;
  border-left: 3px solid #e0e0e0;
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #999;
  border-radius: 3px;
  background: white;
  flex-shrink: 0;
  margin-top: 2px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: #f5f5f5;
  color: #1a202c;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
`;

const HighlightBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
`;

const HighlightLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HighlightText = styled.div`
  font-size: 15px;
  color: #1a202c;
  line-height: 1.7;
`;

const SubHeading = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
  margin-top: 20px;
  margin-bottom: 12px;
`;

interface DILIDiagnosticProps {
  pattern: {
    classification: string;
    R_ratio: number;
    keyLabs: Array<{ label: string; value: string; note: string }>;
    clinicalFeatures: string[];
  };
  causality: {
    primaryDrug: string;
    contributingFactors: string[];
    mechanisticRationale: string[];
  };
  severity: {
    features: string[];
    prognosis: string;
  };
  management: {
    immediateActions: string[];
    consults: string[];
    monitoringPlan: string[];
  };
}

const DILIDiagnostic: React.FC<DILIDiagnosticProps> = ({
  pattern,
  causality,
  severity,
  management,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    pattern: true,
    causality: true,
    severity: true,
    management: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDownload = async () => {
    if (!jsPDF || !html2canvas) {
      alert('PDF libraries not installed. Please run: npm install jspdf html2canvas');
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    try {
      // Expand all sections for PDF
      const originalState = { ...expandedSections };
      setExpandedSections({
        pattern: true,
        causality: true,
        severity: true,
        management: true,
      });

      // Wait for sections to expand
      await new Promise(resolve => setTimeout(resolve, 300));

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
      pdf.save(`DILI_Diagnostic_${timestamp}.pdf`);

      // Restore original state
      setExpandedSections(originalState);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <DiagnosticContainer ref={containerRef}>
      <Header>
        <Title>DILI Diagnostic Panel</Title>
        <ActionButtons>
          <ActionButton onClick={handleDownload}>
            <Download />
            Export PDF
          </ActionButton>
        </ActionButtons>
      </Header>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          {/* Pattern Recognition Section */}
          <Section isExpanded={expandedSections.pattern}>
            <SectionHeader onClick={() => toggleSection('pattern')}>
              <SectionTitle>Pattern Recognition</SectionTitle>
              {expandedSections.pattern ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </SectionHeader>
            <SectionContent isExpanded={expandedSections.pattern}>
              <div style={{ marginBottom: '20px' }}>
                <Badge>Classification: {pattern.classification}</Badge>
                <Badge>R-Ratio: {pattern.R_ratio}</Badge>
              </div>

              <SubHeading>Key Laboratory Values</SubHeading>
              <LabGrid>
                {pattern.keyLabs.map((lab, index) => (
                  <LabCard key={index}>
                    <LabLabel>{lab.label}</LabLabel>
                    <LabValue>
                      {lab.value}
                      <LabIndicator type={lab.note}>{lab.note}</LabIndicator>
                    </LabValue>
                  </LabCard>
                ))}
              </LabGrid>

              <SubHeading>Clinical Features</SubHeading>
              <SimpleList>
                {pattern.clinicalFeatures.map((feature, index) => (
                  <SimpleListItem key={index}>{feature}</SimpleListItem>
                ))}
              </SimpleList>
            </SectionContent>
          </Section>

          {/* Causality Analysis Section */}
          <Section isExpanded={expandedSections.causality}>
            <SectionHeader onClick={() => toggleSection('causality')}>
              <SectionTitle>Causality Analysis</SectionTitle>
              {expandedSections.causality ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </SectionHeader>
            <SectionContent isExpanded={expandedSections.causality}>
              <InfoRow>
                <InfoLabel>Primary Drug</InfoLabel>
                <InfoValue>
                  <strong>{causality.primaryDrug}</strong>
                </InfoValue>
              </InfoRow>

              <SubHeading>Contributing Factors</SubHeading>
              <SimpleList>
                {causality.contributingFactors.map((factor, index) => (
                  <SimpleListItem key={index}>{factor}</SimpleListItem>
                ))}
              </SimpleList>

              <SubHeading>Mechanistic Rationale</SubHeading>
              <List>
                {causality.mechanisticRationale.map((rationale, index) => (
                  <ListItem key={index}>{rationale}</ListItem>
                ))}
              </List>
            </SectionContent>
          </Section>

          {/* Severity Assessment Section */}
          <Section isExpanded={expandedSections.severity}>
            <SectionHeader onClick={() => toggleSection('severity')}>
              <SectionTitle>Severity Assessment</SectionTitle>
              {expandedSections.severity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </SectionHeader>
            <SectionContent isExpanded={expandedSections.severity}>
              <SubHeading>Clinical Features</SubHeading>
              <SimpleList>
                {severity.features.map((feature, index) => (
                  <SimpleListItem key={index}>{feature}</SimpleListItem>
                ))}
              </SimpleList>

              <HighlightBox>
                <HighlightLabel>Prognosis</HighlightLabel>
                <HighlightText>{severity.prognosis}</HighlightText>
              </HighlightBox>
            </SectionContent>
          </Section>
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          {/* Management Plan Section */}
          <Section isExpanded={expandedSections.management}>
            <SectionHeader onClick={() => toggleSection('management')}>
              <SectionTitle>Management Plan</SectionTitle>
              {expandedSections.management ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </SectionHeader>
            <SectionContent isExpanded={expandedSections.management}>
              <SubHeading>Immediate Actions</SubHeading>
              {management.immediateActions.map((action, index) => (
                <ChecklistItem key={index}>
                  <Checkbox />
                  {action}
                </ChecklistItem>
              ))}

              <SubHeading>Consultations Required</SubHeading>
              {management.consults.map((consult, index) => (
                <ChecklistItem key={index}>
                  <Checkbox />
                  {consult}
                </ChecklistItem>
              ))}

              <SubHeading>Monitoring Plan</SubHeading>
              <List>
                {management.monitoringPlan.map((plan, index) => (
                  <ListItem key={index}>{plan}</ListItem>
                ))}
              </List>
            </SectionContent>
          </Section>
        </RightColumn>
      </TwoColumnLayout>
    </DiagnosticContainer>
  );
};

export default DILIDiagnostic;
