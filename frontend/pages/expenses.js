import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchExpenses();
  }, []);

  const [filters, setFilters] = useState({
      from: '',
      to: '',
      min: '',
      max: '',
    });

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses', {
        params: {
          from: filters.from || undefined,
          to: filters.to || undefined,
          min: filters.min || undefined,
          max: filters.max || undefined,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-10">Loading expenses…</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-center mt-10 text-red-600">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Expenses</h2>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="From date"
          />

          <input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="To date"
          />

          <input
            type="number"
            placeholder="Min amount"
            value={filters.min}
            onChange={(e) =>
              setFilters({ ...filters, min: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Max amount"
            value={filters.max}
            onChange={(e) =>
              setFilters({ ...filters, max: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={fetchExpenses}
          className="mb-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>

        {/* Add Expense Button */}
        <Link href="/add-expense">
          <button className="mb-4 bg-black text-white px-4 py-2 rounded">
            + Add Expense
          </button>
        </Link>

        {/* Expense List */}
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="card flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {e.description || 'No description'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.expense_type} · {e.expense_date}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => router.push(`/edit-expense/${e.id}`)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <strong>₹{Number(e.amount).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
