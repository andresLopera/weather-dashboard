'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IUseQueryProviderProps {
  /**
   * The children to be provided with the query client
   */
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Wrapper for the react-query client
 * @param props - The props for the query client provider
 * @param props.children - The children to be provided with the query client
 * @returns {React.ReactElement} The query client provider
 */
function UseQueryProvider({ children }: IUseQueryProviderProps): React.ReactElement {
  return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
  );
}

export default UseQueryProvider;
