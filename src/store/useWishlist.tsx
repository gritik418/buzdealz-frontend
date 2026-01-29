import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api';
import type { Deal, WishlistItem } from '../types/index';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (deal: Deal) => void;
  removeFromWishlist: (dealId: string) => void;
  toggleAlert: (dealId: string) => void;
  isInWishlist: (dealId: string) => boolean;
  isSubscriber: boolean; 
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Mocking subscriber status - in a real app this would come from an auth context
  const isSubscriber = false; 

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getWishlist,
    // Fallback to empty array on error to keep UI functional
    placeholderData: [],
  });

  const addMutation = useMutation({
    mutationFn: (dealId: string) => wishlistApi.addToWishlist(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
      // Analytics
      console.log('Analytics: added_to_wishlist');
    },
    onError: () => toast.error('Failed to add to wishlist'),
  });

  const removeMutation = useMutation({
    mutationFn: (dealId: string) => wishlistApi.removeFromWishlist(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
      // Analytics
      console.log('Analytics: removed_from_wishlist');
    },
    onError: () => toast.error('Failed to remove from wishlist'),
  });

  const toggleAlertMutation = useMutation({
    mutationFn: ({ dealId, enabled }: { dealId: string; enabled: boolean }) => 
      wishlistApi.toggleAlert(dealId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Alert settings updated');
    },
    onError: () => toast.error('Failed to update alert'),
  });

  const addToWishlist = (deal: Deal) => {
    addMutation.mutate(deal.id);
  };

  const removeFromWishlist = (dealId: string) => {
    removeMutation.mutate(dealId);
  };

  const toggleAlert = (dealId: string) => {
    if (!isSubscriber) {
      toast.error('Only subscribers can enable price alerts!', {
        description: 'Upgrade to Pro to unlock this feature.',
      });
      return;
    }
    const item = wishlist.find(i => i.id === dealId);
    if (item) {
      toggleAlertMutation.mutate({ dealId, enabled: !item.alertEnabled });
    }
  };

  const isInWishlist = (dealId: string) => {
    return wishlist.some(item => item.id === dealId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      isLoading,
      addToWishlist, 
      removeFromWishlist, 
      toggleAlert, 
      isInWishlist,
      isSubscriber
    }}>
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

