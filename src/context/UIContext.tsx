import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isLoginModalOpen: boolean;
  searchQuery: string;
  openLogin: () => void;
  closeLogin: () => void;
  setSearchQuery: (query: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openLogin = () => setIsLoginModalOpen(true);
  const closeLogin = () => setIsLoginModalOpen(false);

  return (
    <UIContext.Provider value={{ 
      isLoginModalOpen, 
      openLogin, 
      closeLogin,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
