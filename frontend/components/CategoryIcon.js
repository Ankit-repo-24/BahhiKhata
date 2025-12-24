export default function CategoryIcon({ category, size = 'w-12 h-12' }) {
  const getIcon = (category) => {
    const icons = {
      'Food': '🍽️',
      'Kirana / Grocery': '🛒',
      'Rent': '🏠',
      'Mobile Recharge': '📱',
      'Electricity / Water': '💡',
      'Travel': '🚗',
      'Medical': '🏥',
      'Education': '📚',
      'Entertainment': '🎬',
      'UPI Transfers': '💸',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Transport': '🚕',
      'Recharge': '🔋',
      'Coffee': '☕',
      'General Store': '🏪',
      'Personal Care': '💄',
      'Fitness': '🏃',
      'Maintenance': '🔧',
      'Investments': '📈',
      'Gifts': '🎁',
      'Banking': '🏦'
    };
    return icons[category] || '💰';
  };

  return (
    <div className={`${size} bg-primary-50 rounded-full flex items-center justify-center`}>
      <span className="text-xl">{getIcon(category)}</span>
    </div>
  );
}