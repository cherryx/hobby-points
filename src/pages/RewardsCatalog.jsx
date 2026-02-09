export default function RewardsCatalog({ rewards }) {
  const sorted = [...rewards].sort((a, b) => a.pointsCost - b.pointsCost);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rewards Catalog</h2>
        <p className="text-sm text-gray-500 mt-1">Items customers can redeem with their points</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map(reward => (
          <div
            key={reward.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{reward.image}</div>
            <h3 className="text-sm font-semibold text-gray-900">{reward.name}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">{reward.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-600">{reward.pointsCost.toLocaleString()} pts</span>
              <span className="text-xs text-gray-400">
                {reward.pointsCost < 500 ? 'Bronze+' : reward.pointsCost < 1000 ? 'Silver+' : 'Gold+'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
