import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[#1a6b3c]/10 mb-4 select-none">404</div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Page introuvable</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-semibold px-6 py-3 rounded-full transition text-sm"
          >
            <FiHome className="w-4 h-4" />
            Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-600 font-semibold px-6 py-3 rounded-full transition text-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
