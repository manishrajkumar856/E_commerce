import React from 'react';
import { Link } from 'react-router';
import { Mail, MessageSquare, Globe, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--theme-bg)] border-t border-[var(--theme-border)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">S</span>
              </div>
              <span className="text-xl font-display font-black tracking-tighter">SNITCH</span>
            </Link>
            <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed max-w-xs">
              Redefining the digital luxury experience through minimal aesthetics and high-performance craftsmanship.
            </p>
            <div className="flex gap-5">
              {[Mail, MessageSquare, Globe, Cpu].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-text-muted)] hover:border-primary hover:text-primary transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8">Shop</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Best Sellers', 'Collections', 'Accessories'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8">Company</h4>
            <ul className="space-y-4">
              {['Our Story', 'Careers', 'Terms of Service', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8">Newsletter</h4>
            <p className="text-sm text-[var(--theme-text-muted)] mb-6">Join the cult. Get early access to drops.</p>
            <form className="relative">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-[var(--theme-input-bg)] border-b border-[var(--theme-border)] py-4 px-1 text-xs tracking-widest focus:outline-none focus:border-primary transition-colors uppercase"
              />
              <button className="absolute right-0 bottom-4 text-[10px] font-bold tracking-widest text-primary hover:translate-x-1 transition-transform">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-[var(--theme-border)] text-[10px] uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
          <p>© 2026 SNITCH CULT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="hover:text-primary cursor-pointer transition-colors">Internal Alpha</span>
            <span className="hover:text-primary cursor-pointer transition-colors">System V2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
