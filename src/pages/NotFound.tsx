import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center px-6">
      <SEO title="Page introuvable" description="La page que vous cherchez n'existe pas ou a été déplacée." />
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[#4ade80]/10 mb-4 select-none">404</div>
        <h1 className="text-3xl font-black text-white/85 mb-2">Page introuvable</h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="btn-raised"
          >
            <FiHome className="w-4 h-4" />
            Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-white/20 hover:border-gray-400 text-white/60 font-semibold px-6 py-3 rounded-full transition text-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
