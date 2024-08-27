import { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Place {
    type: string;
    _id: string;
    name: string;
    state: string | null;
    province: string | null
}

export interface SearchContextValue {
    suggestions: Place[] | null | undefined;
    results: Place[] | null | undefined;
    setSuggestions: React.Dispatch<React.SetStateAction<Place[] | null | undefined>>;
    setResults: React.Dispatch<React.SetStateAction<Place[] | null | undefined>>;
    fetchSuggestions: (query:string) => Promise<void>;
  }

  export const SearchContext = createContext<SearchContextValue | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
  }

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<Place[] | null | undefined>(null);
  const [results, setResults] = useState<Place[] | null | undefined>(null);

  const fetchSuggestions = async (query:string) => {
    
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/place/suggestions?q=${query}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions(null);
    }
  };

  return (
    <SearchContext.Provider value={{ suggestions, results,setSuggestions, setResults,fetchSuggestions }}>
      {children}
    </SearchContext.Provider>
  );
};