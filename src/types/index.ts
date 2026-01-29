export interface Deal {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  store: string;
  category: string;
  expiryDate: string;
  discount: number;
  bestPrice?: number;
}

export interface WishlistItem extends Deal {
  addedAt: string;
  alertEnabled: boolean;
}
