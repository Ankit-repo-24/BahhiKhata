export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 flex justify-between">
        <span>© {new Date().getFullYear()} Bahhi Khata</span>
        <span>Backend-first expense tracker</span>
      </div>
    </footer>
  );
}

