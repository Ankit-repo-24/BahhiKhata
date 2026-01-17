import { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Stats() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dailyAvg, setDailyAvg] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/stats/monthly'),
      api.get('/stats/by-category'),
      api.get('/stats/daily-average'),
    ]).then(([m, c, d]) => {
      setMonthly(m.data);
      setCategories(c.data);
      setDailyAvg(d.data.daily_average);
    });
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-2xl font-semibold mb-6">
          Spending Analytics
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card">Daily Avg ₹{dailyAvg}</div>
          <div className="card">Categories {categories.length}</div>
          <div className="card">Months {monthly.length}</div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
