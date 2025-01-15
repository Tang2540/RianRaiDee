import { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Course {
    _id: string;
    course_id: string;
    name: string;
}

export interface SearchContextValue {
    suggestions: Course[] | null | undefined;
    results: Course[] | null | undefined;
    setSuggestions: React.Dispatch<React.SetStateAction<Course[] | null | undefined>>;
    setResults: React.Dispatch<React.SetStateAction<Course[] | null | undefined>>;
    fetchSuggestions: (query:string) => Promise<void>;
  }

  export const SearchContext = createContext<SearchContextValue | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
  }

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<Course[] | null | undefined>(null);
  const [results, setResults] = useState<Course[] | null | undefined>(null);

  const fetchSuggestions = async (query:string) => {
    
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/course/suggestions?q=${query}`
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