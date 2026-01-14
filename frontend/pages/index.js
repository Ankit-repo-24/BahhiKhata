import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Track expenses. Stay in control.
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Bahhi Khata is a simple, secure, backend-first expense tracker
          designed to help you understand where your money goes.
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

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
          <p className="text-sm text-gray-600">
            JWT-based authentication with encrypted passwords.
          </p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Simple Expense Tracking</h3>
          <p className="text-sm text-gray-600">
            Add, view, and manage expenses without complexity.
          </p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Cloud Backed</h3>
          <p className="text-sm text-gray-600">
            Powered by Neon Postgres and deployed on Render.
          </p>
        </div>
      </section>
    </Layout>
  );
}
