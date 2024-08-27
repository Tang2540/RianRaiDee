import { useContext } from 'react';
import { SearchContext, SearchContextValue } from './SearchContext';

export const useSearch = (): SearchContextValue => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within an SearchProvider');
  }
  return context;
};