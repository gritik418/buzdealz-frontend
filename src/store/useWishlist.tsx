import { createContext, useContext, type ReactNode, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, authApi, notificationsApi } from '@/lib/api';
import type { Deal, WishlistItem } from '../types/index';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  name: string;
  isSubscriber: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (deal: Deal) => void;
  removeFromWishlist: (dealId: string) => void;
  toggleAlert: (dealId: string) => void;
  isInWishlist: (dealId: string) => boolean;
  isSubscriber: boolean;
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  notifications: Notification[];
  unreadCount: number;
  markNotificationsAsRead: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [prevNotifCount, setPrevNotifCount] = useState<number | null>(null);
  
  const { data: user = null, isLoading: isLoadingUser } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    retry: false,
  });

  const isAuthenticated = !!user;
  const isSubscriber = user?.isSubscriber || false;

  const { data: wishlist = [], isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
    placeholderData: [],
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    enabled: isAuthenticated,
    refetchInterval: 5000, // Check for drops every 5 seconds for responsive feedback
  });

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      if (prevNotifCount !== null && notifications.length > prevNotifCount) {
        const latest = notifications[0];
        toast.success(latest.title, {
          description: latest.message,
          duration: 10000,
        });
      }
      setPrevNotifCount(notifications.length);
    } else {
      setPrevNotifCount(0);
    }
  }, [notifications, prevNotifCount]);

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const addMutation = useMutation({
    mutationFn: (dealId: string) => wishlistApi.addToWishlist(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
      console.log('Analytics: added_to_wishlist');
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to wishlist');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (dealId: string) => wishlistApi.removeFromWishlist(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
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
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update alert'),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.setQueryData(['wishlist'], []);
      queryClient.setQueryData(['notifications'], []);
      toast.success('Logged out successfully');
    },
  });

  const addToWishlist = (deal: Deal) => {
    if (!isAuthenticated) {
      toast.error('Authentication required', {
        description: 'Please login to start tracking deals.',
      });
      return;
    }
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

  const markNotificationsAsRead = () => {
    markAsReadMutation.mutate();
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      isLoading: isLoadingWishlist || isLoadingUser,
      addToWishlist, 
      removeFromWishlist, 
      toggleAlert, 
      isInWishlist,
      isSubscriber,
      user,
      isAuthenticated,
      logout,
      notifications,
      unreadCount,
      markNotificationsAsRead
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
