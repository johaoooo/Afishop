import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface GoogleAuthButtonProps {
  redirect?: string;
}

export default function GoogleAuthButton({ redirect }: GoogleAuthButtonProps) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      toast.error('Aucun jeton de connexion reçu de Google');
      return;
    }

    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      toast.success(`Bienvenue ${user.name || ''} ! 👋`);

      if (user.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect || '/mon-compte');
      }
    } catch (err: any) {
      toast.error(err.message || 'Échec de la connexion avec Google');
    }
  };

  const handleError = () => {
    toast.error('Impossible de se connecter avec Google. Veuillez réessayer.');
  };

  if (!clientId || clientId.trim() === '' || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    return (
      <button
        type="button"
        onClick={() => {
          toast.error("Pour activer Google Sign-In, renseignez votre VITE_GOOGLE_CLIENT_ID dans le fichier .env", {
            duration: 6000,
          });
        }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold rounded-xl border border-stone-200 shadow-sm transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Continuer avec Google</span>
      </button>
    );
  }

  return (
    <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
