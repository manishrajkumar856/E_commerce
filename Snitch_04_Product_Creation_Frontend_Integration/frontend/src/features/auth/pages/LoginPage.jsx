import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import heroImageDark from '../../../assets/snitch_option_2_brutalist_1775871146592.png';
import heroImageLight from '../../../assets/snitch_light_editorial.png';
import { Link } from 'react-router';
import ThemeToggle from '../../../shared/components/ThemeToggle';

const LoginPage = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const currentIsDark = document.documentElement.classList.contains('dark');
      setTheme(currentIsDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('snitch-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col lg:flex-row overflow-hidden bg-[var(--theme-bg)] transition-colors duration-700">
      {/* Absolute Header for Nav */}
      <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto p-2 text-[var(--theme-text-muted)] hover:text-primary transition-colors flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">← Back</span>
        </Link>
        <div className="pointer-events-auto">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Left Side: Editorial Excellence (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden">
        <img
          src={theme === 'dark' ? heroImageDark : heroImageLight}
          alt="Snitch Editorial"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in transition-all duration-700 hover:scale-105"
        />
        {/* Artistic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/40 via-transparent to-[var(--theme-bg)]" />

        {/* Brand Statement */}
        <div className="absolute bottom-16 left-16 z-20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <h1 className="text-8xl font-display font-black text-[var(--theme-text)] leading-[0.8] tracking-tightest">
            SNITCH <br />
            <span className="text-secondary text-glow-secondary">CULT</span>
          </h1>
          <p className="mt-8 text-[12px] font-bold tracking-[0.6em] text-[var(--theme-text-muted)] uppercase max-w-sm leading-relaxed">
            The Digital Frontier of Modern Luxury.
          </p>
        </div>
      </div>

      {/* Right Side: High-Visibility Form Interface */}
      <div className="w-full lg:w-1/2 h-full flex flex-col p-4 md:p-6 relative z-10 bg-[var(--theme-bg)] overflow-y-auto">
        {/* Mobile-Only Hero Background (Subtle) */}
        <div className="lg:hidden absolute inset-0 z-0">
          <img
            src={theme === 'dark' ? heroImageDark : heroImageLight}
            alt="Mobile Hero"
            className="w-full h-full object-cover opacity-10 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-[var(--theme-bg)]/80 backdrop-blur-md transition-colors duration-700" />
        </div>

        <div className="relative z-10 w-full flex justify-center my-auto py-8">
          <LoginForm />
        </div>
      </div>

      {/* Subtle UI Accents */}
      <div className="absolute top-1/2 -left-1/4 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/2 -right-1/4 w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
};

export default LoginPage;
