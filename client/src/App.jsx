import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Pages
import Home from './pages/Home';
import Foods from './pages/Foods';
import FoodDetail from './pages/FoodDetail';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminFoods from './pages/admin/Foods';
import AdminOrders from './pages/admin/Orders';

export default function App() {
  const { fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e1e1e', color: '#fff', border: '1px solid #2a2a2a' },
        success: { iconTheme: { primary: '#f97316', secondary: '#fff' } }
      }} />
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <CartDrawer />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/foods/:id" element={<FoodDetail />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - simple check handled in components for now */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/foods" element={<AdminFoods />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
