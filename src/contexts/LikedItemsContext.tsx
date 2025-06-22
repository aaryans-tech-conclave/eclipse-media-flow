import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LikedItem {
  id: number;
  title: string;
  image: string;
  genre: string;
  year: string;
  rating: string;
  duration: string;
  type: 'movie' | 'tv';
}

interface LikedItemsContextType {
  likedItems: LikedItem[];
  addToLikedItems: (item: LikedItem) => void;
  removeFromLikedItems: (id: number) => void;
  isLiked: (id: number) => boolean;
}

const LikedItemsContext = createContext<LikedItemsContextType | undefined>(undefined);

export const useLikedItems = () => {
  const context = useContext(LikedItemsContext);
  if (context === undefined) {
    throw new Error('useLikedItems must be used within a LikedItemsProvider');
  }
  return context;
};

interface LikedItemsProviderProps {
  children: ReactNode;
}

export const LikedItemsProvider: React.FC<LikedItemsProviderProps> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);

  const addToLikedItems = (item: LikedItem) => {
    setLikedItems(prev => {
      // Check if item already exists
      const exists = prev.some(existingItem => existingItem.id === item.id);
      if (exists) {
        return prev; // Don't add if already exists
      }
      return [...prev, item];
    });
  };

  const removeFromLikedItems = (id: number) => {
    setLikedItems(prev => prev.filter(item => item.id !== id));
  };

  const isLiked = (id: number) => {
    return likedItems.some(item => item.id === id);
  };

  const value = {
    likedItems,
    addToLikedItems,
    removeFromLikedItems,
    isLiked
  };

  return (
    <LikedItemsContext.Provider value={value}>
      {children}
    </LikedItemsContext.Provider>
  );
}; 