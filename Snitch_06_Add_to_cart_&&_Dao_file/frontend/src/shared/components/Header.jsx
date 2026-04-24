import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { ShoppingBag, Search, User, Menu, LogOut, Moon, Sun, Settings, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items) || [];
  const { handleLogout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('snitch-theme') || 'dark');
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('snitch-theme', newTheme);
  };

  const onLogout = () => {
    handleLogout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-500 bg-[var(--theme-bg)]/80 backdrop-blur-xl border-b border-[var(--theme-border)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20">
            <span className="text-black font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-display font-black tracking-tighter text-[var(--theme-text)]">SNITCH</span>
        </Link>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className={`relative py-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${location.pathname === '/' ? 'text-primary' : 'text-[var(--theme-text-muted)] hover:text-primary'}`}
          >
            Collection
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </Link>

          <Link
            to="/new"
            className={`relative py-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${location.pathname === '/new' ? 'text-primary' : 'text-[var(--theme-text-muted)] hover:text-primary'}`}
          >
            New
            {location.pathname === '/new' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </Link>

          <Link
            to="/arrivals"
            className={`relative py-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${location.pathname === '/arrivals' ? 'text-primary' : 'text-[var(--theme-text-muted)] hover:text-primary'}`}
          >
            Arrivals
            {location.pathname === '/arrivals' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </Link>

          {
            user && user.role === 'seller' &&
            <Link
              to="/seller/dashboard"
              className={`relative py-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${location.pathname.startsWith('/seller') ? 'text-primary' : 'text-[var(--theme-text-muted)] hover:text-primary'}`}
            >
              Dashboard
              {location.pathname.startsWith('/seller') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </Link>
          }
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="hidden sm:flex p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* User Section */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-9 h-9 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary transition-all duration-300">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=10b981&color=fff`}
                      alt={user.fullname}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--theme-text-muted)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl p-2 animate-fade-up z-[110]">
                    <div className="px-4 py-3 border-b border-[var(--theme-border)] mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Identity</p>
                      <p className="text-sm font-black text-[var(--theme-text)] truncate">{user.fullname}</p>
                      <p className="text-[10px] text-[var(--theme-text-muted)] truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-[var(--theme-text)] hover:text-primary transition-all group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-[var(--theme-text-muted)] group-hover:text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Manage Account</span>
                    </Link>

                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/10 text-[var(--theme-text)] hover:text-primary transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-600'}`}>
                        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                      </div>
                    </button>

                    <div className="h-px bg-[var(--theme-border)] my-2 mx-2" />

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all group"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/cart" className="relative p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)] border-2 border-[var(--theme-bg)]">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          <button className="md:hidden p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
