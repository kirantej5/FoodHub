import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ChevronDown, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-30 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl" style={{ color: '#f97316' }}>
            <UtensilsCrossed size={24} />
            <span>Food<span style={{ color: 'var(--color-text)' }}>Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
            <NavLink to="/foods" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink>
            <NavLink to="/restaurants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Restaurants</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Orders</NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: 'var(--color-muted)' }}
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: '#f97316' }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                  style={{ background: 'var(--color-surface-2)' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--color-muted)' }} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border py-1 shadow-xl"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <Link to="/profile" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                      style={{ color: 'var(--color-text)' }}>
                      <User size={15} /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                      style={{ color: '#ef4444' }}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2">Sign In</Link>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: 'var(--color-muted)' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t py-3 flex flex-col gap-1" style={{ borderColor: 'var(--color-border)' }}>
            {[['/', 'Home'], ['/foods', 'Menu'], ['/restaurants', 'Restaurants'], ...(isAuthenticated ? [['/orders', 'Orders']] : [])].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-orange-400 bg-orange-500/10' : ''}`}
                style={{ color: 'var(--color-muted)' }}>
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
