import { useState } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import BudgetProgressBar from '../components/BudgetProgressBar';

export default function Budgets() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', allocated: 5000, spent: 3240, period: 'monthly' },
    { id: 2, category: 'Travel', allocated: 2000, spent: 890, period: 'monthly' },
    { id: 3, category: 'Entertainment', allocated: 1500, spent: 1200, period: 'monthly' },
    { id: 4, category: 'Bills', allocated: 3000, spent: 2800, period: 'monthly' },
    { id: 5, category: 'Shopping', allocated: 2500, spent: 1800, period: 'monthly' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    allocated: '',
    period: 'monthly'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.allocated) {
      setBudgets([...budgets, {
        id: Date.now(),
        category: newBudget.category,
        allocated: parseFloat(newBudget.allocated),
        spent: 0,
        period: newBudget.period
      }]);
      setNewBudget({ category: '', allocated: '', period: 'monthly' });
      setShowAddForm(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🎯 Budgets</h2>
            <p className="text-gray-600">Set and track your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary lg:w-auto w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Budget
          </button>
        </div>

        {/* Overall Budget Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {formatCurrency(totalAllocated)}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-sm text-gray-600">Spent</div>
          </div>
          <div className="card text-center">
            <div className={`text-2xl font-bold mb-1 ${
              totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalRemaining)}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Add Budget Form */}
        {showAddForm && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Budget</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Kirana">Kirana</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={newBudget.allocated}
                  onChange={(e) => setNewBudget({...newBudget, allocated: e.target.value})}
                  placeholder="5000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddBudget}
                  className="btn btn-primary w-full"
                >
                  Add Budget
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Budget List */}
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-600 capitalize">{budget.period} budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                  </div>
                </div>
              </div>

              <BudgetProgressBar
                current={budget.spent}
                total={budget.allocated}
                category={budget.category}
                color={budget.spent > budget.allocated ? 'danger' : 'primary'}
              />
            </div>
          ))}
        </div>

        {/* Budget Tips */}
        <div className="card bg-gradient-to-r from-blue-50 to-primary-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Budget Tips</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Set realistic budgets based on your past spending patterns</p>
            <p>• Review your budgets weekly and adjust as needed</p>
            <p>• Use category budgets to control impulse spending</p>
            <p>• Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}