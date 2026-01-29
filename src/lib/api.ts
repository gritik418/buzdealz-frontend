import axios from 'axios';
import type { Deal, WishlistItem } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
});

const mapBackendDeal = (d: any): Deal => {
  const price = parseFloat(d.price);
  const originalPrice = d.originalPrice ? parseFloat(d.originalPrice) : price;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return {
    id: d.id.toString(),
    title: d.title,
    price: price,
    originalPrice: originalPrice,
    image: d.imageUrl || "/placeholder.png",
    store: d.store || "Buzdealz", // Backend doesn't have store yet
    category: d.category || "General", // Backend doesn't have category yet
    expiryDate: d.isExpired ? "2000-01-01" : "2026-12-31", // Derived or mock
    discount: discount,
    bestPrice: price, // Simple mapping for now
  };
};

export const authApi = {
  getMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return data.data; // Backend returns { success: true, data: user }
    } catch (error) {
      return null;
    }
  },
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  logout: async () => {

    const { data } = await api.post('/auth/logout');
    return data;
  }
};

export const wishlistApi = {
  getWishlist: async () => {
    const { data } = await api.get('/wishlist');
    return data.data.map((item: any) => {
      const deal = mapBackendDeal(item.deal);
      return {
        ...deal,
        addedAt: item.createdAt,
        alertEnabled: item.alertEnabled,
      };
    }) as WishlistItem[];
  },
  addToWishlist: async (dealId: string, alertEnabled: boolean = false) => {
    const { data } = await api.post('/wishlist', { dealId: parseInt(dealId), alertEnabled });
    return data;
  },
  removeFromWishlist: async (dealId: string) => {
    const { data } = await api.delete(`/wishlist/${dealId}`);
    return data;
  },
  toggleAlert: async (dealId: string, enabled: boolean) => {
    const { data } = await api.post('/wishlist', { dealId: parseInt(dealId), alertEnabled: enabled });
    return data;
  },
};

export const dealsApi = {
  getDeals: async () => {
    const { data } = await api.get('/deals');
    return data.data.map(mapBackendDeal);
  },
  getDeal: async (id: string) => {
    const { data } = await api.get('/deals');
    const backendDeal = data.data.find((d: any) => d.id.toString() === id.toString());
    return backendDeal ? mapBackendDeal(backendDeal) : null;
  },
};
