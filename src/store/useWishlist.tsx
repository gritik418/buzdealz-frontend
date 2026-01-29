import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Deal, WishlistItem } from '../types/index';



interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (deal: Deal) => void;
  removeFromWishlist: (dealId: string) => void;
  toggleAlert: (dealId: string) => void;
  isInWishlist: (dealId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('buzdealz-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('buzdealz-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (deal: Deal) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === deal.id)) return prev;
      return [...prev, { ...deal, addedAt: new Date().toISOString(), alertEnabled: false }];
    });
  };

  const removeFromWishlist = (dealId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== dealId));
  };

  const toggleAlert = (dealId: string) => {
    setWishlist(prev => prev.map(item => 
      item.id === dealId ? { ...item, alertEnabled: !item.alertEnabled } : item
    ));
  };

  const isInWishlist = (dealId: string) => {
    return wishlist.some(item => item.id === dealId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleAlert, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
