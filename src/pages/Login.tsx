import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowLeft, 
  FiCheckCircle 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import toast from 'react-hot-toast';

const features = [
  { icon: FiCheckCircle, text: 'Authentification sécurisée par JWT' },
  { icon: FiCheckCircle, text: 'Suivi de livraison en 48h sur Cotonou' },
  { icon: FiCheckCircle, text: 'Paiements mobiles & cartes sécurisés' },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const redirect = new URLSearchParams(location.search).get('redirect') || '/mon-compte';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await login(email, password);
      toast.success('Connexion réussie ! Bienvenue 👋');

      if (currentUser?.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] relative flex-col bg-gray-950 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1780563931/slide01_gwdcug.png"
          alt="Artisanat béninois"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-950/60 to-[#1a6b3c]/20" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors group w-fit"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Link>

          <div>
            <div className="mb-6">
              <span className="text-[#4ade80] text-xs font-bold tracking-widest uppercase">
                ESPACE MEMBRES
              </span>
            </div>
            
            <h2 className="text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
              AFI<br />
              <span className="text-[#4ade80]">Collection</span>
            </h2>
            
            <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
              Retrouvez vos commandes, votre traçabilité produit et vos artisans favoris.
            </p>
            
            <ul className="space-y-4">
              {features.map((f, index) => {
                const Icon = f.icon;
                return (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 text-sm text-white/70 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" aria-hidden="true" />
                    {f.text}
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-white/25 text-xs">© {new Date().getFullYear()} AFI Collection · Cotonou, Bénin</p>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center bg-[#faf8f5] px-8 py-12 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#1a6b3c]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#4ade80]" />
        </div>

        <div className="w-full max-w-sm relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a6b3c] text-sm font-medium transition-colors mb-8 lg:hidden group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à l'accueil
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center text-[#1a6b3c] text-xs font-bold tracking-widest uppercase mb-3">
              CONNEXION
            </span>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Accéder à<br />votre compte
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Pas encore membre ?{' '}
              <Link to="/inscription" className="text-[#1a6b3c] font-bold hover:underline transition">
                Créer un compte
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a6b3c] w-4 h-4 transition-colors" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Mot de passe
                </label>
                <Link
                  to="/mot-passe-oublie"
                  className="text-xs text-[#1a6b3c] font-semibold hover:underline transition"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a6b3c] w-4 h-4 transition-colors" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" aria-hidden="true" /> : <FiEye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm mt-2 shadow-lg shadow-[#1a6b3c]/20 hover:shadow-xl hover:shadow-[#1a6b3c]/30"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            En vous connectant, vous acceptez nos{' '}
            <Link to="/conditions" className="text-[#1a6b3c] hover:underline">conditions</Link>
            {' '}et notre{' '}
            <Link to="/confidentialite" className="text-[#1a6b3c] hover:underline">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
