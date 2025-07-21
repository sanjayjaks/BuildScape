import React, { useState, useContext, useRef, useEffect, forwardRef, InputHTMLAttributes, Ref, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AuthForm.css';


// Enhanced Input Component with better UX
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    inputRef?: Ref<HTMLInputElement>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const EnhancedInput = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, inputRef, leftIcon, rightIcon, className = '', ...props }, ref) => {
        const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = Boolean(props.value);

        return (
            <div className={`input-container ${error ? 'has-error' : ''} ${isFocused ? 'is-focused' : ''} ${hasValue ? 'has-value' : ''}`}>
                <div className="input-wrapper">
                    {leftIcon && <div className="input-icon left-icon">{leftIcon}</div>}
                    <input
                        id={inputId}
                        ref={inputRef || ref}
                        className={`enhanced-input ${className}`}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                    <label htmlFor={inputId} className="floating-label">
                        {label}
                        {props.required && <span className="required-indicator" aria-label="required">*</span>}
                    </label>
                    {rightIcon && <div className="input-icon right-icon">{rightIcon}</div>}
                </div>
                {error && (
                    <div className="input-error" role="alert" aria-live="polite">
                        <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}
                {helperText && !error && (
                    <div className="input-helper-text">{helperText}</div>
                )}
            </div>
        );
    }
);

EnhancedInput.displayName = 'EnhancedInput';

// Enhanced Password Input with better visibility toggle
interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    inputRef?: Ref<HTMLInputElement>;
    showPasswordStrength?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, helperText, inputRef, showPasswordStrength = false, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const [passwordStrength, setPasswordStrength] = useState(0);

        const calculatePasswordStrength = (password: string): number => {
            if (!password) return 0;
            
            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password)) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            return Math.min(strength, 100);
        };

        const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (showPasswordStrength) {
                setPasswordStrength(calculatePasswordStrength(value));
            }
            props.onChange?.(e);
        };

        const getStrengthLabel = (strength: number): string => {
            if (strength < 25) return 'Weak';
            if (strength < 50) return 'Fair';
            if (strength < 75) return 'Good';
            return 'Strong';
        };

        const getStrengthColor = (strength: number): string => {
            if (strength < 25) return 'strength-weak';
            if (strength < 50) return 'strength-fair';
            if (strength < 75) return 'strength-good';
            return 'strength-strong';
        };

        const toggleVisibility = () => {
            setShowPassword(!showPassword);
        };

        const eyeIcon = showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
        ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        );

        const rightIcon = (
            <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={props.disabled}
                tabIndex={-1}
            >
                {eyeIcon}
            </button>
        );

        return (
            <div className="password-input-container">
                <EnhancedInput
                    ref={inputRef || ref}
                    type={showPassword ? 'text' : 'password'}
                    label={label}
                    error={error}
                    helperText={helperText}
                    rightIcon={rightIcon}
                    onChange={handlePasswordChange}
                    {...props}
                />
                {showPasswordStrength && props.value && (
                    <div className="password-strength">
                        <div className="strength-bar">
                            <div 
                                className={`strength-fill ${getStrengthColor(passwordStrength)}`}
                                style={{ width: `${passwordStrength}%` }}
                            />
                        </div>
                        <span className="strength-label">{getStrengthLabel(passwordStrength)}</span>
                    </div>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

// Enhanced Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const EnhancedButton: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}) => {
    const buttonClass = `btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`;

    return (
        <button
            className={buttonClass}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="loading-spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                    </circle>
                </svg>
            )}
            {!loading && leftIcon && <span className="btn-icon left">{leftIcon}</span>}
            <span className="btn-text">{children}</span>
            {!loading && rightIcon && <span className="btn-icon right">{rightIcon}</span>}
        </button>
    );
};

// Enhanced Social Button
interface SocialButtonProps {
    provider: 'google' | 'facebook' | 'github' | 'apple';
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick, disabled = false, loading = false }) => {
    const getProviderConfig = (provider: string) => {
        const configs = {
            google: {
                name: 'Google',
                icon: (
                    <svg viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                ),
                className: 'social-btn-google'
            },
            facebook: {
                name: 'Facebook',
                icon: (
                    <svg viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                ),
                className: 'social-btn-facebook'
            },
            github: {
                name: 'GitHub',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                ),
                className: 'social-btn-github'
            },
            apple: {
                name: 'Apple',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                    </svg>
                ),
                className: 'social-btn-apple'
            }
        };
        return configs[provider as keyof typeof configs];
    };

    const config = getProviderConfig(provider);

    return (
        <EnhancedButton
            variant="outline"
            size="large"
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            leftIcon={config.icon}
            className={`social-btn ${config.className}`}
        >
            Continue with {config.name}
        </EnhancedButton>
    );
};

// Enhanced Login Form Component
type LoginStatus = 'idle' | 'loading' | 'mfa_required' | 'error' | 'success';

const EnhancedLoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        mfaCode: ''
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
    const [generalError, setGeneralError] = useState('');
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    // Refs for auto-focusing
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const mfaInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus appropriate input based on state
    useEffect(() => {
        if (loginStatus === 'mfa_required' && mfaInputRef.current) {
            mfaInputRef.current.focus();
        } else if (loginStatus === 'error' && emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, [loginStatus]);

    // Clear errors when user starts typing
    useEffect(() => {
        if (generalError || Object.keys(fieldErrors).length > 0) {
            const timer = setTimeout(() => {
                setGeneralError('');
                setFieldErrors({});
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [generalError, fieldErrors]);

    // If AuthContext is loading, show a loading indicator
    if (authContext === undefined) {
        return (
            <div className="enhanced-auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Loading authentication...</p>
                    </div>
                    <div className="loading-spinner" style={{ margin: '2rem auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            </div>
        );
    }

    if (!authContext) {
        return (
            <div className="auth-error-container">
                <div className="error-icon">⚠️</div>
                <h3>Service Unavailable</h3>
                <p>Authentication service is currently unavailable. Please try again later or contact support.</p>
            </div>
        );
    }

    const { login } = authContext;

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        if (loginStatus === 'mfa_required' && !formData.mfaCode.trim()) {
            errors.mfaCode = 'MFA code is required';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setGeneralError('');
        setLoginStatus('loading');

        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                setLoginStatus('success');
            } else {
                setGeneralError('Invalid email or password');
                setLoginStatus('error');
            }
        } catch (err: any) {
            setGeneralError(err.message || 'An error occurred during login');
            setLoginStatus('error');
        }
    };
    const handleSocialLogin = async (provider: string) => {
        setSocialLoading(provider);
        setGeneralError('');
        
        try {
            // TODO: Implement social login with backend
            // For now, we'll just show an error
            setGeneralError('Social login is not implemented yet');
            setSocialLoading(null);
        } catch (error: any) {
            setGeneralError(error.message || 'An error occurred during social login');
            setSocialLoading(null);
        }
    };

    const resetMfaState = () => {
        setLoginStatus('idle');
        setFormData(prev => ({ ...prev, mfaCode: '' }));
        setFieldErrors({});
        setGeneralError('');
    };

    const isLoading = loginStatus === 'loading';
    const showMfaInput = loginStatus === 'mfa_required';
    const isSuccess = loginStatus === 'success';

    return (
        <div className="enhanced-auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your account to continue</p>
                </div>

                {generalError && (
                    <div className="alert alert-error" role="alert">
                        <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {generalError}
                    </div>
                )}

                {isSuccess && (
                    <div className="alert alert-success" role="alert">
                        <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Login successful! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {!showMfaInput ? (
                        <>
                            <EnhancedInput
                                inputRef={emailInputRef}
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={fieldErrors.email}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                disabled={isLoading || isSuccess}
                                leftIcon={
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                }
                            />

                            <PasswordInput
                                inputRef={passwordInputRef}
                                label="Password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                error={fieldErrors.password}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                disabled={isLoading || isSuccess}
                            />
                        </>
                    ) : (
                        <div className="mfa-section">
                            <div className="mfa-header">
                                <svg className="mfa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <circle cx="12" cy="16" r="1"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <h3>Two-Factor Authentication</h3>
                                <p>Enter the 6-digit code from your authenticator app</p>
                            </div>

                            <EnhancedInput
                                inputRef={mfaInputRef}
                                label="Authentication Code"
                                type="text"
                                value={formData.mfaCode}
                                onChange={handleInputChange('mfaCode')}
                                error={fieldErrors.mfaCode}
                                placeholder="000000"
                                autoComplete="one-time-code"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                disabled={isLoading}
                                leftIcon={
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />

                            <EnhancedButton
                                type="button"
                                variant="ghost"
                                size="small"
                                onClick={resetMfaState}
                                disabled={isLoading}
                                className="back-btn"
                            >
                                ← Back to login
                            </EnhancedButton>
                        </div>
                    )}

                    <EnhancedButton
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={isLoading}
                        disabled={isLoading || isSuccess}
                        className="submit-btn"
                    >
                        {showMfaInput ? 'Verify Code' : 'Login'}
                    </EnhancedButton>
                </form>

                {!showMfaInput && (
                    <>
                        <div className="form-links">
                            <a href="/forgot-password" className="link">
                                Forgot your password?
                            </a>
                        </div>

                        <div className="divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-buttons">
                            <SocialButton
                                provider="google"
                                onClick={() => handleSocialLogin('google')}
                                disabled={isLoading || isSuccess}
                                loading={socialLoading === 'google'}
                            />
                            <SocialButton
                                provider="facebook"
                                onClick={() => handleSocialLogin('facebook')}
                                disabled={isLoading || isSuccess}
                                loading={socialLoading === 'facebook'}
                            />
                        </div>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <a href="/register" className="link link-primary">
                                    Register now
                                </a>
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Trust indicators */}
            <div className="trust-indicators">
                <div className="security-badge">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secured with 256-bit SSL encryption</span>
                </div>
                
                <div className="privacy-badge">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                    <span>Your privacy is protected</span>
                </div>
            </div>
        </div>
    );
};

export default EnhancedLoginForm;

// Pricing Switch Component
interface PricingSwitchProps {
  isYearly: boolean;
  onChange: (isYearly: boolean) => void;
  disabled?: boolean;
}

const PricingSwitch = memo<PricingSwitchProps>(({ isYearly, onChange, disabled = false }) => {
  return (
    <div className="pricing-switch">
      <button
        className={`switch-option ${!isYearly ? 'active' : ''}`}
        onClick={() => !disabled && onChange(false)}
        disabled={disabled}
      >
        Monthly
      </button>
      <button
        className={`switch-option ${isYearly ? 'active' : ''}`}
        onClick={() => !disabled && onChange(true)}
        disabled={disabled}
      >
        Yearly
      </button>
    </div>
  );
});

PricingSwitch.displayName = 'PricingSwitch';