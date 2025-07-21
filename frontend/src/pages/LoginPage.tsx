import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import AuthLayout from '../layouts/AuthLayout'; // Use the AuthLayout
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage; 