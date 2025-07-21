import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './index.css'; // or './App.css' depending on your setup

const Navigation: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!auth) {
    return null;
  }

  const { user, logout } = auth;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-black tracking-tight hover:text-gray-700 transition-colors duration-200">
                BuildScape
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              <Link 
                to="/" 
                className="text-black hover:text-white hover:bg-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-transparent hover:border-black"
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className="text-black hover:text-white hover:bg-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-transparent hover:border-black"
              >
                Services
              </Link>
              <Link 
                to="/projects" 
                className="text-black hover:text-white hover:bg-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-transparent hover:border-black"
              >
                Projects
              </Link>
              <Link 
                to="/membership" 
                className="text-black hover:text-white hover:bg-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-transparent hover:border-black"
              >
                Premium
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-black hover:text-white hover:bg-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-transparent hover:border-black"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 border-2 border-transparent hover:border-black"
                >
                  <span className="text-black font-semibold">
                    {user.name || 'Demo User'}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-black transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white border-2 border-gray-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/profile-settings"
                        className="block px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 hover:text-black transition-colors duration-200 border-l-4 border-transparent hover:border-black"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 hover:text-black transition-colors duration-200 border-l-4 border-transparent hover:border-black"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-black px-6 py-2.5 rounded-lg text-sm font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 rounded-lg text-sm font-medium border-2 border-black hover:border-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;