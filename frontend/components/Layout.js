import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex justify-center py-10">
        <div className="w-full max-w-7xl px-4 animate-fade-in">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
