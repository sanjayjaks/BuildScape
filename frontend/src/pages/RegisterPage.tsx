import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLayout from '../layouts/AuthLayout';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage; 