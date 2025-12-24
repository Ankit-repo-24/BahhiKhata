import AutoExpenseBadge from './AutoExpenseBadge';
import ManualExpenseBadge from './ManualExpenseBadge';
import CategoryIcon from './CategoryIcon';

export default function ExpenseItem({ expense, onDelete }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isDebit = expense.type === 'debit' || expense.amount < 0;
  const amount = Math.abs(expense.amount);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CategoryIcon category={expense.category} />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{expense.title || expense.merchant}</h3>
              {expense.source === 'UPI' ? <AutoExpenseBadge /> : <ManualExpenseBadge />}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{expense.category}</span>
              <span>•</span>
              <span>{formatDate(expense.date)}</span>
              {expense.upiNote && (
                <>
                  <span>•</span>
                  <span className="text-primary-600">{expense.upiNote}</span>
                </>
              )}
            </div>
            {expense.description && (
              <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className={`text-lg font-bold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
            {isDebit ? '-' : '+'}{formatAmount(amount)}
          </div>
          {expense.source === 'UPI' && onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-500 hover:text-red-700 text-sm mt-1"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}