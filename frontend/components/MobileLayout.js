import { useRouter } from 'next/router';
import TopAppBar from './TopAppBar';
import BottomNavigation from './BottomNavigation';

export default function MobileLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top App Bar */}
      <TopAppBar />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 pt-4 px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => router.push('/add-expense')}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}