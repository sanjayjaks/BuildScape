import React, { useState, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { FaCheck, FaStar, FaCrown, FaGem, FaLock, FaShieldAlt, FaRocket, FaHeadset } from 'react-icons/fa';
import '../components/premium/MembershipCard.css';
import './MembershipPage.css';
import MembershipCard, { MembershipTier as ImportedMembershipTier } from '../components/premium/MembershipCard';

// Lazy load heavy components
const Button = lazy(() => import('../components/ui/Button'));

// Types
export interface Feature {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly included: boolean;
  readonly highlight?: boolean;
}

export interface PricingDetails {
  readonly monthly: number;
  readonly yearly: number;
  readonly currency: string;
  readonly discountPercentage?: number;
}

export interface MembershipBenefits {
  readonly prioritySupport: boolean;
  readonly dedicatedManager: boolean;
  readonly customBranding: boolean;
  readonly apiAccess: boolean;
  readonly storageLimit: string;
  readonly maxUsers: number;
}

export interface MembershipTier extends ImportedMembershipTier {
  readonly id: string;
  readonly name: 'Silver' | 'Gold' | 'Platinum';
  readonly pricing: PricingDetails;
  readonly description: string;
  readonly features: readonly Feature[];
  readonly benefits: MembershipBenefits;
  readonly popularChoice?: boolean;
  readonly isCurrentPlan?: boolean;
  readonly onSelect?: (tierId: string) => void;
  readonly metadata?: {
    readonly icon: React.ElementType;
    readonly color: string;
    readonly gradient: string;
  };
}

// Constants - Moved outside component for better performance
const TIER_CONFIG = {
  Silver: { icon: FaStar, color: '#718096' },
  Gold: { icon: FaCrown, color: '#F6AD55' },
  Platinum: { icon: FaGem, color: '#9F7AEA' }
} as const;

const ANIMATION_CONFIG = {
  transition: { type: 'spring', stiffness: 300, damping: 30 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { scale: 0.98 }
} as const;

const FEATURE_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
} as const;

// Memoized Components
interface FeatureTooltipProps {
  readonly feature: Feature;
}

const FeatureTooltip = memo<FeatureTooltipProps>(({ feature }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  if (!feature.description) return null;

  return (
    <div 
      className="feature-tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="tooltip"
      aria-label={feature.description}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="feature-tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {feature.description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FeatureTooltip.displayName = 'FeatureTooltip';

interface PricingSwitchProps {
  readonly isYearly: boolean;
  readonly onChange: (isYearly: boolean) => void;
  readonly disabled?: boolean;
}

const PricingSwitch = memo<PricingSwitchProps>(({ isYearly, onChange, disabled = false }) => {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!isYearly);
    }
  }, [disabled, isYearly, onChange]);

  return (
    <div className="pricing-switch">
      <span className={!isYearly ? 'active' : ''}>Monthly</span>
      <button
        className={`switch ${isYearly ? 'yearly' : 'monthly'}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
        aria-checked={isYearly}
        role="switch"
      >
        <motion.div 
          className="switch-handle"
          animate={{ x: isYearly ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span className={isYearly ? 'active' : ''}>Yearly</span>
      {isYearly && (
        <motion.span 
          className="savings-indicator"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 600 }}
        >
          Save 20%
        </motion.span>
      )}
    </div>
  );
});

PricingSwitch.displayName = 'PricingSwitch';

interface FeatureListProps {
  readonly features: readonly Feature[];
}

const FeatureList = memo<FeatureListProps>(({ features }) => {
  return (
    <motion.ul 
      className="feature-list"
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.li
          key={feature.id}
          className={`feature-item ${feature.highlight ? 'highlighted' : ''} ${!feature.included ? 'disabled' : ''}`}
          custom={index}
          variants={FEATURE_VARIANTS}
          whileHover={{ x: 4, transition: { duration: 0.1 } }}
        >
          <FaCheck 
            className={`check-icon ${feature.included ? 'included' : ''}`}
            aria-hidden="true"
          />
          <span>{feature.name}</span>
          {feature.description && <FeatureTooltip feature={feature} />}
        </motion.li>
      ))}
    </motion.ul>
  );
});

FeatureList.displayName = 'FeatureList';

interface BenefitsOverviewProps {
  readonly benefits: MembershipBenefits;
}

const BenefitsOverview = memo<BenefitsOverviewProps>(({ benefits }) => {
  const benefitsList = useMemo(() => [
    `Up to ${benefits.maxUsers} team members`,
    `${benefits.storageLimit} storage`,
    ...(benefits.prioritySupport ? ['Priority support'] : []),
    ...(benefits.dedicatedManager ? ['Dedicated success manager'] : []),
    ...(benefits.customBranding ? ['Custom branding'] : []),
    ...(benefits.apiAccess ? ['API access'] : [])
  ], [benefits]);

  return (
    <div className="benefits-overview">
      <h4>Key Benefits</h4>
      <ul>
        {benefitsList.map((benefit, index) => (
          <motion.li
            key={benefit}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <FaCheck className="check-icon included" aria-hidden="true" />
            {benefit}
          </motion.li>
        ))}
      </ul>
    </div>
  );
});

BenefitsOverview.displayName = 'BenefitsOverview';

// Main Component
const MembershipPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const membershipTiers: MembershipTier[] = useMemo(() => [
    {
      id: 'silver',
      name: 'Silver',
      pricing: {
        monthly: 49,
        yearly: 490,
        currency: 'USD',
        discountPercentage: 20
      },
      description: 'Perfect for individuals and small projects',
      features: [
        {
          id: 'basic-support',
          name: 'Basic Support',
          description: 'Email support with 24-hour response time',
          included: true
        },
        {
          id: 'basic-analytics',
          name: 'Basic Analytics',
          description: 'Access to basic project analytics',
          included: true
        },
        {
          id: 'standard-storage',
          name: '5GB Storage',
          description: 'Store up to 5GB of project files',
          included: true
        },
        {
          id: 'priority-support',
          name: 'Priority Support',
          description: 'Get faster response times',
          included: false
        }
      ],
      benefits: {
        prioritySupport: false,
        dedicatedManager: false,
        customBranding: false,
        apiAccess: false,
        storageLimit: '5GB',
        maxUsers: 1
      },
      metadata: {
        icon: FaStar,
        color: '#718096',
        gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }
    },
    {
      id: 'gold',
      name: 'Gold',
      pricing: {
        monthly: 99,
        yearly: 990,
        currency: 'USD',
        discountPercentage: 20
      },
      description: 'Ideal for growing businesses',
      features: [
        {
          id: 'priority-support-gold',
          name: 'Priority Support',
          description: '24/7 priority support with 4-hour response time',
          included: true
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'Detailed project analytics and insights',
          included: true
        },
        {
          id: 'increased-storage',
          name: '50GB Storage',
          description: 'Store up to 50GB of project files',
          included: true
        },
        {
          id: 'dedicated-manager',
          name: 'Dedicated Manager',
          description: 'Personal account manager',
          included: true
        }
      ],
      benefits: {
        prioritySupport: true,
        dedicatedManager: true,
        customBranding: false,
        apiAccess: true,
        storageLimit: '50GB',
        maxUsers: 5
      },
      popularChoice: true,
      metadata: {
        icon: FaCrown,
        color: '#F6AD55',
        gradient: 'linear-gradient(135deg, #fff9c4 0%, #fff176 100%)'
      }
    },
    {
      id: 'platinum',
      name: 'Platinum',
      pricing: {
        monthly: 199,
        yearly: 1990,
        currency: 'USD',
        discountPercentage: 20
      },
      description: 'For enterprise-level needs',
      features: [
        {
          id: 'enterprise-support',
          name: 'Enterprise Support',
          description: '24/7 dedicated support team',
          included: true
        },
        {
          id: 'enterprise-analytics',
          name: 'Enterprise Analytics',
          description: 'Advanced analytics with custom reporting',
          included: true
        },
        {
          id: 'unlimited-storage',
          name: 'Unlimited Storage',
          description: 'Store unlimited project files',
          included: true
        },
        {
          id: 'custom-branding',
          name: 'Custom Branding',
          description: 'White-label solution with custom branding',
          included: true
        }
      ],
      benefits: {
        prioritySupport: true,
        dedicatedManager: true,
        customBranding: true,
        apiAccess: true,
        storageLimit: 'Unlimited',
        maxUsers: 20
      },
      metadata: {
        icon: FaGem,
        color: '#9F7AEA',
        gradient: 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)'
      }
    }
  ], []);

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    // Here you would typically handle the successful payment
    // and update the user's membership status
  };

  return (
    <div className="membership-page">
      <motion.div
        className="membership-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Choose Your Premium Plan</h1>
        <p>Select the perfect plan for your needs and unlock premium features</p>
      </motion.div>

      <div className="features-overview">
        <motion.div 
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaShieldAlt className="feature-icon" />
          <h3>Secure & Reliable</h3>
          <p>Enterprise-grade security for your data</p>
        </motion.div>
          <motion.div 
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaRocket className="feature-icon" />
          <h3>Fast Performance</h3>
          <p>Optimized for speed and efficiency</p>
          </motion.div>
          <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaHeadset className="feature-icon" />
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer support</p>
          </motion.div>
        </div>

      <div className="membership-tiers">
        {membershipTiers.map((tier) => (
          <MembershipCard
            key={tier.id}
            {...tier}
            onSelect={handleSelectTier}
          />
        ))}
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            className="payment-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-content">
              <h2>Complete Your Purchase</h2>
              <p>You're upgrading to the {selectedTier} plan</p>
              {/* Add your payment form or integration here */}
              <div className="payment-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-button"
                  onClick={handlePaymentComplete}
                >
                  <FaLock /> Proceed to Payment
                </button>
              </div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change my plan later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards and PayPal.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, we offer a 14-day free trial for all plans.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription at any time.</p>
          </div>
        </div>
        </div>
        </div>
  );
};

export default MembershipPage;

// Export utility functions for testing
export const utils = {
  calculateSavings: (monthly: number, yearly: number) => monthly * 12 - yearly,
  formatPrice: (price: number, currency: string) => `${currency}${price}`,
  getTierConfig: (tierName: 'Silver' | 'Gold' | 'Platinum') => TIER_CONFIG[tierName]
};