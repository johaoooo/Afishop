import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      setIsSent(true);
      toast.success('Email envoyé ! Vérifiez votre boîte de réception.');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] relative flex-col bg-gray-950 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783254004/tactt_eoh8nc.jpg"
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
                AIDE
              </span>
            </div>
            <h2 className="text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
              Mot de passe<br />
              <span className="text-[#4ade80]">oublié</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Pas d'inquiétude, nous vous envoyons un lien pour réinitialiser votre mot de passe.
            </p>
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
            to="/connexion"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a6b3c] text-sm font-medium transition-colors mb-8 lg:hidden group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à la connexion
          </Link>

          {isSent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-8 h-8 text-[#1a6b3c]" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
                Email envoyé !
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Si un compte existe avec cette adresse, vous recevrez un email avec les instructions 
                pour réinitialiser votre mot de passe.
              </p>
              <Link
                to="/connexion"
                className="text-[#1a6b3c] font-bold hover:underline text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-flex items-center text-[#1a6b3c] text-xs font-bold tracking-widest uppercase mb-3">
                  RÉINITIALISATION
                </span>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  Mot de passe<br />oublié
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Saisissez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a6b3c] w-4 h-4 transition-colors" />
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#1a6b3c]/20"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>

              <p className="text-center mt-6">
                <Link to="/connexion" className="text-[#1a6b3c] font-semibold hover:underline text-sm">
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
