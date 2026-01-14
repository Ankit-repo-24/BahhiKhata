import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? '/expenses' : '/login');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting…</p>
    </div>
  );
}
