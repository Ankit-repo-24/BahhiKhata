import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch {
      alert('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">My Expenses</h2>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </div>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((e) => (
            <li key={e.id} className="card flex justify-between">
              <span>{e.title} ({e.category})</span>
              <strong>₹{e.amount}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
