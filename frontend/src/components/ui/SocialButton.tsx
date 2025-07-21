import React from 'react';
import Button from './Button'; // Assuming you use your custom Button

interface SocialButtonProps {
  provider: 'google' | 'facebook'; // Add more as needed
  onClick: () => void;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick, className }) => {
  let buttonText = '';
  let icon = null; // Placeholder for an SVG icon

  switch (provider) {
    case 'google':
      buttonText = 'Continue with Google';
      // icon = <GoogleIcon />; // Replace with actual SVG or FontAwesome icon
      break;
    case 'facebook':
      buttonText = 'Continue with Facebook';
      // icon = <FacebookIcon />;
      break;
    default:
      return null;
  }

  return (
    <Button
      onClick={onClick}
      variant="secondary" // Or a custom variant for social buttons
      className={`w-full flex items-center justify-center my-2 ${className || ''}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {buttonText}
    </Button>
  );
};

export default SocialButton;