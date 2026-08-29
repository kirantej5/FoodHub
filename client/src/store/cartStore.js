import { create } from 'zustand';
import { cartApi } from '../api';

export const useCartStore = create((set, get) => ({
  items: [],
  restaurant: null,
  isOpen: false,
  loading: false,

  fetchCart: async () => {
    try {
      const res = await cartApi.get();
      const cart = res.data.data.cart;
      if (cart) {
        set({ items: cart.items || [], restaurant: cart.restaurant || null });
      }
    } catch {
      // not logged in
    }
  },

  addItem: async (foodId, quantity = 1, price) => {
    set({ loading: true });
    try {
      const res = await cartApi.add({ foodId, quantity, price });
      const cart = res.data.data.cart;
      set({ items: cart.items || [], restaurant: cart.restaurant || null, isOpen: true });
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (foodId, quantity) => {
    try {
      const res = await cartApi.update(foodId, { quantity });
      const cart = res.data.data.cart;
      set({ items: cart.items || [], restaurant: cart.restaurant || null });
    } catch {}
  },

  removeItem: async (foodId) => {
    try {
      const res = await cartApi.remove(foodId);
      const cart = res.data.data.cart;
      set({ items: cart.items || [], restaurant: cart.restaurant || null });
    } catch {}
  },

  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ items: [], restaurant: null });
    } catch {}
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  get totalItems() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
  get subtotal() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
}));
