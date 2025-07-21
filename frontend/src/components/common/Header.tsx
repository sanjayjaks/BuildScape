import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!authContext) {
    return (
      <header className="app-header loading">
        <div className="loading-animation">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </header>
    );
  }

  const { user, logout } = authContext;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`app-header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container glass-morphism">
        <Link to="/" className="logo">
          <div className="logo-animation">
            <span className="logo-text">BuildScape</span>
            <div className="logo-underline"></div>
          </div>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="hamburger"></span>
        </button>

        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link hover-effect">
                <i className="icon-home"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link hover-effect">
                <i className="icon-services"></i>
                <span>Services</span>
              </Link>
            </li>
            {user && user.role === 'serviceProvider' && (
              <li className="nav-item">
                <Link to="/projects" className="nav-link hover-effect">
                  <i className="icon-projects"></i>
                  <span>Projects</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/membership" className="nav-link hover-effect" onClick={() => console.log('Premium button clicked!')}>
                <i className="icon-premium"></i>
                <span>Premium</span>
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link hover-effect">
                  <i className="icon-dashboard"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <span className="user-name">{user.name || user.email}</span>
              </div>
              <div className="dropdown-menu">
                <Link to="/profile" className="menu-item">
                  <i className="icon-profile"></i>
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="menu-item">
                  <i className="icon-settings"></i>
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout} className="menu-item logout-button">
                  <i className="icon-logout"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;