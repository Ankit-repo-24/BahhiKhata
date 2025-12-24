export default function BudgetProgressBar({
  current,
  total,
  category,
  color = 'primary',
  showPercentage = true
}) {
  const percentage = Math.min((current / total) * 100, 100);
  const isOverBudget = current > total;

  const colorClasses = {
    primary: isOverBudget ? 'bg-red-500' : 'bg-primary-500',
    success: isOverBudget ? 'bg-red-500' : 'bg-green-500',
    warning: isOverBudget ? 'bg-red-500' : 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">{category}</span>
        {showPercentage && (
          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>{formatCurrency(current)} spent</span>
        <span>{formatCurrency(total)} budget</span>
      </div>

      {isOverBudget && (
        <div className="text-xs text-red-600 font-medium">
          ⚠️ Over budget by {formatCurrency(current - total)}
        </div>
      )}
    </div>
  );
}