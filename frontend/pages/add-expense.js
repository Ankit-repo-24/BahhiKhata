import { useState } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { supabase } from '../utils/supabase';

export default function AddExpense() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'manual' // 'manual' or 'upi'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food & Dining',
    'Kirana & Groceries',
    'Transportation',
    'Travel',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Entertainment',
    'Shopping',
    'Recharge & Mobile',
    'Online Shopping',
    'Rent',
    'Petrol/Diesel',
    'Auto Rickshaw',
    'Taxi/Cab',
    'Train/Bus',
    'Medical',
    'Pharmacy',
    'Insurance',
    'Investments',
    'EMI/Payments',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(formData.amount),
            category: formData.category,
            payment_method: formData.type === 'manual' ? 'Manual' : 'UPI',
            description: formData.title + (formData.description ? ' - ' + formData.description : ''),
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      router.push('/expenses');
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">➕ Add Expense</h2>
          <p className="text-gray-600">Track your spending manually or via UPI</p>
        </div>

        {/* Expense Type Toggle */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Type</h3>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'manual'})}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                formData.type === 'manual'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">📝</div>
                <div className="font-medium">Manual Entry</div>
                <div className="text-sm opacity-75">Add expense manually</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'upi'})}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                formData.type === 'upi'
                  ? 'border-success-500 bg-success-50 text-success-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">💳</div>
                <div className="font-medium">UPI Transaction</div>
                <div className="text-sm opacity-75">Auto-tracked via UPI</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          {error && (
            <div className="alert alert-error mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input - Prominent */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-medium">₹</span>
                </div>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  className="input pl-8 text-lg font-semibold"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                What did you spend on? *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input"
                placeholder="e.g., Lunch at CCD"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="input"
                placeholder="Add any additional details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* UPI-specific fields */}
            {formData.type === 'upi' && (
              <div className="space-y-4 p-4 bg-success-50 rounded-lg border border-success-200">
                <h4 className="font-medium text-success-800">UPI Transaction Details</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value="user@upi"
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={`TXN${Date.now()}`}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm text-success-700">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>This transaction will be auto-tracked from your UPI app</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn btn-success"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Expense...
                  </div>
                ) : (
                  `Add ${formData.type === 'manual' ? 'Expense' : 'Transaction'}`
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { emoji: '🍽️', name: 'Food' },
              { emoji: '🚗', name: 'Transport' },
              { emoji: '☕', name: 'Coffee' },
              { emoji: '🛒', name: 'Shopping' }
            ].map((quickItem) => (
              <button
                key={quickItem.name}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                onClick={() => {
                  setFormData({
                    ...formData,
                    category: quickItem.name === 'Food' ? 'Food & Dining' :
                             quickItem.name === 'Transport' ? 'Transportation' :
                             quickItem.name === 'Coffee' ? 'Food & Dining' : 'Shopping',
                    title: quickItem.name
                  });
                }}
              >
                <div className="text-2xl mb-1">{quickItem.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{quickItem.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}