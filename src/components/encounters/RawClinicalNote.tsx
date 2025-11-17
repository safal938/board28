import React from "react";
import styled from "styled-components";

const NoteContainer = styled.div`
  background: #fefefe;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  font-family: "Courier New", Courier, monospace;
  line-height: 1.6;
  color: #2c3e50;
  height: 100%;
  overflow-y: auto;
  font-size: 10px;
  white-space: pre-wrap;
  position: relative;
`;

const HighlightedText = styled.span<{ $color: string }>`
  background-color: ${props => {
    switch (props.$color) {
      case 'yellow': return  '#ff95006c';
      case 'green': return '#ff950028';
      case 'blue': return '#bbdefb';
      case 'red': return '   #ff9500a1';
      case 'orange': return '#ffe0b2';
      case 'purple': return '#e1bee7';
      default: return '#fff59d';
    }
  }};
  padding: 2px 0;
  border-radius: 2px;
`;

const DataSourceChip = styled.div<{ $sourceColor: string; $sourceBorder: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.$sourceColor};
  border: 1px solid ${props => props.$sourceBorder};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
`;

const NoteHeader = styled.div<{ $sourceColor: string }>`
  background: #f5f5f5;
  border-left: 4px solid ${props => props.$sourceColor};
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 4px;
`;

const NoteTitle = styled.h3<{ $sourceColor: string }>`
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: bold;
  color: ${props => props.$sourceColor};
  font-family: "Arial", sans-serif;
`;

const NoteMetadata = styled.div`
  font-size: 9px;
  color: #666;
  font-family: "Arial", sans-serif;
`;

const NoteContent = styled.div`
  padding: 8px 0;
`;

interface Highlight {
  text: string;
  color: string;
}

interface RawClinicalNoteProps {
  encounterNumber: number;
  date: string;
  visitType: string;
  provider?: string;
  specialty?: string;
  rawText: string;
  dataSource: string;
  highlights?: Highlight[];
}

const RawClinicalNote: React.FC<RawClinicalNoteProps> = ({
  encounterNumber,
  date,
  visitType,
  provider,
  specialty,
  rawText,
  dataSource,
  highlights = [],
}) => {
  // Define colors for different EHR systems
  const getSourceColors = (source: string) => {
    const sourceLower = source.toLowerCase();
    
    if (sourceLower.includes('nervecentre')) {
      return { color: '#9c27b0', border: '#7b1fa2' }; // Purple
    } else if (sourceLower.includes('medilogik')) {
      return { color: '#00bcd4', border: '#00acc1' }; // Cyan
    } else if (sourceLower.includes('viper')) {
      return { color: '#ff5722', border: '#e64a19' }; // Deep Orange
    } else if (sourceLower.includes('ice')) {
      return { color: '#2196f3', border: '#1976d2' }; // Blue
    } else if (sourceLower.includes('bighand')) {
      return { color: '#4caf50', border: '#388e3c' }; // Green
    } else {
      return { color: '#607d8b', border: '#455a64' }; // Blue Grey (default)
    }
  };
  
  const colors = getSourceColors(dataSource);
  
  // Function to strip markdown formatting
  const stripMarkdown = (text: string): string => {
    let cleaned = text;
    
    // Remove markdown headers but keep them as section markers
    cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '§SECTION§$1');
    
    // Remove bold **text**
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
    
    // Remove italic *text*
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
    
    // Remove horizontal rules and mark as section break
    cleaned = cleaned.replace(/^---$/gm, '§SECTION§');
    
    // Remove bullet point markers
    cleaned = cleaned.replace(/^\*\s+/gm, '');
    
    // Split into lines and process
    const lines = cleaned.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Join lines into sections
    const sections: string[] = [];
    let currentSection: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('§SECTION§')) {
        // Save current section if it has content
        if (currentSection.length > 0) {
          sections.push(currentSection.join(' '));
          currentSection = [];
        }
        // Start new section with the header text
        const headerText = line.replace('§SECTION§', '').trim();
        if (headerText) {
          currentSection.push(headerText);
        }
      } else {
        currentSection.push(line);
      }
    }
    
    // Add the last section
    if (currentSection.length > 0) {
      sections.push(currentSection.join(' '));
    }
    
    // Join sections with double newline
    cleaned = sections.join('\n\n');
    
    return cleaned.trim();
  };

  // Function to render text with highlights
  const renderHighlightedText = () => {
    // Strip markdown from rawText
    const cleanedRawText = stripMarkdown(rawText);
    
    if (!highlights || highlights.length === 0) {
      return cleanedRawText;
    }

    // Strip markdown from highlights and sort by length
    const cleanedHighlights = highlights.map(h => ({
      ...h,
      text: stripMarkdown(h.text)
    })).sort((a, b) => b.text.length - a.text.length);
    
    let result: React.ReactNode[] = [];
    let remainingText = cleanedRawText;
    let keyCounter = 0;

    // Process text character by character
    while (remainingText.length > 0) {
      let matched = false;

      // Try to find a highlight at the current position
      for (const highlight of cleanedHighlights) {
        if (remainingText.startsWith(highlight.text)) {
          // Found a match
          result.push(
            <HighlightedText key={`highlight-${keyCounter++}`} $color={highlight.color}>
              {highlight.text}
            </HighlightedText>
          );
          remainingText = remainingText.slice(highlight.text.length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // No highlight found, add the next character as plain text
        const nextChar = remainingText[0];
        const lastElement = result[result.length - 1];
        
        // If the last element is a string, append to it
        if (typeof lastElement === 'string') {
          result[result.length - 1] = lastElement + nextChar;
        } else {
          result.push(nextChar);
        }
        
        remainingText = remainingText.slice(1);
      }
    }

    return result;
  };
  
  return (
    <NoteContainer>
      <DataSourceChip $sourceColor={colors.color} $sourceBorder={colors.border}>
        {dataSource}
      </DataSourceChip>
      
      <NoteHeader $sourceColor={colors.color}>
        <NoteTitle $sourceColor={colors.color}>{visitType}</NoteTitle>
        <NoteMetadata>
          <strong>Date:</strong> {date}
          {provider && <> | <strong>Provider:</strong> {provider}</>}
          {specialty && <> | <strong>Specialty:</strong> {specialty}</>}
        </NoteMetadata>
      </NoteHeader>
      
      <NoteContent>{renderHighlightedText()}</NoteContent>
    </NoteContainer>
  );
};

export default RawClinicalNote;
