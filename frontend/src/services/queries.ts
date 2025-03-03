import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, updateDocumentPositions } from './api';
import { Document } from '../types/index';

// Query keys
export const queryKeys = {
  documents: ['documents'] as const,
};

// Define context type for mutations
interface MutationContext {
  previousDocuments?: Document[];
}

/**
 * Hook to fetch all documents
 */
export const useDocumentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: getDocuments,
  });
};

/**
 * Hook to update document positions
 */
export const useUpdateDocumentPositions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateDocumentPositions,
    // When mutate is called:
    onMutate: async (newDocuments: Document[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.documents });
      
      // Snapshot the previous value
      const previousDocuments = queryClient.getQueryData<Document[]>(queryKeys.documents);
      
      // Optimistically update the cache with the new value
      if (previousDocuments) {
        queryClient.setQueryData<Document[]>(queryKeys.documents, newDocuments);
      }
      
      // Return a context object with the previous value
      return { previousDocuments } as MutationContext;
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err: Error, newDocuments: Document[], context: MutationContext | undefined) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData<Document[]>(queryKeys.documents, context.previousDocuments);
      }
    },
    // After the mutation succeeds, invalidate and refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}; 