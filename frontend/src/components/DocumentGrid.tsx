import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DocumentCard from './DocumentCard';
import { Document, ThumbnailMapping } from '../types/index';
import { useDocumentsQuery, useUpdateDocumentPositions } from '../services/queries';

const GridContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const GridTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SaveStatus = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SaveSpinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Sample thumbnail images - in a real app, you'd use actual images
const thumbnails: ThumbnailMapping = {
  'bank-draft': 'https://picsum.photos/id/1018/300/200',
  'bill-of-lading': 'https://picsum.photos/id/1015/300/200',
  'invoice': 'https://picsum.photos/id/1019/300/200',
  'bank-draft-2': 'https://picsum.photos/id/1016/300/200',
  'bill-of-lading-2': 'https://picsum.photos/id/1020/300/200',
};

// Sortable Document Item component using dnd-kit
interface SortableDocumentItemProps {
  document: Document;
  index: number;
}

const SortableDocumentItem: React.FC<SortableDocumentItemProps> = ({ document, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: `document-${document.id}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: '10px',
    height: '100%'
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DocumentCard 
        document={document}
        thumbnail={thumbnails[document.type] || 'https://picsum.photos/300/200'} 
        index={index}
        dragHandleProps={listeners} 
      />
    </div>
  );
};

const DocumentGrid: React.FC = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [, setUiUpdateTrigger] = useState(0); // Used only to trigger UI updates
  
  // Use TanStack Query to fetch documents
  const { 
    data: documents = [], 
    isLoading,
    error
  } = useDocumentsQuery();
  
  // Use TanStack Query for document position updates
  const { 
    mutate: updatePositions,
    isPending: isSaving
  } = useUpdateDocumentPositions();
  
  // Configure sensors for drag and drop with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Add activation constraint - only start dragging after moving 8px
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save documents every 5 seconds if there are changes
  const saveDocuments = useCallback(() => {
    updatePositions(documents, {
      onSuccess: () => {
        setLastSaved(new Date());
      }
    });
  }, [documents, updatePositions]);

  // Auto-save timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      saveDocuments();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [saveDocuments]);

  // UI update timer - refreshes the "time since last save" display every second
  useEffect(() => {
    // Only start the timer if we have a lastSaved value
    if (!lastSaved) return;

    // Create a state update timer that runs every second
    const uiUpdateTimerId = setInterval(() => {
      // Force a re-render to update the time display without modifying lastSaved
      setUiUpdateTrigger(prev => prev + 1);
    }, 1000);

    return () => clearInterval(uiUpdateTimerId);
  }, [lastSaved]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      // Find the indices for reordering
      const oldIndex = documents.findIndex(
        item => `document-${item.id}` === active.id
      );
      const newIndex = documents.findIndex(
        item => `document-${item.id}` === over.id
      );
      
      // Reorder the array
      const reorderedItems = arrayMove(documents, oldIndex, newIndex);
      
      // Update positions
      const itemsWithUpdatedPositions = reorderedItems.map((doc, index) => ({
        ...doc,
        position: index
      }));
      
      // Use TanStack mutation to update positions
      updatePositions(itemsWithUpdatedPositions, {
        onSuccess: () => {
          setLastSaved(new Date());
        }
      });
    }
  };

  // Format time since last save
  const getTimeSinceLastSave = () => {
    if (!lastSaved) return 'Not saved yet';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  };

  if (isLoading) {
    return (
      <GridContainer>
        <GridTitle>Loading documents...</GridTitle>
      </GridContainer>
    );
  }

  if (error) {
    return (
      <GridContainer>
        <GridTitle>Error loading documents</GridTitle>
        <p>There was an error loading the documents. Please try again later.</p>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      <GridTitle>Drag and Drop</GridTitle>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={documents.map(doc => `document-${doc.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <Grid>
            {documents.map((document, index) => (
              <SortableDocumentItem 
                key={document.id} 
                document={document} 
                index={index}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
      
      <SaveStatus>
        {isSaving && <SaveSpinner />}
        <span>{isSaving ? 'Saving...' : `Last saved: ${getTimeSinceLastSave()}`}</span>
      </SaveStatus>
    </GridContainer>
  );
};

export default DocumentGrid;
