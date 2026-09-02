import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('fh_token');
      localStorage.removeItem('fh_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    } else if (err.response?.status !== 404) {
      toast.error(message);
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleWishlist: (foodId) => api.post(`/auth/wishlist/${foodId}`),
};

// ── Foods ─────────────────────────────────────────────────────────────────────
export const foodApi = {
  getAll: (params) => api.get('/foods', { params }),
  getById: (id) => api.get(`/foods/${id}`),
  getPopular: () => api.get('/foods/popular'),
  getFeatured: () => api.get('/foods', { params: { isFeatured: true, limit: 8 } }),
  getSuggestions: (q) => api.get('/foods/suggestions', { params: { q } }),
  addReview: (id, data) => api.post(`/foods/${id}/reviews`, data),
};

// ── Restaurants ───────────────────────────────────────────────────────────────
export const restaurantApi = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getFeatured: () => api.get('/restaurants/featured'),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryApi = {
  getAll: () => api.get('/categories'),
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (foodId, data) => api.put(`/cart/${foodId}`, data),
  remove: (foodId) => api.delete(`/cart/${foodId}`),
  clear: () => api.delete('/cart'),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// ── Coupons ───────────────────────────────────────────────────────────────────
export const couponApi = {
  validate: (code, amount) => api.post('/coupons/validate', { code, amount }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createFood: (data) => api.post('/foods', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateFood: (id, data) => api.put(`/foods/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFood: (id) => api.delete(`/foods/${id}`),
  getAllOrders: (params) => api.get('/orders', { params }), // assuming this exists or use regular order get
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};
