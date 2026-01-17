import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isLoggedIn =
    typeof window !== 'undefined' &&
    !!localStorage.getItem('token');

  const handleLogout = () => {
    if (confirm('Do you want to logout?')) {
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80 transition"
        >
          Bahhi Khata
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                href="/expenses"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Expenses
              </Link>

              <Link
                href="/stats"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Stats
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
