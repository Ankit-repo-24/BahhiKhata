import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseTable from '../components/ExpenseTable';
import AutoExpenseBadge from '../components/AutoExpenseBadge';
import ManualExpenseBadge from '../components/ManualExpenseBadge';
import CsvImportModal from '../components/CsvImportModal';
import { supabase } from '../utils/supabase';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showCsvImport, setShowCsvImport] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      // Transform data to match component expectations
      const transformedExpenses = data.map(exp => ({
        id: exp.id,
        title: exp.description.split(' - ')[0] || exp.description,
        amount: -Math.abs(exp.amount), // Assuming expenses are positive in DB
        category: exp.category,
        date: exp.created_at,
        source: exp.payment_method === 'Manual' ? 'MANUAL' : 'UPI',
        type: 'debit'
      }));

      setExpenses(transformedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upi') return expense.source === 'UPI';
    if (activeTab === 'manual') return expense.source === 'MANUAL';
    return true;
  });

  const upiExpenses = expenses.filter(e => e.source === 'UPI');
  const manualExpenses = expenses.filter(e => e.source === 'MANUAL');

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const upiSpent = upiExpenses
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);

  const manualSpent = manualExpenses
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your expenses...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Expenses</h2>
            <p className="text-gray-600">{expenses.length} transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCsvImport(true)}
              className="btn btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import CSV
            </button>
            <button
              onClick={() => router.push('/add-expense')}
              className="btn btn-success lg:w-auto w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <div className="text-lg font-bold text-primary-600 mb-1">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-xs text-gray-600">Total Spent</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">
              {formatCurrency(upiSpent)}
            </div>
            <div className="text-xs text-gray-600">UPI Tracked</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-bold text-gray-600 mb-1">
              {formatCurrency(manualSpent)}
            </div>
            <div className="text-xs text-gray-600">Manual</div>
          </div>
        </div>

        {/* Desktop: Tab Navigation + Table */}
        <div className="hidden lg:block">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('upi')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upi'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AutoExpenseBadge /> ({upiExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ManualExpenseBadge /> ({manualExpenses.length})
            </button>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={handleDelete}
            showFilters={false}
          />
        </div>

        {/* Mobile: Tab Navigation + Card List */}
        <div className="lg:hidden">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('upi')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upi'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AutoExpenseBadge /> ({upiExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ManualExpenseBadge /> ({manualExpenses.length})
            </button>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-6">Try switching tabs or add a new expense.</p>
              <button
                onClick={() => router.push('/add-expense')}
                className="btn btn-primary"
              >
                Add Expense
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <ExpenseItem key={expense.id} expense={expense} onDelete={handleDeleteExpense} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CsvImportModal
        isOpen={showCsvImport}
        onClose={() => setShowCsvImport(false)}
        onImport={handleCsvImport}
      />
    </ResponsiveLayout>
  );
}