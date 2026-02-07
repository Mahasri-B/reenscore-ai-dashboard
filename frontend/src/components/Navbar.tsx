'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
<<<<<<< HEAD
  const [isDark, setIsDark] = useState(true); // Default to dark mode
=======
>>>>>>> d05045a (hk commit full ui refreshed)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isLanding = pathname === '/';

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

=======
>>>>>>> d05045a (hk commit full ui refreshed)
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
            >
              <Zap className="w-6 h-6" />
            </motion.div>
            <span className="text-lg font-bold gradient-text hidden md:block">
              GreenScore AI
            </span>
          </Link>

          {/* Desktop Navigation - hidden on landing */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
              <NavLink href="/ml-insights" active={pathname === '/ml-insights'}>ML Insights</NavLink>
              <NavLink href="/simulator" active={pathname === '/simulator'}>Simulator</NavLink>
              <NavLink href="/rankings" active={pathname === '/rankings'}>Rankings</NavLink>
            </div>
          )}

<<<<<<< HEAD
          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:neon-border transition-all"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </motion.button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg glass"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
=======
          {/* Mobile Menu Button - hidden on landing */}
          {!isLanding && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg glass"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
>>>>>>> d05045a (hk commit full ui refreshed)
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && !isLanding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 glass rounded-lg p-4"
          >
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/ml-insights" onClick={() => setIsMenuOpen(false)}>
                ML Insights
              </MobileNavLink>
              <MobileNavLink href="/simulator" onClick={() => setIsMenuOpen(false)}>
                Simulator
              </MobileNavLink>
              <MobileNavLink href="/rankings" onClick={() => setIsMenuOpen(false)}>
                Rankings
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors relative group ${
        active ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 rounded-lg hover:bg-emerald-500/10 text-gray-300 font-medium transition-colors text-sm"
    >
      {children}
    </Link>
  );
}
