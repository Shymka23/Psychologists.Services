import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

export interface AppContextType {
  user: User | null;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  isLoading: boolean;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};