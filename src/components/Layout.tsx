import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { data } = usePortfolio();
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${data?.theme.darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <CustomCursor />
      <Navbar />
      <main className="relative overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
