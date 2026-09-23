import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiMail, FiArrowRight, FiRefreshCw, FiHome } from 'react-icons/fi';
import { authApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState(emailParam);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Aucun jeton de vérification fourni dans le lien.');
      return;
    }

    const verify = async () => {
      try {
        const res = await authApi.verifyEmail({ token, email: emailParam });
        if (res.token) {
          localStorage.setItem('afi_token', res.token);
          if (res.user) {
            localStorage.setItem('afi_user', JSON.stringify(res.user));
          }
          await refreshUser();
        }
        setStatus('success');
        setMessage(res.message || 'Votre compte a été activé avec succès !');
        toast.success('Adresse e-mail vérifiée ! 🎉');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Ce lien d’activation est invalide ou a expiré.');
      }
    };

    verify();
  }, [token, emailParam]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      toast.error('Veuillez renseigner votre adresse e-mail');
      return;
    }

    setIsResending(true);
    try {
      const res = await authApi.resendVerification(resendEmail.trim());
      toast.success(res.message || 'Nouvel e-mail envoyé !');
      setMessage('Un nouvel e-mail d’activation vient de vous être envoyé. Consultez votre boîte de réception.');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du renvoi de l’e-mail');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SEO 
        title="Vérification de votre compte | AFI Collection" 
        description="Activation et vérification sécurisée de votre compte client AFI Collection." 
      />

      <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo / Marque */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-wider text-stone-900 uppercase">
                AFI <span className="text-[#1a6b3c]">Collection</span>
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-stone-500 mt-1">
                L'Élégance Artisanale Africaine
              </span>
            </Link>
          </div>

          <div className="bg-white py-10 px-6 shadow-xl shadow-stone-200/50 rounded-2xl sm:px-10 border border-stone-100 text-center">
            {status === 'loading' && (
              <div className="py-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1a6b3c] flex items-center justify-center mb-6 animate-pulse">
                  <FiRefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Vérification en cours...
                </h3>
                <p className="text-sm text-stone-600">
                  Validation de votre lien d'activation sécurisé en cours.
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <FiCheckCircle className="w-9 h-9" />
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3">
                  Compte Activé !
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed mb-8">
                  {message} Vous pouvez maintenant accéder à l'ensemble de nos créations artisanales et profiter de votre espace personnel.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/mon-compte')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-[#1a6b3c] hover:bg-[#14532d] shadow-lg shadow-emerald-900/10 transition-all duration-200"
                  >
                    <span>Accéder à mon espace client</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/boutique"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Découvrir la boutique</span>
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-sm">
                  <FiAlertCircle className="w-9 h-9" />
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  Lien non valide
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {message}
                </p>

                {/* Formulaire de renvoi */}
                <form onSubmit={handleResend} className="space-y-4 text-left border-t border-stone-100 pt-6">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Demander un nouvel e-mail d'activation :
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-50 transition-colors"
                  >
                    {isResending ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <FiMail className="w-4 h-4" />
                        <span>Renvoyer l'e-mail d'activation</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-stone-100 text-center">
                  <Link
                    to="/connexion"
                    className="text-sm font-medium text-[#1a6b3c] hover:underline"
                  >
                    ← Retourner à la page de connexion
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
