import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, Save, X, Download, Printer, User, Calendar, Hash, Activity, AlertCircle, Pill, FileText, Stethoscope, ClipboardList, TrendingUp } from 'lucide-react';

// Dynamic imports for print libraries (will be installed separately)
let jsPDF: any = null;
let html2canvas: any = null;

// Try to import libraries if available
try {
  jsPDF = require('jspdf').jsPDF;
  html2canvas = require('html2canvas');
} catch (e) {
  console.log('Print libraries not installed. Run: npm install jspdf html2canvas');
}

// Shared input styles
const EditableInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 11pt;
  color: #000;
  padding: 4px;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;

  &:hover {
    background: #f8f9fa;
  }

  &:focus {
    outline: none;
    background: #e8f0fe;
  }
`;

const EditableTextArea = styled.textarea`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 11pt;
  color: #000;
  padding: 4px;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;

  &:hover {
    background: #f8f9fa;
  }

  &:focus {
    outline: none;
    background: #e8f0fe;
  }
`;

// View Mode Styles (Enhanced)
const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
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

// Edit Mode Styles
const EditContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow-y: auto;
  padding: 40px 20px;
`;

const DocumentContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  padding: 72px 96px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  min-height: 1056px;
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #1a202c;
`;

const EditToolbar = styled.div`
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
  border-bottom: none;
  padding: 12px 20px;
  margin: -72px -96px 32px -96px;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ToolbarButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ToolbarButton = styled.button<{ variant?: string }>`
  padding: 8px 16px;
  border: none;
  background: ${props => props.variant === 'primary' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.variant === 'primary' ? '#0891b2' : 'white'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.variant === 'primary' ? 'white' : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DocHeading = styled.div`
  font-size: 28pt;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 3px solid #e2e8f0;
`;

const DocSectionHeading = styled.div`
  font-size: 16pt;
  font-weight: 700;
  color: #0891b2;
  margin-top: 32px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
  border-left: 4px solid #0891b2;
  border-radius: 4px;
`;

const DocSubheading = styled.div`
  font-size: 13pt;
  font-weight: 600;
  color: #475569;
  margin-top: 20px;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #cbd5e1;
`;

const DocTable = styled.div`
  margin: 20px 0;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DocTableRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const DocTableCell = styled.div<{ header?: boolean }>`
  padding: 14px 16px;
  font-size: 11pt;
  border-right: 1px solid #e2e8f0;
  background: ${props => props.header ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' : 'white'};
  font-weight: ${props => props.header ? '700' : '400'};
  color: ${props => props.header ? '#334155' : '#1a202c'};

  &:last-child {
    border-right: none;
  }
`;

interface PatientReportProps {
  patientData?: {
    name?: string;
    date_of_birth?: string;
    age?: number;
    sex?: string;
    mrn?: string;
    primaryDiagnosis?: string;
    problem_list?: Array<{ name: string; status: string }>;
    allergies?: string[];
    medication_history?: Array<{ name: string; dose: string }>;
    acute_event_summary?: string;
    diagnosis_acute_event?: string[];
    causality?: string;
    management_recommendations?: string[];
  };
  onUpdate?: (updatedData: any) => void;
}

const PatientReport: React.FC<PatientReportProps> = ({ patientData, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Initialize with safe defaults
  const safePatientData = {
    name: patientData?.name || '',
    date_of_birth: patientData?.date_of_birth || '',
    age: patientData?.age || 0,
    sex: patientData?.sex || '',
    mrn: patientData?.mrn || '',
    primaryDiagnosis: patientData?.primaryDiagnosis || '',
    problem_list: patientData?.problem_list || [],
    allergies: patientData?.allergies || [],
    medication_history: patientData?.medication_history || [],
    acute_event_summary: patientData?.acute_event_summary || '',
    diagnosis_acute_event: patientData?.diagnosis_acute_event || [],
    causality: patientData?.causality || '',
    management_recommendations: patientData?.management_recommendations || []
  };
  
  const [editableData, setEditableData] = useState(safePatientData);
  const documentRef = useRef<HTMLDivElement>(null);

  // Update editableData when patientData prop changes
  useEffect(() => {
    const updatedData = {
      name: patientData?.name || '',
      date_of_birth: patientData?.date_of_birth || '',
      age: patientData?.age || 0,
      sex: patientData?.sex || '',
      mrn: patientData?.mrn || '',
      primaryDiagnosis: patientData?.primaryDiagnosis || '',
      problem_list: patientData?.problem_list || [],
      allergies: patientData?.allergies || [],
      medication_history: patientData?.medication_history || [],
      acute_event_summary: patientData?.acute_event_summary || '',
      diagnosis_acute_event: patientData?.diagnosis_acute_event || [],
      causality: patientData?.causality || '',
      management_recommendations: patientData?.management_recommendations || []
    };
    setEditableData(updatedData);
  }, [patientData]);

  const handleSave = () => {
    console.log('Saving document content:', editableData);
    
    // Call the onUpdate callback to persist changes to parent
    if (onUpdate) {
      onUpdate(editableData);
    }
    
    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Reset to original with safe defaults
    const resetData = {
      name: patientData?.name || '',
      date_of_birth: patientData?.date_of_birth || '',
      age: patientData?.age || 0,
      sex: patientData?.sex || '',
      mrn: patientData?.mrn || '',
      primaryDiagnosis: patientData?.primaryDiagnosis || '',
      problem_list: patientData?.problem_list || [],
      allergies: patientData?.allergies || [],
      medication_history: patientData?.medication_history || [],
      acute_event_summary: patientData?.acute_event_summary || '',
      diagnosis_acute_event: patientData?.diagnosis_acute_event || [],
      causality: patientData?.causality || '',
      management_recommendations: patientData?.management_recommendations || []
    };
    setEditableData(resetData);
    setIsEditMode(false);
  };

  const handleDownload = async () => {
    if (!jsPDF || !html2canvas) {
      alert('PDF libraries not installed. Please run: npm install jspdf html2canvas');
      return;
    }

    const element = documentRef.current || document.querySelector('[data-print-content]');
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
      const filename = `Patient_Report_${patientData.name.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    console.log('Print button clicked');
    
    const element = documentRef.current;
    
    if (!element) {
      console.error('Print element not found, using fallback');
      window.print();
      return;
    }

    console.log('Element found, opening print window');

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        console.error('Pop-up blocked');
        alert('Please allow pop-ups to print. Using fallback print...');
        window.print();
        return;
      }

      console.log('Print window opened successfully');
      
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Report - ${editableData.name}</title>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #000;
                background: white;
                padding: 15mm;
                font-size: 11pt;
              }
              
              @media print {
                body { padding: 0; }
                @page { 
                  margin: 20mm 15mm; 
                  size: A4 portrait; 
                }
              }
              
              .print-header {
                text-align: right;
                font-size: 9pt;
                color: #666;
                font-style: italic;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e0e0e0;
              }
              
              .print-footer {
                text-align: center;
                font-size: 9pt;
                color: #666;
                font-style: italic;
                margin-top: 40px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
              }
              
              button, svg, [role="button"], [data-toolbar], input, textarea {
                display: none !important;
              }
              
              h1 {
                font-size: 22pt;
                font-weight: 700;
                margin-bottom: 25px;
                padding-bottom: 12px;
                border-bottom: 3px solid #000;
                color: #000;
              }
              
              h2 {
                font-size: 14pt;
                font-weight: 700;
                margin-top: 25px;
                margin-bottom: 12px;
                padding-bottom: 6px;
                border-bottom: 2px solid #ccc;
                color: #000;
              }
              
              h3 {
                font-size: 12pt;
                font-weight: 600;
                margin-top: 18px;
                margin-bottom: 10px;
                color: #000;
              }
              
              p {
                font-size: 11pt;
                margin-bottom: 12px;
                line-height: 1.7;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 18px 0;
                border: 1px solid #ccc;
              }
              
              tr {
                border-bottom: 1px solid #ddd;
              }
              
              tr:last-child {
                border-bottom: none;
              }
              
              td {
                padding: 10px 12px;
                font-size: 11pt;
                border-right: 1px solid #ddd;
                vertical-align: top;
              }
              
              td:last-child {
                border-right: none;
              }
              
              td:first-child {
                background: #f8f8f8;
                font-weight: 600;
                width: 180px;
                color: #333;
              }
              
              strong {
                font-weight: 700;
                color: #000;
              }
              
              h2 {
                page-break-after: avoid;
              }
              
              table {
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <div class="print-header">Generated By MedForce AI</div>
            ${element.innerHTML}
            <div class="print-footer">Generated By MedForce AI • ${new Date().toLocaleDateString()}</div>
          </body>
        </html>
      `;
      
      console.log('Writing content to print window');
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      console.log('Content written, triggering print');
      
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        } catch (e) {
          console.error('Error in print dialog:', e);
        }
      }, 500);
    } catch (error) {
      console.error('Error printing:', error);
      alert('Print error. Using browser print as fallback.');
      window.print();
    }
  };

  if (isEditMode) {
    return (
      <EditContainer>
        <DocumentContainer ref={documentRef} data-print-content>
          <EditToolbar data-toolbar>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#5f6368' }}>
              Editing Patient Report
            </div>
            <ToolbarButtons>
              <ToolbarButton onClick={handleCancel}>
                <X />
                Cancel
              </ToolbarButton>
              <ToolbarButton onClick={handleDownload}>
                <Download />
                PDF
              </ToolbarButton>
              <ToolbarButton onClick={handlePrint}>
                <Printer />
                Print
              </ToolbarButton>
              <ToolbarButton variant="primary" onClick={handleSave}>
                <Save />
                Save
              </ToolbarButton>
            </ToolbarButtons>
          </EditToolbar>

          <DocHeading>Patient Summary Report</DocHeading>

          <DocSectionHeading>Patient Demographics</DocSectionHeading>

          <DocTable>
            <DocTableRow>
              <DocTableCell header>Patient Name</DocTableCell>
              <DocTableCell>
                <EditableInput
                  value={editableData.name}
                  onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
                />
              </DocTableCell>
            </DocTableRow>
            <DocTableRow>
              <DocTableCell header>Date of Birth</DocTableCell>
              <DocTableCell>
                <EditableInput
                  value={editableData.date_of_birth}
                  onChange={(e) => setEditableData({ ...editableData, date_of_birth: e.target.value })}
                />
              </DocTableCell>
            </DocTableRow>
            <DocTableRow>
              <DocTableCell header>Age</DocTableCell>
              <DocTableCell>
                <EditableInput
                  value={`${editableData.age} years`}
                  onChange={(e) => {
                    const age = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    setEditableData({ ...editableData, age });
                  }}
                />
              </DocTableCell>
            </DocTableRow>
            <DocTableRow>
              <DocTableCell header>Sex</DocTableCell>
              <DocTableCell>
                <EditableInput
                  value={editableData.sex}
                  onChange={(e) => setEditableData({ ...editableData, sex: e.target.value })}
                />
              </DocTableCell>
            </DocTableRow>
            <DocTableRow>
              <DocTableCell header>Medical Record Number</DocTableCell>
              <DocTableCell>
                <EditableInput
                  value={editableData.mrn}
                  onChange={(e) => setEditableData({ ...editableData, mrn: e.target.value })}
                />
              </DocTableCell>
            </DocTableRow>
          </DocTable>

          <DocSectionHeading>Clinical Information</DocSectionHeading>

          <DocSubheading>Primary Diagnosis</DocSubheading>
          <EditableTextArea
            value={editableData.primaryDiagnosis}
            onChange={(e) => setEditableData({ ...editableData, primaryDiagnosis: e.target.value })}
          />

          <DocSubheading>Problem List</DocSubheading>
          {editableData.problem_list.map((problem, index) => (
            <EditableInput
              key={index}
              value={`• ${problem.name} (${problem.status})`}
              onChange={(e) => {
                const text = e.target.value.replace(/^•\s*/, '');
                const match = text.match(/^(.+?)\s*\((.+?)\)$/);
                if (match) {
                  const newList = [...editableData.problem_list];
                  newList[index] = { name: match[1].trim(), status: match[2].trim() };
                  setEditableData({ ...editableData, problem_list: newList });
                }
              }}
            />
          ))}
          <EditableInput
            placeholder="• Add new problem (status)..."
            onBlur={(e) => {
              const text = e.target.value.replace(/^•\s*/, '');
              if (text.trim()) {
                const match = text.match(/^(.+?)\s*\((.+?)\)$/);
                if (match) {
                  setEditableData({
                    ...editableData,
                    problem_list: [...editableData.problem_list, { name: match[1].trim(), status: match[2].trim() }]
                  });
                  e.target.value = '';
                }
              }
            }}
          />

          <DocSubheading>Allergies</DocSubheading>
          {editableData.allergies.map((allergy, index) => (
            <EditableInput
              key={index}
              value={`• ${allergy}`}
              onChange={(e) => {
                const newAllergies = [...editableData.allergies];
                newAllergies[index] = e.target.value.replace(/^•\s*/, '');
                setEditableData({ ...editableData, allergies: newAllergies });
              }}
            />
          ))}
          <EditableInput
            placeholder="• Add new allergy..."
            onBlur={(e) => {
              const text = e.target.value.replace(/^•\s*/, '').trim();
              if (text) {
                setEditableData({
                  ...editableData,
                  allergies: [...editableData.allergies, text]
                });
                e.target.value = '';
              }
            }}
          />

          <DocSubheading>Medication History</DocSubheading>
          {editableData.medication_history.map((med, index) => (
            <EditableInput
              key={index}
              value={`• ${med.name} - ${med.dose}`}
              onChange={(e) => {
                const text = e.target.value.replace(/^•\s*/, '');
                const match = text.match(/^(.+?)\s*-\s*(.+)$/);
                if (match) {
                  const newMeds = [...editableData.medication_history];
                  newMeds[index] = { name: match[1].trim(), dose: match[2].trim() };
                  setEditableData({ ...editableData, medication_history: newMeds });
                }
              }}
            />
          ))}
          <EditableInput
            placeholder="• Add new medication - dose..."
            onBlur={(e) => {
              const text = e.target.value.replace(/^•\s*/, '');
              if (text.trim()) {
                const match = text.match(/^(.+?)\s*-\s*(.+)$/);
                if (match) {
                  setEditableData({
                    ...editableData,
                    medication_history: [...editableData.medication_history, { name: match[1].trim(), dose: match[2].trim() }]
                  });
                  e.target.value = '';
                }
              }
            }}
          />

          <DocSectionHeading>Acute Event Summary</DocSectionHeading>
          <EditableTextArea
            value={editableData.acute_event_summary}
            onChange={(e) => setEditableData({ ...editableData, acute_event_summary: e.target.value })}
            rows={5}
          />

          <DocSectionHeading>Diagnosis - Acute Event</DocSectionHeading>
          {editableData.diagnosis_acute_event.map((diagnosis, index) => (
            <EditableInput
              key={index}
              value={`• ${diagnosis}`}
              onChange={(e) => {
                const newDiagnoses = [...editableData.diagnosis_acute_event];
                newDiagnoses[index] = e.target.value.replace(/^•\s*/, '');
                setEditableData({ ...editableData, diagnosis_acute_event: newDiagnoses });
              }}
            />
          ))}
          <EditableInput
            placeholder="• Add new diagnosis..."
            onBlur={(e) => {
              const text = e.target.value.replace(/^•\s*/, '').trim();
              if (text) {
                setEditableData({
                  ...editableData,
                  diagnosis_acute_event: [...editableData.diagnosis_acute_event, text]
                });
                e.target.value = '';
              }
            }}
          />

          <DocSectionHeading>Causality Analysis</DocSectionHeading>
          <EditableTextArea
            value={editableData.causality}
            onChange={(e) => setEditableData({ ...editableData, causality: e.target.value })}
            rows={5}
          />

          <DocSectionHeading>Management Recommendations</DocSectionHeading>
          {editableData.management_recommendations.map((rec, index) => (
            <EditableInput
              key={index}
              value={`• ${rec}`}
              onChange={(e) => {
                const newRecs = [...editableData.management_recommendations];
                newRecs[index] = e.target.value.replace(/^•\s*/, '');
                setEditableData({ ...editableData, management_recommendations: newRecs });
              }}
            />
          ))}
          <EditableInput
            placeholder="• Add new recommendation..."
            onBlur={(e) => {
              const text = e.target.value.replace(/^•\s*/, '').trim();
              if (text) {
                setEditableData({
                  ...editableData,
                  management_recommendations: [...editableData.management_recommendations, text]
                });
                e.target.value = '';
              }
            }}
          />

          <DocSectionHeading>Additional Notes</DocSectionHeading>
          <EditableTextArea
            placeholder="Click here to add notes..."
            style={{ minHeight: '100px' }}
          />
        </DocumentContainer>
      </EditContainer>
    );
  }

  // View Mode
  return (
    <ViewContainer ref={documentRef} data-print-content>
      <ViewHeader>
        <ViewTitle>
          <FileText size={28} />
          Patient Summary Report
        </ViewTitle>
        <ActionButtons>
          <ActionButton onClick={() => setIsEditMode(true)} variant="primary">
            <Edit2 />
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
        </ActionButtons>
      </ViewHeader>

      <TwoColumnLayout>
        {/* LEFT COLUMN */}
        <LeftColumn>
          <ViewSection>
            <ViewSectionTitle>
              <User />
              Patient Demographics
            </ViewSectionTitle>
            <ViewText>
              <strong>Name:</strong> {editableData.name}<br/>
              <strong>DOB:</strong> {editableData.date_of_birth}<br/>
              <strong>Age:</strong> {editableData.age} years<br/>
              <strong>Sex:</strong> {editableData.sex}<br/>
              <strong>MRN:</strong> {editableData.mrn}
            </ViewText>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <Stethoscope />
              Clinical Information
            </ViewSectionTitle>
            <ViewText><strong>Primary Diagnosis:</strong> {editableData.primaryDiagnosis}</ViewText>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <ClipboardList />
              Problem List
            </ViewSectionTitle>
            <ViewList>
              {editableData.problem_list.map((problem, index) => (
                <ViewListItem key={index}>{problem.name} ({problem.status})</ViewListItem>
              ))}
            </ViewList>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <AlertCircle />
              Allergies
            </ViewSectionTitle>
            <ViewList>
              {editableData.allergies.map((allergy, index) => (
                <ViewListItem key={index}>{allergy}</ViewListItem>
              ))}
            </ViewList>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <Pill />
              Medication History
            </ViewSectionTitle>
            <ViewList>
              {editableData.medication_history.map((med, index) => (
                <ViewListItem key={index}>{med.name} - {med.dose}</ViewListItem>
              ))}
            </ViewList>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <Activity />
              Acute Event Summary
            </ViewSectionTitle>
            <ViewText>{editableData.acute_event_summary}</ViewText>
          </ViewSection>
        </LeftColumn>

        {/* RIGHT COLUMN */}
        <RightColumn>
          <ViewSection>
            <ViewSectionTitle>
              <Stethoscope />
              Diagnosis - Acute Event
            </ViewSectionTitle>
            <ViewList>
              {editableData.diagnosis_acute_event.map((diagnosis, index) => (
                <ViewListItem key={index}>{diagnosis}</ViewListItem>
              ))}
            </ViewList>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <TrendingUp />
              Causality Analysis
            </ViewSectionTitle>
            <ViewText>{editableData.causality}</ViewText>
          </ViewSection>

          <ViewSection>
            <ViewSectionTitle>
              <ClipboardList />
              Management Recommendations
            </ViewSectionTitle>
            <ViewList>
              {editableData.management_recommendations.map((rec, index) => (
                <ViewListItem key={index}>{rec}</ViewListItem>
              ))}
            </ViewList>
          </ViewSection>
        </RightColumn>
      </TwoColumnLayout>
    </ViewContainer>
  );
};

export default PatientReport;
