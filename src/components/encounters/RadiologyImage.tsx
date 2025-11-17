import React from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  background: #fefefe;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
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

const ImageHeader = styled.div<{ $sourceColor: string }>`
  background: #f5f5f5;
  border-left: 4px solid ${props => props.$sourceColor};
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 4px;
`;

const ImageTitle = styled.h3<{ $sourceColor: string }>`
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: bold;
  color: ${props => props.$sourceColor};
  font-family: "Arial", sans-serif;
`;

const ImageMetadata = styled.div`
  font-size: 9px;
  color: #666;
  font-family: "Arial", sans-serif;
`;

const ImageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImageCaption = styled.div`
  margin-top: 12px;
  font-size: 11px;
  color: #666;
  text-align: center;
  font-family: "Arial", sans-serif;
  line-height: 1.4;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
  text-align: center;
  padding: 20px;
`;

interface RadiologyImageProps {
  encounterNumber?: number;
  date: string;
  studyType: string;
  provider?: string;
  specialty?: string;
  imageUrl: string;
  caption?: string;
  dataSource: string;
}

const RadiologyImage: React.FC<RadiologyImageProps> = ({
  encounterNumber,
  date,
  studyType,
  provider,
  specialty,
  imageUrl,
  caption,
  dataSource,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Define colors for different EHR systems
  const getSourceColors = (source: string) => {
    const sourceLower = source.toLowerCase();
    
    if (sourceLower.includes('radiology') || sourceLower.includes('pacs')) {
      return { color: '#ff9800', border: '#f57c00' }; // Orange
    } else if (sourceLower.includes('vueexplore')) {
      return { color: '#ff9800', border: '#f57c00' }; // Orange
    } else if (sourceLower.includes('nervecentre')) {
      return { color: '#9c27b0', border: '#7b1fa2' }; // Purple
    } else if (sourceLower.includes('ice')) {
      return { color: '#2196f3', border: '#1976d2' }; // Blue
    } else {
      return { color: '#607d8b', border: '#455a64' }; // Blue Grey (default)
    }
  };
  
  const colors = getSourceColors(dataSource);
  
  return (
    <ImageContainer>
      <DataSourceChip $sourceColor={colors.color} $sourceBorder={colors.border}>
        {dataSource}
      </DataSourceChip>
      
      <ImageHeader $sourceColor={colors.color}>
        <ImageTitle $sourceColor={colors.color}>{studyType}</ImageTitle>
        <ImageMetadata>
          <strong>Date:</strong> {date}
          {encounterNumber && <> | <strong>Encounter:</strong> #{encounterNumber}</>}
          {provider && <> | <strong>Provider:</strong> {provider}</>}
          {specialty && <> | <strong>Specialty:</strong> {specialty}</>}
        </ImageMetadata>
      </ImageHeader>
      
      <ImageContent>
        {!imageError ? (
          <>
            <StyledImage 
              src={imageUrl} 
              alt={studyType}
              onError={() => setImageError(true)}
            />
            {caption && <ImageCaption>{caption}</ImageCaption>}
          </>
        ) : (
          <ErrorMessage>
            Failed to load image. Please check the image URL.
          </ErrorMessage>
        )}
      </ImageContent>
    </ImageContainer>
  );
};

export default RadiologyImage;
