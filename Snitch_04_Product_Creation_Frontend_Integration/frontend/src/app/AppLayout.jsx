import { useEffect, useState } from 'react';
import Header from '../shared/components/Header';
import ThemeToggle from '../shared/components/ThemeToggle';
import { Outlet } from 'react-router';
import Footer from '../shared/components/Footer';

const AppLayout = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-500 flex flex-col">
      <Header />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;