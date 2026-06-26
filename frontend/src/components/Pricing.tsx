interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for getting started with TikTok automation.',
    features: [
      '15 AI Videos per month',
      '1 TikTok Account',
      'Standard Support',
      'Basic Analytics',
    ],
  },
  {
    name: 'Pro',
    price: '$59',
    description: 'For creators ready to scale their content.',
    features: [
      '60 AI Videos per month',
      '5 TikTok Accounts',
      'Auto-Posting',
      'Priority Support',
      'Advanced Analytics',
      'Custom Branding',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$149',
    description: 'For businesses and power creators.',
    features: [
      'Unlimited AI Videos',
      '20+ TikTok Accounts',
      'Advanced Analytics Dashboard',
      '24/7 Dedicated Support',
      'Custom Integrations',
      'Team Collaboration',
    ],
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={`pricing-card ${tier.highlighted ? 'pricing-card-highlighted' : ''}`}>
      {tier.badge && <div className="pricing-badge">{tier.badge}</div>}
      <div className="pricing-card-header">
        <h3 className="pricing-name">{tier.name}</h3>
        <div className="pricing-price">
          <span className="pricing-amount">{tier.price}</span>
          <span className="pricing-period">/mo</span>
        </div>
        <p className="pricing-description">{tier.description}</p>
      </div>
      <ul className="pricing-features">
        {tier.features.map((feature, i) => (
          <li key={i} className="pricing-feature">
            <span className="pricing-check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`btn pricing-cta ${tier.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
        Get Started
      </button>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Scale your TikTok content creation with the perfect plan for your needs
        </p>
      </div>
      <div className="pricing-grid">
        {tiers.map((tier, i) => (
          <PricingCard key={i} tier={tier} />
        ))}
      </div>
    </div>
  );
}