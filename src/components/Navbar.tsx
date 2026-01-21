import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logoWithText.png';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About us', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'ESG', href: '#esg' },
  { label: 'Investor Center', href: '#investor' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 pt-6"
      >
        <nav
          className={`max-w-6xl mx-auto transition-all duration-300 rounded-2xl ${
            isScrolled
              ? 'bg-navy-dark/95 backdrop-blur-lg shadow-2xl'
              : 'bg-navy-dark/80 backdrop-blur-md shadow-lg'
          }`}
        >
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <a href="#home" className="flex items-center">
                <img
                  src={logo}
                  alt="Asian Battery Metals PLC"
                  className="h-12 w-auto"
                />
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium hover-underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* CTA Button - Desktop */}
                <a href="#contact">
                  <Button
                    className="hidden md:flex bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-6 rounded-full btn-glow"
                  >
                    Contact us
                  </Button>
                </a>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-navy-dark/95 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute top-28 left-0 right-0 px-6 sm:px-8 lg:px-12"
            >
              <div className="max-w-6xl mx-auto bg-navy-dark/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-4 text-white text-lg font-medium border-b border-white/10 hover:bg-white/5 transition-colors rounded-lg"
                    >
                      {link.label}
                    </motion.a>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                  >
                    <a href="#contact">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-lime-dark font-semibold py-6 rounded-xl btn-glow">
                        Contact us
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
