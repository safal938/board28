import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, X, Loader2 } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  position: relative;
`;

const ModalHeader = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => {
      switch (props.type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'loading': return '#3b82f6';
        default: return '#3b82f6';
      }
    }};
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

const ModalMessage = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
  color: #4b5563;
`;

const ModalButton = styled.button`
  margin-top: 32px;
  width: 100%;
  padding: 16px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <XCircle />;
      case 'warning':
        return <AlertCircle />;
      case 'loading':
        return <Loader2 className="spinner" />;
      default:
        return <AlertCircle />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'loading':
        return 'Processing';
      default:
        return 'Information';
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={type === 'loading' ? undefined : onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {type !== 'loading' && (
              <CloseButton onClick={onClose}>
                <X />
              </CloseButton>
            )}
            
            <ModalHeader type={type}>
              {getIcon()}
              <ModalTitle>{getTitle()}</ModalTitle>
            </ModalHeader>
            
            <ModalMessage>{message}</ModalMessage>
            
            {type !== 'loading' && (
              <ModalButton onClick={onClose}>
                OK
              </ModalButton>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal to ensure it's above everything
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default AlertModal;
