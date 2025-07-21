import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect if we're on the login page and user is authenticated
        if (authContext?.user && location.pathname === '/login') {
            navigate('/dashboard', { replace: true });
        }
    }, [authContext?.user, location.pathname, navigate]);

    // If AuthContext is not available, show a loading indicator
    if (!authContext) {
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
        <div className="auth-layout">
            <div className="auth-container">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout; 