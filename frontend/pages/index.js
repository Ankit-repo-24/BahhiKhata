import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';
import UpiStatusCard from '../components/UpiStatusCard';
import ExpenseItem from '../components/ExpenseItem';
import InsightCard from '../components/InsightCard';
import BudgetProgressBar from '../components/BudgetProgressBar';
import ChartCard from '../components/ChartCard';
import { CategoryBreakdownChart, MonthlyTrendChart } from '../components/SpendingCharts';
import { supabase } from '../utils/supabase';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlySpend: 0,
    budgetRemaining: 0,
    recentExpenses: [],
    insights: []
  });

  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem('supabase_session');
      if (session) {
        setIsLoggedIn(true);
        loadDashboardData();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
        return;
      }

      // Calculate monthly spend
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyExpenses = data.filter(exp => {
        const expDate = new Date(exp.created_at);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      });
      const monthlySpend = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Recent expenses
      const recentExpenses = data.slice(0, 5).map(exp => ({
        id: exp.id,
        title: exp.description.split(' - ')[0] || exp.description,
        amount: -exp.amount,
        category: exp.category,
        date: exp.created_at,
        source: exp.payment_method === 'Manual' ? 'MANUAL' : 'UPI',
        type: 'debit'
      }));

      // Insights (mock for now, can be calculated)
      const insights = [
        { title: 'Total Expenses', value: formatCurrency(monthlySpend), subtitle: 'This month', trend: 0, icon: '💸', color: 'primary' },
        { title: 'Transactions', value: data.length.toString(), subtitle: 'This month', trend: 0, icon: '📊', color: 'success' }
      ];

      setDashboardData({
        monthlySpend,
        budgetRemaining: 20000 - monthlySpend, // Mock budget
        recentExpenses,
        insights
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  // If user is logged in, show mobile dashboard
  if (isLoggedIn) {
    if (loading) {
      return (
        <ResponsiveLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your financial dashboard...</p>
            </div>
          </div>
        </ResponsiveLayout>
      );
    }

    return (
      <ResponsiveLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Namaste!</h1>
                <p className="text-gray-600">Welcome back to your financial dashboard</p>
              </div>
            </div>
          </div>

          {/* KPI Cards - Enhanced Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">This Month</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-1">
                {formatCurrency(dashboardData.monthlySpend)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Spent</div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Remaining</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(dashboardData.budgetRemaining)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Budget Left</div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">Auto-tracked</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                {formatCurrency(dashboardData.upiSpent)}
              </div>
              <div className="text-sm text-gray-600 font-medium">UPI Transactions</div>
            </div>

            <div className="card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Manual</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                {formatCurrency(dashboardData.manualSpent)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Manual Entries</div>
            </div>
          </div>

          {/* Desktop: Charts Row - Enhanced */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            <ChartCard title="Weekly Spending Trend" subtitle="Last 4 weeks" className="hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Spending Pattern</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Live Data
                </div>
              </div>
              <MonthlyTrendChart data={[
                { month: 'Week 1', amount: 3200 },
                { month: 'Week 2', amount: 4100 },
                { month: 'Week 3', amount: 3800 },
                { month: 'Week 4', amount: dashboardData.monthlySpend }
              ]} />
            </ChartCard>
            <ChartCard title="Top Spending Categories" subtitle="This month" className="hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Category Breakdown</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  ₹{dashboardData.monthlySpend.toLocaleString('en-IN')} total
                </div>
              </div>
              <CategoryBreakdownChart data={[
                { category: 'Food & Dining', amount: 3240 },
                { category: 'Transportation', amount: 1200 },
                { category: 'Kirana & Groceries', amount: 890 },
                { category: 'Entertainment', amount: 650 },
                { category: 'Bills & Utilities', amount: 440 }
              ]} />
            </ChartCard>
          </div>

          {/* UPI Status - Enhanced */}
          <UpiStatusCard
            upiId="harsh@upi"
            isVerified={true}
            onAddUpi={() => router.push('/add-upi')}
            className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 hover:shadow-lg transition-all duration-300"
          />

          {/* Budget Progress - Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Monthly Budget</h3>
                  <p className="text-sm text-gray-600">Overall spending limit</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <BudgetProgressBar
                current={dashboardData.monthlySpend}
                total={20000}
                category="Overall Budget"
                color="primary"
                showPercentage={true}
                className="mb-4"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Spent: <span className="font-semibold text-red-600">{formatCurrency(dashboardData.monthlySpend)}</span></span>
                <span className="text-gray-600">Limit: <span className="font-semibold text-gray-900">{formatCurrency(20000)}</span></span>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Category Budgets</h3>
                  <p className="text-sm text-gray-600">Track spending by category</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <BudgetProgressBar
                  current={3240}
                  total={5000}
                  category="Food & Dining"
                  color="warning"
                  showPercentage={false}
                />
                <BudgetProgressBar
                  current={890}
                  total={2000}
                  category="Transportation"
                  color="success"
                  showPercentage={false}
                />
                <BudgetProgressBar
                  current={650}
                  total={1500}
                  category="Entertainment"
                  color="info"
                  showPercentage={false}
                />
              </div>
              <button
                onClick={() => router.push('/budgets')}
                className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center space-x-2 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <span>View All Budgets</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Insights - Enhanced */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Insights</h3>
                <p className="text-gray-600">AI-powered spending analysis</p>
              </div>
              <button
                onClick={() => router.push('/insights')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-2 px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {dashboardData.insights.map((insight, index) => (
                <InsightCard key={index} {...insight} className="hover:shadow-lg transition-all duration-300 hover:scale-105" />
              ))}
            </div>
          </div>

          {/* Recent Activity - Enhanced */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-gray-600">Your latest transactions</p>
              </div>
              <button
                onClick={() => router.push('/expenses')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-2 px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentExpenses.slice(0, 4).map((expense) => (
                <ExpenseItem key={expense.id} expense={expense} className="hover:shadow-md transition-shadow duration-300" />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/add-expense')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold">Add Expense</span>
                <span className="text-sm opacity-90">Quick entry</span>
              </button>

              <button
                onClick={() => router.push('/expenses')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold">All Expenses</span>
                <span className="text-sm opacity-90">View history</span>
              </button>

              <button
                onClick={() => router.push('/insights')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-semibold">Insights</span>
                <span className="text-sm opacity-90">Smart analysis</span>
              </button>

              <button
                onClick={() => router.push('/budgets')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-warning-500 to-warning-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="font-semibold">Budgets</span>
                <span className="text-sm opacity-90">Set limits</span>
              </button>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="card bg-gradient-to-r from-blue-50 to-primary-50 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Smart Tips</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Your food expenses are 12% higher than last month</p>
              <p>• Consider setting a ₹500 daily food budget</p>
              <p>• Great job on reducing travel costs!</p>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // Landing page for non-logged-in users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Bahhi Khata</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </a>
              <a
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                className="btn btn-primary text-sm"
              >
                Sign Up
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-primary-600 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - PhonePe/Paytm Style */}
      <section id="main-content" className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              RBI Licensed • Secure & Trusted
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Track Every
              <span className="text-primary-600"> Rupee</span> Smartly
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              India's most trusted expense tracker. Monitor your spending, save money, and build better financial habits with UPI integration.
            </p>

            {/* Key Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                UPI Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Bank Grade Security
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Free Forever
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="btn btn-primary px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                Start Tracking Expenses
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/login')}
                className="btn btn-secondary px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Indian Context */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Indians Choose Bahhi Khata
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for Indian users, by Indian developers. Understanding local needs and UPI ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">₹ Currency Native</h3>
              <p className="text-gray-600">Built for Indian Rupee with proper formatting, denominations, and local spending patterns.</p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">UPI Integration</h3>
              <p className="text-gray-600">Seamlessly track UPI transactions, QR payments, and digital wallet spending.</p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analytics</h3>
              <p className="text-gray-600">Understand your spending patterns with category-wise breakdown and monthly insights.</p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Level Security</h3>
              <p className="text-gray-600">Your financial data is encrypted and secure. No data shared with third parties.</p>
            </div>

            {/* Feature 5 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Instant expense tracking with offline support. Works even without internet.</p>
            </div>

            {/* Feature 6 */}
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-300">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Made in India</h3>
              <p className="text-gray-600">Designed specifically for Indian users with local context and cultural understanding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Thousands of Indians
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users say about managing their finances with Bahhi Khata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card text-center">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Bahhi Khata has completely changed how I track my expenses. The UPI integration is seamless and the insights are incredibly helpful for budgeting."
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">R</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Rahul Sharma</div>
                  <div className="text-sm text-gray-600">Software Engineer, Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card text-center">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Finally, an expense tracker that understands Indian spending habits. The ₹ formatting and category suggestions are spot on!"
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">P</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Priya Patel</div>
                  <div className="text-sm text-gray-600">Business Owner, Mumbai</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card text-center">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The budget tracking feature helped me save ₹15,000 this year. The smart recommendations are actually useful!"
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-warning-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Amit Kumar</div>
                  <div className="text-sm text-gray-600">Student, Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Money?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of Indians who are already saving smarter with Bahhi Khata.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <svg className="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
                <span className="text-lg font-semibold">Bahhi Khata</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                India's most trusted expense tracker. Track every rupee, save smarter, and build better financial habits with UPI integration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Bahhi Khata. Made with ❤️ in India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}