import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Expenses</h2>
            <Link href="/add-expense" className="btn btn-primary">
              + Add Expense
            </Link>
          </div>

          {loading && <p>Loading…</p>}
          {error && <p className="text-red-600">{error}</p>}

          <ul className="space-y-4">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="card flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">
                    {e.description || 'No description'}
                  </p>

                  <p className="text-sm text-gray-500">
                    {e.expense_type} ·{' '}
                    {new Date(e.expense_date).toLocaleDateString()}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-3 flex gap-4 text-sm">
                    <button
                      onClick={() => router.push(`/edit-expense/${e.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <strong className="text-lg">
                  ₹{Number(e.amount).toFixed(2)}
                </strong>
              </li>
            ))}
          </ul>

        </div>
      </Layout>
    </ProtectedRoute>
  );
}
