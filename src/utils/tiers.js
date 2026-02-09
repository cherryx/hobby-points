export const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: 'amber-700', bg: 'bg-amber-100 text-amber-800', badge: 'bg-amber-700' },
  { name: 'Silver', min: 500, max: 999, color: 'gray-400', bg: 'bg-gray-200 text-gray-700', badge: 'bg-gray-400' },
  { name: 'Gold', min: 1000, max: Infinity, color: 'yellow-500', bg: 'bg-yellow-100 text-yellow-800', badge: 'bg-yellow-500' },
];

export function getTier(points) {
  return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
}

export function getNextTier(points) {
  const current = getTier(points);
  const idx = TIERS.indexOf(current);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export function progressToNextTier(points) {
  const current = getTier(points);
  const next = getNextTier(points);
  if (!next) return 100;
  const range = next.min - current.min;
  const progress = points - current.min;
  return Math.min(100, Math.round((progress / range) * 100));
}
