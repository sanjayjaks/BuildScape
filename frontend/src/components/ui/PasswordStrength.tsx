import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++; // Uppercase
    if (/[a-z]/.test(password)) score++; // Lowercase
    if (/[0-9]/.test(password)) score++; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters
    
    return Math.min(score, 5); // Max score of 5
  };

  const strength = getStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColor = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500', 'bg-green-600'];

  if (!password) return null;

  return (
    <div className="mt-1 mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Password Strength: {strengthText[strength]}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${strengthColor[strength]}`}
          style={{ width: `${(strength / 5) * 100}%`, transition: 'width 0.3s ease-in-out' }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrength;