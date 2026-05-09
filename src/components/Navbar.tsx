import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '../lib/PortfolioContext';
import { useAuth } from '../App';

export default function Navbar() {
  const { data } = usePortfolio();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: 'top' },
    { name: 'Projects', href: 'projects' },
    { name: 'Expertise', href: 'expertise' },
    { name: 'About', href: 'about' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (location.pathname !== '/') {
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${(scrolled || isOpen) ? 'py-4 backdrop-blur-xl bg-zinc-950 border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="group-hover:text-zinc-400 transition-colors">{data?.hero.name.split(' ')[0]}</span><span style={{ color: data?.theme.primaryColor }}>.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            location.pathname === '/' ? (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={`/#${link.href}`}
                className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-100 p-2 relative z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 h-screen w-screen bg-zinc-950 z-40 p-8 pt-32 md:hidden flex flex-col gap-8 overflow-y-auto"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {location.pathname === '/' ? (
                  <a
                    href={`#${link.href}`}
                    className="text-4xl font-black tracking-tighter hover:text-zinc-400 transition-colors"
                    onClick={() => handleLinkClick(link.href)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={`/#${link.href}`}
                    className="text-4xl font-black tracking-tighter hover:text-zinc-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
