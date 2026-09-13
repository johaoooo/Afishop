import SEO from '../components/SEO';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[#f3f6f3] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-black text-[#0f1f14] mb-2">Lien invalide</h1>
          <p className="text-[#0f1f14]/60 text-sm mb-6">Ce lien de réinitialisation est invalide ou a expiré.</p>
          <Link to="/mot-passe-oublie" className="text-[#028444] font-semibold hover:underline text-sm">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('8 caractères minimum'); return; }
    if (password !== confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setIsDone(true);
      toast.success('Mot de passe réinitialisé !');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen bg-[#f3f6f3] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#4ade80]/10 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-8 h-8 text-[#028444]" />
          </div>
          <h1 className="text-2xl font-black text-[#0f1f14] mb-2">Mot de passe modifié</h1>
          <p className="text-[#0f1f14]/60 text-sm mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <Link to="/connexion" className="btn-raised btn-sm">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex items-center justify-center px-6">
      <SEO title="Réinitialisation mot de passe" description="Réinitialisez votre mot de passe AFI Collection." />
      <div className="w-full max-w-sm">
        <Link to="/connexion" className="inline-flex items-center gap-2 text-[#0f1f14]/50 hover:text-[#028444] text-sm font-medium transition-colors mb-8 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à la connexion
        </Link>

        <div className="mb-8">
          <span className="inline-flex items-center text-[#028444] text-xs font-bold tracking-widest uppercase mb-3">
            NOUVEAU MOT DE PASSE
          </span>
          <h1 className="text-3xl font-black text-[#0f1f14] tracking-tight leading-tight">
            Choisissez un<br />nouveau mot de passe
          </h1>
          <p className="text-sm text-[#0f1f14]/60 mt-2">Pour {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-2">Nouveau mot de passe</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0f1f14]/50 group-focus-within:text-[#028444] w-4 h-4 transition-colors" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 bg-white border border-[#0f1f14]/15 rounded-xl text-sm text-[#0f1f14] placeholder-[#0f1f14]/40 focus:outline-none focus:border-[#4ade80]/40 focus:ring-2 focus:ring-[#4ade80]/20 transition-all" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f1f14]/50 hover:text-[#0f1f14]/60">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-2">Confirmer le mot de passe</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0f1f14]/50 group-focus-within:text-[#028444] w-4 h-4 transition-colors" />
              <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#0f1f14]/15 rounded-xl text-sm text-[#0f1f14] placeholder-[#0f1f14]/40 focus:outline-none focus:border-[#4ade80]/40 focus:ring-2 focus:ring-[#4ade80]/20 transition-all" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="btn-raised w-full disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
