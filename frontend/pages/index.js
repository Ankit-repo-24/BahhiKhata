import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="py-20 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Track expenses. Stay in control.
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Bahhi Khata is a simple, secure, backend-first expense tracker.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </section>
    </Layout>
  );
}
