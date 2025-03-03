import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Document } from '../types';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface DocumentCardProps {
  document: Document;
  thumbnail: string;
  index: number;
  dragHandleProps?: SyntheticListenerMap;
}

const Card = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 5;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    cursor: grabbing;
    background-color: rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    width: 12px;
    height: 8px;
    background: repeating-linear-gradient(
      rgba(0, 0, 0, 0.3) 0px,
      rgba(0, 0, 0, 0.3) 1px,
      transparent 1px,
      transparent 4px
    );
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
  position: absolute;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DocumentCard: React.FC<DocumentCardProps> = ({ document: documentItem, thumbnail, index, dragHandleProps }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Add useEffect to handle ESC key globally when modal is open
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (modalOpen && event.key === 'Escape') {
        setModalOpen(false);
      }
    };

    // Add event listener when modal is open
    if (modalOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalOpen]); // Only re-run effect if modalOpen changes

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening modal when clicking on the drag handle
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      return;
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setModalOpen(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <Card onClick={handleCardClick}>
        <DragHandle className="drag-handle" title="Drag to reorder" {...dragHandleProps} />
        <CardImage>
          {!imageLoaded && <Spinner />}
          <Thumbnail 
            src={thumbnail} 
            alt={documentItem.title} 
            onLoad={handleImageLoad} 
            style={{ display: imageLoaded ? 'block' : 'none' }} 
          />
        </CardImage>
        <CardTitle>{documentItem.title}</CardTitle>
      </Card>
      
      {modalOpen && (
        <Modal 
          onClick={handleCloseModal} 
          onKeyDown={handleKeyDown} 
          tabIndex={0}
          aria-modal="true"
          role="dialog"
          autoFocus
        >
          <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalImage src={thumbnail} alt={documentItem.title} />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default DocumentCard;
