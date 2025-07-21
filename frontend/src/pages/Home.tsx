import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MembershipCard, { MembershipTier } from '../components/premium/MembershipCard';
import './Home.css';

// Optimized interfaces
interface CategoryItem {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
}

interface TrustFeature {
  id: string;
  text: string;
}

// Memoized data - prevents recreation on each render
const SERVICE_CATEGORIES: CategoryItem[] = [
  {
    id: 'interior-works',
    title: 'Interior Works',
    description: 'Residential design, commercial planning, renovations, furniture, lighting, and more.',
    link: '/services?category=Interior Works',
    category: 'Interior Works'
  },
  {
    id: 'core-construction',
    title: 'Core Construction',
    description: 'New projects, structural renovations, facade improvements, landscaping, roofing, and foundations.',
    link: '/services?category=Core Construction',
    category: 'Core Construction'
  }
];

const HOW_IT_WORKS_STEPS: Step[] = [
  {
    id: 1,
    title: 'Sign Up & Browse',
    description: 'Create an account and explore a wide range of services and providers.'
  },
  {
    id: 2,
    title: 'Connect & Plan',
    description: 'Contact verified professionals, discuss your project, and get quotes.'
  },
  {
    id: 3,
    title: 'Execute & Manage',
    description: 'Utilize our platform tools for communication, payments, and project tracking.'
  }
];

const TRUST_FEATURES: TrustFeature[] = [
  { id: 'verification', text: 'Service Provider Verification' },
  { id: 'payment', text: 'Secure Payment Gateway' },
  { id: 'escrow', text: 'Project Escrow Services' },
  { id: 'dispute', text: 'Dispute Resolution System' }
];

const SAMPLE_MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'gold',
    name: 'Gold' as const,
    pricing: {
      monthly: 199,
      yearly: 1990,
      currency: 'USD'
    },
    description: 'Enhanced services and additional benefits.',
    benefits: {
      prioritySupport: true,
      dedicatedManager: true,
      customBranding: false,
      apiAccess: true,
      storageLimit: '100GB',
      maxUsers: 5
    },
    features: [
      { 
        id: 'priority', 
        name: 'Priority Scheduling',
        description: 'Get priority access to scheduling services',
        included: true
      },
      { 
        id: 'manager', 
        name: 'Dedicated Relationship Manager (Basic)',
        description: 'Personal manager for your account',
        included: true
      },
      { 
        id: 'consultations', 
        name: 'Exclusive Design Consultations (1/month)',
        description: 'Monthly design consultation sessions',
        included: true
      }
    ]
  }
];

// Memoized sub-components for better performance
const CategoryCard = memo(({ item }: { item: CategoryItem }) => (
  <div className="category-item">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <Link to={item.link} className="button" aria-label={`View ${item.title} services`}>
      View {item.title} Services
    </Link>
  </div>
));

CategoryCard.displayName = 'CategoryCard';

const StepCard = memo(({ step }: { step: Step }) => (
  <div className="step">
    <span aria-hidden="true">{step.id}</span>
    <h3>{step.title}</h3>
    <p>{step.description}</p>
  </div>
));

StepCard.displayName = 'StepCard';

const TrustFeatureItem = memo(({ feature }: { feature: TrustFeature }) => (
  <li key={feature.id}>{feature.text}</li>
));

TrustFeatureItem.displayName = 'TrustFeatureItem';

const HeroSection = memo(() => (
  <section className="hero-section">
    <h1>Connect with Top Construction & Interior Design Professionals</h1>
    <p>
      Your one-stop platform for all building and design needs. Find verified providers, 
      manage projects, and access exclusive services.
    </p>
    <Link 
      to="/services" 
      className="button hero-button"
      aria-label="Explore our services"
    >
      Explore Services
    </Link>
  </section>
));

HeroSection.displayName = 'HeroSection';

const ServiceCategoriesSection = memo(() => (
  <section className="featured-services">
    <h2>Our Core Service Categories</h2>
    <div className="service-categories-overview">
      {SERVICE_CATEGORIES.map(item => (
        <CategoryCard key={item.id} item={item} />
      ))}
    </div>
  </section>
));

ServiceCategoriesSection.displayName = 'ServiceCategoriesSection';

const MembershipSection = memo(() => {
  const handleMembershipSelect = () => {
    // In a real app, this would handle navigation or state updates
    console.log('Navigate to membership page');
  };

  return (
    <section className="premium-membership-preview">
      <h2>Unlock Premium Benefits</h2>
      <p>
        Join our premium membership for exclusive access to top-tier firms, 
        dedicated support, and luxury materials.
      </p>
      <div className="membership-tiers-home">
        {SAMPLE_MEMBERSHIP_TIERS.map(tier => (
          <MembershipCard 
            key={tier.id} 
            {...tier} 
            onSelect={handleMembershipSelect}
          />
        ))}
      </div>
      <Link to="/membership" className="button" aria-label="Learn more about membership plans">
        Learn More About Membership
      </Link>
    </section>
  );
});

MembershipSection.displayName = 'MembershipSection';

const HowItWorksSection = memo(() => (
  <section className="how-it-works">
    <h2>How It Works</h2>
    <div className="steps">
      {HOW_IT_WORKS_STEPS.map(step => (
        <StepCard key={step.id} step={step} />
      ))}
    </div>
  </section>
));

HowItWorksSection.displayName = 'HowItWorksSection';

const TrustSafetySection = memo(() => (
  <section className="trust-safety-preview">
    <h2>Your Trust & Safety is Our Priority</h2>
    <ul role="list">
      {TRUST_FEATURES.map(feature => (
        <TrustFeatureItem key={feature.id} feature={feature} />
      ))}
    </ul>
    <Link 
      to="/trust-safety" 
      className="button-secondary"
      aria-label="Learn more about our trust and safety measures"
    >
      Learn More
    </Link>
  </section>
));

TrustSafetySection.displayName = 'TrustSafetySection';

// Main component
const Home: React.FC = () => {
  // Memoize the page structure to prevent unnecessary re-renders
  const pageContent = useMemo(() => (
    <>
      <HeroSection />
      <ServiceCategoriesSection />
      <MembershipSection />
      <HowItWorksSection />
      <TrustSafetySection />
    </>
  ), []);

  return (
    <main className="home-page" role="main">
      {pageContent}
    </main>
  );
};

export default memo(Home);