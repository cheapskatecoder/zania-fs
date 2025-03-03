import axios from 'axios';
import { Document } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Get all documents
export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await api.get('/api/documents/');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Update document positions (batch update)
export const updateDocumentPositions = async (documents: Document[]): Promise<Document[]> => {
  try {
    // Convert Document to DocumentCreate by excluding the id field
    const documentsToUpdate = documents.map(({ id, ...rest }) => rest);
    
    const response = await api.put('/api/documents/batch', documentsToUpdate);
    return response.data;
  } catch (error) {
    console.error('Error updating document positions:', error);
    throw error;
  }
};
