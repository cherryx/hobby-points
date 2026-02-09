import { getTier, TIERS } from '../utils/tiers';
import TierBadge from '../components/TierBadge';

export default function Dashboard({ customers, transactions, onNavigate }) {
  const totalPoints = customers.reduce((s, c) => s + c.points, 0);
  const totalEarned = transactions.filter(t => t.type === 'earned').reduce((s, t) => s + t.amount, 0);
  const totalRedeemed = transactions.filter(t => t.type === 'redeemed').reduce((s, t) => s + t.amount, 0);

  const tierCounts = TIERS.map(tier => ({
    ...tier,
    count: customers.filter(c => getTier(c.points).name === tier.name).length,
  }));

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const topCustomers = [...customers]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your loyalty program</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value={customers.length} icon="👥" color="bg-blue-50 text-blue-700" />
        <StatCard label="Total Points Issued" value={totalPoints.toLocaleString()} icon="⭐" color="bg-yellow-50 text-yellow-700" />
        <StatCard label="Points Earned" value={totalEarned.toLocaleString()} icon="📈" color="bg-green-50 text-green-700" />
        <StatCard label="Points Redeemed" value={totalRedeemed.toLocaleString()} icon="🎁" color="bg-purple-50 text-purple-700" />
      </div>

      {/* Tier Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Tier Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tierCounts.map(tier => (
            <div key={tier.name} className={`rounded-lg p-4 ${tier.bg}`}>
              <div className="text-2xl font-bold">{tier.count}</div>
              <div className="text-sm font-medium">{tier.name}</div>
              <div className="text-xs opacity-75">{tier.min}–{tier.max === Infinity ? '∞' : tier.max} pts</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Top Customers</h3>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge points={c.points} />
                  <span className="text-sm font-semibold text-gray-900">{c.points.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map(tx => {
              const customer = customers.find(c => c.id === tx.customerId);
              return (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{tx.note}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                    </div>
                    <div className="text-xs text-gray-400">{tx.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
