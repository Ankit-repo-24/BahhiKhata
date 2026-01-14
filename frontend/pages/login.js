import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/api';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      router.push('/expenses');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="card w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Login to continue tracking expenses
          </p>

          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="text-xs text-blue-600 self-start"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </button>

            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </form>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{' '}
            <Link href="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
