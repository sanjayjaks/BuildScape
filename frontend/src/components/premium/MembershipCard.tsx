import React, { useState, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { FaCheck, FaStar, FaCrown, FaGem } from 'react-icons/fa';
import './MembershipCard.css';

// Lazy load heavy components
const Button = lazy(() => import('../ui/Button'));

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

export interface MembershipTier {
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
const MembershipCard: React.FC<MembershipTier> = (tier) => {
  const [isYearly, setIsYearly] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Memoized calculations
  const tierConfig = useMemo(() => TIER_CONFIG[tier.name], [tier.name]);
  
  const pricing = useMemo(() => {
    const currentPrice = isYearly ? tier.pricing.yearly : tier.pricing.monthly;
    const savings = isYearly && tier.pricing.discountPercentage 
      ? (tier.pricing.monthly * 12 - tier.pricing.yearly)
      : 0;
    
    return { currentPrice, savings };
  }, [isYearly, tier.pricing]);

  const buttonText = useMemo(() => {
    if (tier.isCurrentPlan) return 'Current Plan';
    return tier.name === 'Silver' ? 'Get Started' : `Upgrade to ${tier.name}`;
  }, [tier.name, tier.isCurrentPlan]);

  // Event handlers
  const handleSelectTier = useCallback(() => {
    if (tier.onSelect && !tier.isCurrentPlan) {
      tier.onSelect(tier.id);
    }
  }, [tier]);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  const TierIcon = tierConfig.icon;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={`
          membership-card 
          ${tier.name.toLowerCase()} 
          ${tier.isCurrentPlan ? 'current-plan' : ''}
          ${tier.popularChoice ? 'popular-choice' : ''}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={ANIMATION_CONFIG.hover}
        whileTap={ANIMATION_CONFIG.tap}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={{
          '--tier-color': tierConfig.color,
          background: tier.metadata?.gradient
        } as React.CSSProperties}
        layout
      >
        {tier.popularChoice && (
          <motion.div 
            className="popular-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Most Popular
          </motion.div>
        )}

        <div className="card-header">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <TierIcon 
              className="tier-icon" 
              style={{ color: tierConfig.color }}
              aria-hidden="true"
            />
          </motion.div>
          <h3>{tier.name}</h3>
          <p className="description">{tier.description}</p>
        </div>

        <div className="pricing-container">
          <PricingSwitch 
            isYearly={isYearly} 
            onChange={setIsYearly}
            disabled={tier.isCurrentPlan}
          />
          
          <motion.div 
            className="price"
            key={`${pricing.currentPrice}-${isYearly}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="currency">{tier.pricing.currency}</span>
            <span className="amount">{pricing.currentPrice}</span>
            <span className="period">/{isYearly ? 'year' : 'month'}</span>
          </motion.div>
          
          <AnimatePresence>
            {isYearly && pricing.savings > 0 && (
              <motion.div 
                className="savings-badge"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                Save {tier.pricing.currency}{pricing.savings.toFixed(0)}/year
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BenefitsOverview benefits={tier.benefits} />

        <FeatureList features={tier.features} />

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          {tier.onSelect && !tier.isCurrentPlan ? (
            <Suspense fallback={<div className="select-button">Loading...</div>}>
              <Button 
                onClick={handleSelectTier}
                className="select-button"
                style={{
                  background: `linear-gradient(135deg, ${tierConfig.color} 0%, ${tierConfig.color}dd 100%)`
                }}
                disabled={tier.isCurrentPlan}
                aria-label={`Select ${tier.name} plan`}
              >
                {buttonText}
              </Button>
            </Suspense>
          ) : tier.isCurrentPlan ? (
            <motion.div 
              className="current-plan-indicator"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <FaCheck aria-hidden="true" />
              Your Current Plan
            </motion.div>
          ) : null}
        </div>

        {/* Accessibility improvements */}
        <div className="sr-only">
          <h4>Plan Summary</h4>
          <p>
            {tier.name} plan costs {tier.pricing.currency}{pricing.currentPrice} per {isYearly ? 'year' : 'month'}.
            Includes {tier.benefits.maxUsers} team members, {tier.benefits.storageLimit} storage,
            {tier.benefits.prioritySupport && ' priority support,'}
            {tier.benefits.dedicatedManager && ' dedicated manager,'}
            {tier.benefits.customBranding && ' custom branding,'}
            {tier.benefits.apiAccess && ' API access,'}
            and {tier.features.filter(f => f.included).length} additional features.
          </p>
        </div>
      </motion.div>
    </MotionConfig>
  );
};

// Performance optimizations
const MembershipCardMemo = memo(MembershipCard, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.isCurrentPlan === nextProps.isCurrentPlan &&
    prevProps.popularChoice === nextProps.popularChoice &&
    prevProps.pricing.monthly === nextProps.pricing.monthly &&
    prevProps.pricing.yearly === nextProps.pricing.yearly &&
    prevProps.features.length === nextProps.features.length &&
    prevProps.onSelect === nextProps.onSelect
  );
});

MembershipCardMemo.displayName = 'MembershipCard';

export default MembershipCardMemo;

// Export utility functions for testing
export const utils = {
  calculateSavings: (monthly: number, yearly: number) => monthly * 12 - yearly,
  formatPrice: (price: number, currency: string) => `${currency}${price}`,
  getTierConfig: (tierName: 'Silver' | 'Gold' | 'Platinum') => TIER_CONFIG[tierName]
};