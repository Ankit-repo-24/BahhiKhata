import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';
import api from '../utils/api';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    categoriesCount: 0,
    avgExpense: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);

      // Fetch expenses for stats
      const expensesResponse = await api.get('/expenses');
      const expenses = expensesResponse.data;

      // Calculate stats
      const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const categories = new Set(expenses.map(expense => expense.category)).size;
      const avgExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

      setStats({
        totalExpenses: expenses.length,
        totalAmount,
        categoriesCount: categories,
        avgExpense
      });
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="card text-center">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
          <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          <div className="mt-3">
            <button
              onClick={() => router.push('/add-upi')}
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Add UPI ID
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {stats.totalExpenses}
            </div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>

          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              ₹{stats.totalAmount.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>

          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {stats.categoriesCount}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>

          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              ₹{stats.avgExpense.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Avg Expense</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => router.push('/add-expense')}
              className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="text-sm font-medium text-primary-700">Add Expense</div>
            </button>

            <button
              onClick={() => router.push('/insights')}
              className="p-4 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-success-700">View Insights</div>
            </button>

            <button
              onClick={() => router.push('/expenses')}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-gray-700">All Expenses</div>
            </button>

            <button
              onClick={() => router.push('/add-upi')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">💳</div>
              <div className="text-sm font-medium text-blue-700">Add UPI ID</div>
            </button>

            <button
              onClick={() => {/* TODO: Implement export */}}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors lg:col-span-2"
            >
              <div className="text-2xl mb-2">📤</div>
              <div className="text-sm font-medium text-gray-700">Export Data</div>
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Notifications</div>
                <div className="text-sm text-gray-600">Get expense reminders</div>
              </div>
              <div className="w-12 h-6 bg-primary-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Budget Alerts</div>
                <div className="text-sm text-gray-600">Alert when nearing limit</div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Dark Mode</div>
                <div className="text-sm text-gray-600">Coming soon</div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Bahhi Khata</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Version 1.0.0</p>
            <p>Built for Indian users with UPI integration</p>
            <p>Secure, fast, and easy expense tracking</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}