import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Deal, WishlistItem, User } from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers) => {
        return headers;
    },
  }),
  tagTypes: ['Deal', 'Wishlist', 'User'],
  endpoints: (builder) => ({
    getDeals: builder.query<Deal[], void>({
      query: () => '/deals',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Deal' as const, id })),
              { type: 'Deal', id: 'LIST' },
            ]
          : [{ type: 'Deal', id: 'LIST' }],
    }),
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<void, { dealId: number; alertEnabled?: boolean }>({
      query: (body) => ({
        url: '/wishlist',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<void, number>({
      query: (dealId) => ({
        url: `/wishlist/${dealId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    register: builder.mutation<{ success: boolean; message: string }, any>({
        query: (credentials) => ({
            url: '/auth/register',
            method: 'POST',
            body: credentials
        })
    })
  }),
});

export const { 
    useGetDealsQuery, 
    useGetWishlistQuery, 
    useAddToWishlistMutation, 
    useRemoveFromWishlistMutation,
    useRegisterMutation
} = apiSlice;
