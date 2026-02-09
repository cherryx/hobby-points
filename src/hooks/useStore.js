import { useState, useCallback } from 'react';
import { seedCustomers, seedTransactions, seedRewards } from '../data/seed';

const KEYS = {
  customers: 'rp_customers',
  transactions: 'rp_transactions',
  rewards: 'rp_rewards',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useStore() {
  const [customers, setCustomers] = useState(() => load(KEYS.customers, seedCustomers));
  const [transactions, setTransactions] = useState(() => load(KEYS.transactions, seedTransactions));
  const [rewards] = useState(() => load(KEYS.rewards, seedRewards));

  const persist = useCallback((key, setter) => (updater) => {
    setter(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save(key, next);
      return next;
    });
  }, []);

  const updateCustomers = persist(KEYS.customers, setCustomers);
  const updateTransactions = persist(KEYS.transactions, setTransactions);

  const addPoints = useCallback((customerId, amount, note) => {
    const tx = {
      id: `t_${Date.now()}`,
      customerId,
      type: 'earned',
      amount: Math.abs(amount),
      note,
      date: new Date().toISOString().split('T')[0],
    };
    updateTransactions(prev => [tx, ...prev]);
    updateCustomers(prev =>
      prev.map(c => c.id === customerId ? { ...c, points: c.points + Math.abs(amount) } : c)
    );
  }, [updateCustomers, updateTransactions]);

  const subtractPoints = useCallback((customerId, amount, note) => {
    const absAmount = Math.abs(amount);
    const tx = {
      id: `t_${Date.now()}`,
      customerId,
      type: 'redeemed',
      amount: absAmount,
      note,
      date: new Date().toISOString().split('T')[0],
    };
    updateTransactions(prev => [tx, ...prev]);
    updateCustomers(prev =>
      prev.map(c => c.id === customerId ? { ...c, points: Math.max(0, c.points - absAmount) } : c)
    );
  }, [updateCustomers, updateTransactions]);

  const addCustomer = useCallback((customer) => {
    const newCustomer = {
      ...customer,
      id: `c_${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      points: 0,
    };
    updateCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  }, [updateCustomers]);

  return {
    customers,
    transactions,
    rewards,
    addPoints,
    subtractPoints,
    addCustomer,
  };
}
