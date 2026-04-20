import React from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-500 bg-[var(--theme-bg)]/80 backdrop-blur-xl border-b border-[var(--theme-border)]">
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
          {['Collections', 'New Arrivals', 'Stories', 'About'].map((item) => (
            <Link
              key={item}
              to="#"
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--theme-text-muted)] hover:text-primary transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-6">
          <button className="p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <Link to="/login" className="hidden sm:block p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </Link>

          <Link to="/create-product" className={`hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary/20 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-500 ${location.pathname === '/create-product' ? 'bg-primary text-black' : 'text-primary'}`}>
            Create
          </Link>

          <button className="relative p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
          </button>

          <button className="md:hidden p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
