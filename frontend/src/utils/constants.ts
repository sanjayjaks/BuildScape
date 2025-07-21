export const APP_NAME = 'Construction & Interior Design Services';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SERVICES: '/services',
  PROJECTS: '/projects',
  NEW_PROJECT: '/projects/new',
  PROFILE: '/profile',
  MEMBERSHIP: '/membership',
  // Add more routes as needed
};
// Service Categories (as in your document)
export const SERVICE_CATEGORIES = {
  INTERIOR: 'Interior Works',
  CONSTRUCTION: 'Core Construction',
};

// Interior Works Sub-categories
export const INTERIOR_SERVICES_TYPES = [
  "Residential interior design",
  "Commercial space planning",
  "Specific room renovations",
  "Furniture selection and customization",
  "Lighting design and installation",
  "Color consultation and material selection",
];

// Core Construction Sub-categories
export const CONSTRUCTION_SERVICES_TYPES = [
  "New construction projects",
  "Structural renovations",
  "Facade improvements",
  "Landscaping and outdoor living spaces",
  "Roofing and waterproofing",
  "Foundation work and structural reinforcement",
];

// Premium Membership Tiers
export const MEMBERSHIP_TIERS = {
  SILVER: { name: 'Silver', price: 99, id: 'silver' },
  GOLD: { name: 'Gold', price: 199, id: 'gold' },
  PLATINUM: { name: 'Platinum', price: 349, id: 'platinum' },
};

// Other constants
export const PASSWORD_MIN_LENGTH = 8;
// Regex for password strength (example: at least one uppercase, one lowercase, one digit, one special)
export const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;