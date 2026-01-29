import axios from 'axios';
import type { Deal, WishlistItem } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const wishlistApi = {
  getWishlist: async () => {
    const { data } = await api.get<WishlistItem[]>('/wishlist');
    return data;
  },
  addToWishlist: async (dealId: string, alertEnabled: boolean = false) => {
    const { data } = await api.post('/wishlist', { dealId, alertEnabled });
    return data;
  },
  removeFromWishlist: async (dealId: string) => {
    const { data } = await api.delete(`/wishlist/${dealId}`);
    return data;
  },
  toggleAlert: async (dealId: string, enabled: boolean) => {
    const { data } = await api.patch(`/wishlist/${dealId}`, { alertEnabled: enabled });
    return data;
  },
};

export const dealsApi = {
  getDeals: async () => {
    const { data } = await api.get<Deal[]>('/deals');
    return data;
  },
};
