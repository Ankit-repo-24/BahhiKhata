import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';
import InsightCard from '../components/InsightCard';
import CategoryIcon from '../components/CategoryIcon';
import ChartCard from '../components/ChartCard';
import BudgetProgressBar from '../components/BudgetProgressBar';
import { CategoryBreakdownChart, MonthlyTrendChart } from '../components/SpendingCharts';

export default function Insights() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insightsData, setInsightsData] = useState({
    totalSpent: 0,
    upiSpent: 0,
    manualSpent: 0,
    monthlyAverage: 0,
    categoryBreakdown: [],
    weeklyTrend: [],
    topInsights: []
  });

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = () => {
    // Mock data - in real app, this would come from API
    const mockExpenses = [
      { id: 1, title: 'Swiggy Order', amount: -340, category: 'Food', source: 'UPI', date: new Date() },
      { id: 2, title: 'Auto Rickshaw', amount: -80, category: 'Travel', source: 'MANUAL', date: new Date(Date.now() - 86400000) },
      { id: 3, title: 'Salary Credit', amount: 25000, category: 'UPI Transfers', source: 'UPI', date: new Date(Date.now() - 172800000) },
      { id: 4, title: 'Kirana Shopping', amount: -450, category: 'Kirana', source: 'UPI', date: new Date(Date.now() - 259200000) },
      { id: 5, title: 'Movie Tickets', amount: -600, category: 'Entertainment', source: 'MANUAL', date: new Date(Date.now() - 345600000) },
      { id: 6, title: 'Petrol', amount: -1200, category: 'Fuel', source: 'UPI', date: new Date(Date.now() - 432000000) },
      { id: 7, title: 'Coffee', amount: -120, category: 'Food', source: 'UPI', date: new Date(Date.now() - 518400000) },
      { id: 8, title: 'Recharge', amount: -299, category: 'Bills', source: 'MANUAL', date: new Date(Date.now() - 604800000) }
    ];

    const debitExpenses = mockExpenses.filter(e => e.amount < 0);
    const totalSpent = debitExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
    const upiSpent = debitExpenses.filter(e => e.source === 'UPI').reduce((sum, e) => sum + Math.abs(e.amount), 0);
    const manualSpent = debitExpenses.filter(e => e.source === 'MANUAL').reduce((sum, e) => sum + Math.abs(e.amount), 0);

    // Category breakdown
    const categoryMap = {};
    debitExpenses.forEach(expense => {
      const category = expense.category;
      categoryMap[category] = (categoryMap[category] || 0) + Math.abs(expense.amount);
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount, percentage: (amount / totalSpent) * 100 }))
      .sort((a, b) => b.amount - a.amount);

    const topInsights = [
      { title: 'Food Expenses', value: '₹3,240', subtitle: 'This month', trend: 12, icon: '🍽️', color: 'warning' },
      { title: 'Travel Cost', value: '₹890', subtitle: 'This month', trend: -8, icon: '🚗', color: 'success' },
      { title: 'Savings Rate', value: '23%', subtitle: 'vs last month', trend: 5, icon: '💰', color: 'primary' },
      { title: 'UPI Usage', value: '78%', subtitle: 'of transactions', trend: 15, icon: '📱', color: 'info' }
    ];

    setInsightsData({
      totalSpent,
      upiSpent,
      manualSpent,
      monthlyAverage: totalSpent / 30,
      categoryBreakdown,
      topInsights
    });

    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your spending...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Insights</h2>
          <p className="text-gray-600">Smart analysis of your spending habits</p>
        </div>

        {/* Key Metrics - Desktop: 4 columns, Mobile: 2 rows */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {formatCurrency(insightsData.totalSpent)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {formatCurrency(insightsData.upiSpent)}
            </div>
            <div className="text-sm text-gray-600">UPI Tracked</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-gray-600 mb-1">
              {formatCurrency(insightsData.manualSpent)}
            </div>
            <div className="text-sm text-gray-600">Manual</div>
          </div>
          <div className="card text-center">
            <div className="text-xl font-bold text-success-600 mb-1">
              {formatCurrency(insightsData.monthlyAverage)}
            </div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
        </div>

        {/* Desktop Charts Row */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          <ChartCard title="Monthly Trend" subtitle="Last 6 months">
            <MonthlyTrendChart data={[
              { month: 'Aug', amount: 12500 },
              { month: 'Sep', amount: 15200 },
              { month: 'Oct', amount: 13800 },
              { month: 'Nov', amount: 16700 },
              { month: 'Dec', amount: 14300 },
              { month: 'Jan', amount: insightsData.totalSpent }
            ]} />
          </ChartCard>
          <ChartCard title="Category Breakdown" subtitle="This month">
            <CategoryBreakdownChart data={insightsData.categoryBreakdown} />
          </ChartCard>
        </div>

        {/* Top Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insightsData.topInsights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        </div>

        {/* Category Breakdown & Budget Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {insightsData.categoryBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon category={item.category} />
                    <div>
                      <div className="font-medium text-gray-900">{item.category}</div>
                      <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}% of spending</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.amount)}</div>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h3>
              <BudgetProgressBar
                current={insightsData.totalSpent}
                total={20000}
                category="Overall Budget"
                color="primary"
              />
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Budgets</h3>
              <div className="space-y-4">
                <BudgetProgressBar
                  current={3240}
                  total={5000}
                  category="Food"
                  color="warning"
                  showPercentage={false}
                />
                <BudgetProgressBar
                  current={890}
                  total={2000}
                  category="Travel"
                  color="success"
                  showPercentage={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="card bg-gradient-to-r from-blue-50 to-primary-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Smart Recommendations</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <p>Great job using UPI for {((insightsData.upiSpent / insightsData.totalSpent) * 100).toFixed(0)}% of transactions - it's secure and instant!</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">⚠</span>
              <p>Your food expenses are trending up. Consider meal prepping or setting a ₹500 daily food budget.</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">💡</span>
              <p>Travel costs are down 8% - keep using public transport or shared rides to save more!</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">🎯</span>
              <p>Based on your spending, you could save ₹2,500 more this month by optimizing {insightsData.categoryBreakdown[0]?.category} expenses.</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}