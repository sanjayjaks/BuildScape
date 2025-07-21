import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    // If auth context is not available yet, show loading
    if (!authContext) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    
    // If we have a token but no user, we're still loading
    if (token && !authContext.user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // If no token and no user, redirect to login
    if (!token && !authContext.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If we have either a token or a user, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute; 