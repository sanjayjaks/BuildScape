import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBars, FaTimes, FaTools, FaBuilding, FaCog } from 'react-icons/fa';
import './AuthLayout.css';
import { AuthContext } from '../context/AuthContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/services', label: 'Services', icon: <FaTools /> },
    { path: '/projects', label: 'Projects', icon: <FaBuilding /> },
    { path: '/membership', label: 'Premium', icon: <FaCog /> },
  ];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only redirect if we're on the login page and user is authenticated
  useEffect(() => {
    if (authContext?.user && location.pathname === '/login') {
      window.location.href = '/dashboard';
    }
  }, [authContext?.user, location.pathname]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  }, [navigate]);

  const renderMobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.nav
            className="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="mobile-menu-header">
              <button 
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mobile-menu-content">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="mobile-menu-icon">{item.icon}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );

  // If AuthContext is loading, show a loading indicator
  if (authContext?.loading) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Loading authentication...</p>
            </div>
            <div className="loading-spinner" style={{ margin: '2rem auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-layout ${isScrolled ? 'scrolled' : ''}`}>
      {/* Hide header on login and registration pages */}
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <header className={`auth-header ${isScrolled ? 'scrolled' : ''}`}>
          <div className="header-content">
            <div className="header-left">
              <button 
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </motion.div>
              </button>
            </div>

            <nav className="desktop-nav">
              {navigationItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="nav-link-content"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            <div className="header-right">
              {/* Header right section now empty - removed theme toggle and help button */}
            </div>
          </div>
        </header>
      )}

      <main className="auth-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="content-wrapper"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="auth-footer">
        <div className="footer-content">
          <div className="footer-section">
            <p className="copyright">
              &copy; {new Date().getFullYear()} BuildScape Authentication System.
            </p>
          </div>
          <div className="footer-section">
            <nav className="footer-nav">
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </nav>
          </div>
          <div className="footer-section">
            <p className="version">Version 1.0.0</p>
          </div>
        </div>
      </footer>

      {renderMobileMenu()}
    </div>
  );
};

export default AuthLayout;