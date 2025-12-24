import React from 'react';

const categoryIcons = {
  'Food & Dining': '🍽️',
  'Kirana & Groceries': '🛒',
  'Transportation': '🚗',
  'Travel': '✈️',
  'Bills & Utilities': '💡',
  'Healthcare': '🏥',
  'Education': '📚',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Recharge & Mobile': '📱',
  'Online Shopping': '💻',
  'Rent': '🏠',
  'Petrol/Diesel': '⛽',
  'Auto Rickshaw': '🚲',
  'Taxi/Cab': '🚕',
  'Train/Bus': '🚆',
  'Medical': '⚕️',
  'Pharmacy': '💊',
  'Insurance': '🛡️',
  'Investments': '📈',
  'EMI/Payments': '💳',
  'Other': '📦'
};

const categoryColors = {
  'Food & Dining': 'bg-orange-100 text-orange-800',
  'Kirana & Groceries': 'bg-green-100 text-green-800',
  'Transportation': 'bg-blue-100 text-blue-800',
  'Travel': 'bg-purple-100 text-purple-800',
  'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
  'Healthcare': 'bg-red-100 text-red-800',
  'Education': 'bg-indigo-100 text-indigo-800',
  'Entertainment': 'bg-pink-100 text-pink-800',
  'Shopping': 'bg-teal-100 text-teal-800',
  'Recharge & Mobile': 'bg-cyan-100 text-cyan-800',
  'Online Shopping': 'bg-lime-100 text-lime-800',
  'Rent': 'bg-amber-100 text-amber-800',
  'Petrol/Diesel': 'bg-slate-100 text-slate-800',
  'Auto Rickshaw': 'bg-emerald-100 text-emerald-800',
  'Taxi/Cab': 'bg-violet-100 text-violet-800',
  'Train/Bus': 'bg-rose-100 text-rose-800',
  'Medical': 'bg-red-100 text-red-800',
  'Pharmacy': 'bg-blue-100 text-blue-800',
  'Insurance': 'bg-gray-100 text-gray-800',
  'Investments': 'bg-green-100 text-green-800',
  'EMI/Payments': 'bg-purple-100 text-purple-800',
  'Other': 'bg-gray-100 text-gray-800'
};

export default function CategoryBadge({ category, size = 'sm', showIcon = true }) {
  const icon = categoryIcons[category] || '📦';
  const colors = categoryColors[category] || 'bg-gray-100 text-gray-800';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors} ${sizeClasses[size]}`}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {category}
    </span>
  );
}