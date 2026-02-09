import { getTier } from '../utils/tiers';

export default function TierBadge({ points }) {
  const tier = getTier(points);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tier.bg}`}>
      {tier.name}
    </span>
  );
}
