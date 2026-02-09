import { useMemo, useState } from 'react';
import TierBadge from '../components/TierBadge';
import PointsModal from '../components/PointsModal';
import { getTier, getNextTier, progressToNextTier } from '../utils/tiers';

export default function CustomerProfile({ customer, transactions, onBack, onAdd, onSubtract }) {
  const [showPointsModal, setShowPointsModal] = useState(false);

  const custTransactions = useMemo(
    () => transactions
      .filter(t => t.customerId === customer.id)
      .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, customer.id]
  );

  const totalEarned = custTransactions.filter(t => t.type === 'earned').reduce((s, t) => s + t.amount, 0);
  const totalRedeemed = custTransactions.filter(t => t.type === 'redeemed').reduce((s, t) => s + t.amount, 0);

  const tier = getTier(customer.points);
  const nextTier = getNextTier(customer.points);
  const progress = progressToNextTier(customer.points);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
        <button
          onClick={() => setShowPointsModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Adjust Points
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard label="Current Balance" value={`${customer.points.toLocaleString()} pts`} />
        <InfoCard label="Tier" value={<TierBadge points={customer.points} />} />
        <InfoCard label="Total Earned" value={`${totalEarned.toLocaleString()} pts`} />
        <InfoCard label="Total Redeemed" value={`${totalRedeemed.toLocaleString()} pts`} />
      </div>

      {/* Tier Progress & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Tier Progress</h3>
          {nextTier ? (
            <>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{tier.name}</span>
                <span>{nextTier.name} ({nextTier.min} pts)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {nextTier.min - customer.points} points until {nextTier.name}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Highest tier reached! 🎉
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Details</h3>
          <dl className="space-y-3">
            <DetailRow label="Full Name" value={customer.name} />
            <DetailRow label="Email" value={customer.email} />
            <DetailRow label="Member Since" value={customer.joinDate} />
            <DetailRow label="Customer ID" value={customer.id} />
          </dl>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Points History</h3>
          <p className="text-xs text-gray-500 mt-1">{custTransactions.length} transactions</p>
        </div>
        {custTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {custTransactions.map(tx => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'earned' ? '↑' : '↓'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tx.note}</div>
                    <div className="text-xs text-gray-500">{tx.date}</div>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  tx.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">No transactions yet.</div>
        )}
      </div>

      {showPointsModal && (
        <PointsModal
          customer={customer}
          onClose={() => setShowPointsModal(false)}
          onAdd={onAdd}
          onSubtract={onSubtract}
        />
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="mt-1 text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
