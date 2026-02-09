import { getTier } from './tiers';

export function exportCustomersCSV(customers, transactions) {
  const headers = ['Name', 'Email', 'Join Date', 'Points', 'Tier', 'Total Earned', 'Total Redeemed'];
  const rows = customers.map(c => {
    const custTx = transactions.filter(t => t.customerId === c.id);
    const earned = custTx.filter(t => t.type === 'earned').reduce((s, t) => s + t.amount, 0);
    const redeemed = custTx.filter(t => t.type === 'redeemed').reduce((s, t) => s + t.amount, 0);
    return [c.name, c.email, c.joinDate, c.points, getTier(c.points).name, earned, redeemed];
  });

  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
