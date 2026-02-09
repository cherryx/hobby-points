import { useState } from 'react';
import TierBadge from '../components/TierBadge';

export default function CustomerPortal({ customers, onUpdateCustomer }) {
  const [selectedId, setSelectedId] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', dob: '' });

  const customer = customers.find(c => c.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setEditing(false);
    const c = customers.find(c => c.id === id);
    if (c) {
      setForm({ name: c.name, address: c.address || '', dob: c.dob || '' });
    }
  };

  const handleEdit = () => {
    setForm({ name: customer.name, address: customer.address || '', dob: customer.dob || '' });
    setEditing(true);
  };

  const handleSave = () => {
    onUpdateCustomer(customer.id, {
      name: form.name,
      address: form.address,
      dob: form.dob,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ name: customer.name, address: customer.address || '', dob: customer.dob || '' });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Portal</h2>
        <p className="text-sm text-gray-500 mt-1">View your points and manage your profile</p>
      </div>

      {/* Customer Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Log in as customer
        </label>
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a customer...</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
          ))}
        </select>
      </div>

      {customer && (
        <>
          {/* Points Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Balance</p>
              <div className="mt-1 text-lg font-bold text-gray-900">
                {customer.points.toLocaleString()} pts
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tier</p>
              <div className="mt-1 text-lg font-bold text-gray-900">
                <TierBadge points={customer.points} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</p>
              <div className="mt-1 text-lg font-bold text-gray-900">{customer.joinDate}</div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Profile</h3>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <dl className="space-y-3">
                <ProfileRow label="Name" value={customer.name} />
                <ProfileRow label="Email" value={customer.email} />
                <ProfileRow label="Address" value={customer.address || 'Not provided'} />
                <ProfileRow label="Date of Birth" value={customer.dob || 'Not provided'} />
              </dl>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
