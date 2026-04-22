import Header from '../shared/components/Header';
import { Outlet } from 'react-router';
import Footer from '../shared/components/Footer';
import { useSelector } from 'react-redux';

const AppLayout = () => {
  const user = useSelector(state => state.auth.user);

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-500 flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;