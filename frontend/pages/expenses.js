import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to load expenses');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/expenses', formData);
      setSuccess('Expense added successfully!');
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        description: ''
      });
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Total Expenses: ₹{totalAmount.toFixed(2)}
        </h2>

        <div className="form-container">
          <h2>Add New Expense</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button type="submit" className="btn">Add Expense</button>
          </form>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Your Expenses</h2>
          {expenses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No expenses yet. Add your first expense above!</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="expense-card">
                <div className="expense-info">
                  <h3>{expense.title}</h3>
                  <p>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                  {expense.description && <p>{expense.description}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(expense._id)}
                    style={{ width: 'auto', padding: '8px 16px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
```

---

## 🗄️ MONGODB ATLAS SETUP

### Steps to Get MongoDB Atlas Connection String:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a FREE account
3. Create a new cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `bahhikhata`
8. Paste into `backend/.env` as `MONGO_URI`

**Example:**
```
mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/bahhikhata?retryWrites=true&w=majority