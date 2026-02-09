import { useState } from 'react';
import { useStore } from './hooks/useStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerProfile from './pages/CustomerProfile';
import RewardsCatalog from './pages/RewardsCatalog';

export default function App() {
  const store = useStore();
  const [page, setPage] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setPage('profile');
  };

  const handleBackFromProfile = () => {
    setSelectedCustomerId(null);
    setPage('customers');
  };

  const selectedCustomer = store.customers.find(c => c.id === selectedCustomerId);

  const renderPage = () => {
    if (page === 'profile' && selectedCustomer) {
      return (
        <CustomerProfile
          customer={selectedCustomer}
          transactions={store.transactions}
          onBack={handleBackFromProfile}
          onAdd={store.addPoints}
          onSubtract={store.subtractPoints}
        />
      );
    }
    switch (page) {
      case 'customers':
        return (
          <CustomerList
            customers={store.customers}
            transactions={store.transactions}
            onSelectCustomer={handleSelectCustomer}
            onAddCustomer={store.addCustomer}
          />
        );
      case 'rewards':
        return <RewardsCatalog rewards={store.rewards} />;
      default:
        return (
          <Dashboard
            customers={store.customers}
            transactions={store.transactions}
            onNavigate={setPage}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold text-gray-900">HobbyPoints</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
