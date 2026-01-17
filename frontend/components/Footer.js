export default function Footer() {
  return (
    <footer className="border-t bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
        <span>
          © {new Date().getFullYear()} Bahhi Khata
        </span>

        <span className="text-gray-400">
          Backend-first expense tracker · Built with Node & Postgres
        </span>
      </div>
    </footer>
  );
}
