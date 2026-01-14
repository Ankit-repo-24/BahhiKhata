import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthPage =
    router.pathname === '/login' || router.pathname === '/register';

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Bahhi Khata
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5 text-sm">
          {!isLoggedIn && !isAuthPage && (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-600">
                Register
              </Link>
            </>
          )}

          {isAuthPage && (
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link href="/expenses" className="hover:text-blue-600">
                Expenses
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
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
