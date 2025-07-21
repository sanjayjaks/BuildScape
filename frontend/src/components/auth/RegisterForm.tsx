import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Building, User, Mail, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService'; // Assuming this path is correct

type UserType = 'regular' | 'serviceProvider';

// Helper to get the corresponding CSS class for password strength
const getPasswordStrengthClass = (score: number): string => {
  if (score <= 0) return '';
  if (score === 1) return 'strength-very-weak'; // Assuming CSS might have this or we use colors array
  if (score === 2) return 'strength-weak';
  if (score === 3) return 'strength-fair';
  if (score === 4) return 'strength-good';
  if (score >= 5) return 'strength-strong';
  return '';
};

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('regular');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Password strength calculation
  const getPasswordStrengthScore = (passwordStr: string) => {
    let score = 0;
    if (!passwordStr) return 0;
    if (passwordStr.length >= 8) score++;
    if (/[A-Z]/.test(passwordStr)) score++;
    if (/[a-z]/.test(passwordStr)) score++;
    if (/[0-9]/.test(passwordStr)) score++;
    if (/[^A-Za-z0-9]/.test(passwordStr)) score++;
    return score;
  };

  const passwordStrengthScore = getPasswordStrengthScore(password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong']; // Adjusted for 0-4 or 1-5 score
  // Colors for the password strength bar, matching labels. Score 0 = no color.
  const strengthColors = ['#dc2626', '#f59e0b', '#f59e0b', '#10b981', '#059669'];
  // For CSS: .strength-weak, .strength-fair, .strength-good, .strength-strong are available
  //  We'll use inline style for color to match the 5 levels, but width from score.

  const validateForm = () => {
    const newFieldErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newFieldErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email.trim()) {
      newFieldErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!password) {
      newFieldErrors.password = 'Password is required';
      isValid = false;
    } else if (passwordStrengthScore < 2 && password.length > 0) {
        newFieldErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and symbols for better strength.';
    }

    if (!confirmPassword) {
      newFieldErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
      setError('Passwords do not match');
      isValid = false;
    }

    if (userType === 'serviceProvider' && !licenseFile) {
      newFieldErrors.license = 'License document is required for service providers';
      isValid = false;
    }
    
    setFieldErrors(newFieldErrors);
    if (!isValid && Object.keys(newFieldErrors).length > 0) {
        if (error && error !== 'Passwords do not match') setError(''); 
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let resp;
      if (userType === 'serviceProvider') {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userType', userType);
        if (licenseFile) formData.append('documents', licenseFile);

        const { default: api } = await import('../../services/api');
        resp = await api.post('/services/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Regular user registration
        resp = await authService.register({
          name,
          email,
          password,
          userType,
        });
      }
      console.log('Registration successful:', resp);
      navigate('/login?status=registered');
    } catch (err: any) {
      const message = err.response?.data?.message || 'An unexpected error occurred during registration.';
      setError(message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
  };
  
  const commonInputProps = (fieldName: string) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => {
      setFocusedField(null);
      validateForm(); // Validate on blur for specific field if desired
    },
    required: true,
    className: "enhanced-input",
  });

  const getInputContainerClass = (fieldName: string, value: string) => {
    let classes = "input-container";
    if (focusedField === fieldName) classes += " is-focused";
    if (value) classes += " has-value";
    if (fieldErrors[fieldName]) classes += " has-error";
    return classes;
  };


  return (
    <div className="enhanced-auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-header">
          {/* Custom icon from original design - can be kept if desired, or simplify to text only */}
          {/* <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform hover:scale-110">
             <User className="w-8 h-8 text-white" />
          </div> */}
          <h1>Create Account</h1>
          <p>Join our platform today and get started.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertTriangle className="alert-icon" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container"> {/* No floating label for Account Type buttons */}
            {/* Account Type uses custom button styling, not directly from enhanced CSS button variants, adapted slightly */}
            <label className="text-sm font-semibold text-gray-700" style={{ display: 'block', marginBottom: '0.5rem'}}>Account Type</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}> {/* Using inline styles for flex for this custom part */}
              <button
                type="button"
                onClick={() => handleUserTypeChange('regular')}
                className={`btn btn-outline btn-medium ${userType === 'regular' ? 'active-type' : ''}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: '1.2' }}
              >
                <User className="icon" style={{ marginBottom: '0.25rem', width: '1.25rem', height: '1.25rem' }} />
                Regular User
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('serviceProvider')}
                className={`btn btn-outline btn-medium ${userType === 'serviceProvider' ? 'active-type' : ''}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: '1.2' }}
              >
                <Building className="icon" style={{ marginBottom: '0.25rem', width: '1.25rem', height: '1.25rem'}} />
                Service Provider
              </button>
            </div>
            {/* Add a new CSS class e.g. .btn.active-type { background: #f0f0f0; border-color: #000; color: #000; } for active state */}
          </div>
          
          {/* Name Input */}
          <div className={getInputContainerClass('name', name)}>
            <span className="input-icon left-icon"><User /></span>
            <label htmlFor="name" className="floating-label">Full Name <span className="required-indicator">*</span></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" " // Placeholder for floating label animations
              {...commonInputProps('name')}
            />
            {fieldErrors.name && <p className="input-error"><AlertTriangle className="error-icon" /> {fieldErrors.name}</p>}
          </div>

          {/* Email Input */}
          <div className={getInputContainerClass('email', email)}>
            <span className="input-icon left-icon"><Mail /></span>
            <label htmlFor="email" className="floating-label">Email <span className="required-indicator">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              {...commonInputProps('email')}
            />
            {fieldErrors.email && <p className="input-error"><AlertTriangle className="error-icon" /> {fieldErrors.email}</p>}
          </div>

          {/* Password Input */}
          <div className={getInputContainerClass('password', password)}>
            <span className="input-icon left-icon"><Lock /></span>
            <label htmlFor="password" className="floating-label">Password <span className="required-indicator">*</span></label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                {...commonInputProps('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn input-icon right-icon"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {fieldErrors.password && <p className="input-error"><AlertTriangle className="error-icon" /> {fieldErrors.password}</p>}
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill" // Removed specific strength classes like strength-good
                    style={{
                      width: `${(passwordStrengthScore / 5) * 100}%`,
                      backgroundColor: passwordStrengthScore > 0 ? strengthColors[passwordStrengthScore - 1] : 'transparent',
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: passwordStrengthScore > 0 ? strengthColors[passwordStrengthScore - 1] : '#6b7280' }}
                >
                  {passwordStrengthScore > 0 ? strengthLabels[passwordStrengthScore - 1] : 'Enter password'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className={getInputContainerClass('confirmPassword', confirmPassword)}>
            <span className="input-icon left-icon"><Lock /></span>
            <label htmlFor="confirmPassword" className="floating-label">Confirm Password <span className="required-indicator">*</span></label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                {...commonInputProps('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-btn input-icon right-icon"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
              {confirmPassword && password && (
                <span className="input-icon right-icon" style={{ right: '2.5rem' }}> {/* Adjust position if needed */}
                  {password === confirmPassword ? (
                    <Check style={{ color: 'green' }}/>
                  ) : (
                    <X style={{ color: 'red' }} />
                  )}
                </span>
              )}
            </div>
            {fieldErrors.confirmPassword && <p className="input-error"><AlertTriangle className="error-icon" /> {fieldErrors.confirmPassword}</p>}
          </div>

          {/* License upload for service providers */}
          {userType === 'serviceProvider' && (
            <div className={getInputContainerClass('license', licenseFile ? 'yes' : '')}>
              <span className="input-icon left-icon"><ShieldCheck /></span>
              <label htmlFor="license" className="floating-label">
                Upload License <span className="required-indicator">*</span>
              </label>
              <input
                type="file"
                id="license"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setLicenseFile(e.target.files?.[0] || null)}
                required={userType === 'serviceProvider'}
                className="enhanced-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              {licenseFile && (
                <span className="input-helper-text">
                  Selected: {licenseFile.name}
                </span>
              )}
              {fieldErrors.license && <p className="input-error"><AlertTriangle className="error-icon" /> {fieldErrors.license}</p>}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-large submit-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ // Basic spinner, CSS has .loading-spinner
                    width: '1em', height: '1em', borderWidth: '2px', borderStyle: 'solid',
                    borderColor: 'currentColor currentColor currentColor transparent',
                    borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite'
                }}></span>
                <span className="btn-text">Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="form-links">
          <p>
            Already have an account?{' '}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="link link-primary">
              Sign In
            </a>
          </p>
        </div>

        {/* Example of trust indicators as per CSS (optional) */}
        {/* <div className="trust-indicators" style={{marginTop: '1.5rem'}}>
            <div className="security-badge">
                <ShieldCheck /> Data secured with SSL encryption
            </div>
        </div> */}
      </motion.div>
      {/* A simple style for the spinner to be injected, or ensure .loading-spinner in your CSS covers it */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn.active-type { background: #f0f0f0; border-color: #000; font-weight: 600; } /* Example style for active account type */
        .btn.active-type .icon { color: #000; } /* Example */
        .input-icon svg { width: 100%; height: 100%; } /* Ensure lucide icons size correctly */
      `}</style>
    </div>
  );
};

export default RegisterForm;