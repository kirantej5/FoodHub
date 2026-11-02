import { Link } from 'react-router-dom';
import { Home, Utensils, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Glow & 404 visual */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 max-w-[200px] mx-auto bg-orange-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 drop-shadow-sm select-none">
            404
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-4">
          <Utensils size={16} /> Page Not Found
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Lost in the Menu?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          The dish or page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            to="/foods"
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <Search size={18} />
            Browse Foods
          </Link>
        </div>
      </div>
    </div>
  );
}
