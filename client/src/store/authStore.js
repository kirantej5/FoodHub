import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await authApi.login({ email, password });
        const { user, token } = res.data.data;
        localStorage.setItem('fh_token', token);
        set({ user, token, isAuthenticated: true });
        return user;
      },

      register: async (name, email, password, phone) => {
        const res = await authApi.register({ name, email, password, phone });
        const { user, token } = res.data.data;
        localStorage.setItem('fh_token', token);
        set({ user, token, isAuthenticated: true });
        return user;
      },

      logout: () => {
        localStorage.removeItem('fh_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
    }),
    {
      name: 'fh_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
