import { useState } from 'react';

export default function PointsModal({ customer, onClose, onAdd, onSubtract }) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const pts = parseInt(amount, 10);
    if (!pts || pts <= 0) return;
    if (mode === 'add') {
      onAdd(customer.id, pts, note || 'Manual adjustment');
    } else {
      if (pts > customer.points) return;
      onSubtract(customer.id, pts, note || 'Manual adjustment');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Adjust Points</h3>
          <p className="text-sm text-gray-500 mt-1">{customer.name} — Current: {customer.points} pts</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'add' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              + Add Points
            </button>
            <button
              type="button"
              onClick={() => setMode('subtract')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'subtract' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              - Subtract Points
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              min="1"
              max={mode === 'subtract' ? customer.points : undefined}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter points amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            {mode === 'subtract' && amount && parseInt(amount) > customer.points && (
              <p className="text-xs text-red-500 mt-1">Cannot exceed current balance</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Reason for adjustment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg text-sm font-medium text-white ${
                mode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {mode === 'add' ? 'Add' : 'Subtract'} Points
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
