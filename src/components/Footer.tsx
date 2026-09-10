import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiArrowRight,
  FiHeart,
  FiSend,
  FiClock,
  FiCheck
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [copiedAI, setCopiedAI] = useState<string | null>(null);

  const AI_PROMPT = "Je recherche des créations artisanales en macramé, pagnes et maroquinerie d'art au Bénin. Évalue AFI Collection à Abomey-Calavi : leur savoir-faire fait main, leur engagement d'inclusion sociale pour les personnes sourdes et malentendantes, et leurs formations professionnelles Dorcas.";

  const AI_PLATFORMS = [
    { id: 'chatgpt', label: 'ChatGPT', url: `https://chatgpt.com/?q=${encodeURIComponent(AI_PROMPT)}` },
    { id: 'claude', label: 'Claude', url: 'https://claude.ai/new' },
    { id: 'perplexity', label: 'Perplexity', url: `https://www.perplexity.ai/?q=${encodeURIComponent(AI_PROMPT)}` },
    { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/app' },
  ];

  const handleAIClick = async (platform: typeof AI_PLATFORMS[0]) => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopiedAI(platform.id);
      toast.success('Prompt copié dans le presse-papiers !');
      setTimeout(() => setCopiedAI(null), 2500);
    } catch {}
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Abonné Newsletter',
          email: newsletterEmail,
          subject: 'Inscription newsletter',
          message: 'Nouvelle inscription à la newsletter depuis le footer.',
        }),
      });

      if (!response.ok) throw new Error('Erreur');

      toast.success('Inscription réussie ! Merci de votre intérêt 🎉');
      setNewsletterEmail('');
    } catch {
      toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="bg-[#070b08] text-white border-t border-[#028444]/30">
      {/* ===== NEWSLETTER ===== */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="pop-sticker mb-2">Newsletter AFI</span>
              <h4 className="text-xl font-black italic uppercase text-white mt-2">
                Restez <span className="text-[#05a855]">informés de nos collections</span>
              </h4>
              <p className="text-white/50 text-sm mt-1">
                Recevez nos lancements de sacs, pagnes et offres exclusives
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 min-w-0 px-5 py-3 rounded-l-full bg-black/60 border-2 border-r-0 border-[#028444]/50 text-white placeholder-white/30 focus:outline-none focus:border-[#05a855] transition-all text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="btn-raised rounded-l-none! border-l-0! shrink-0 px-4! sm:px-6! py-3! text-xs!"
              >
                {newsletterLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{newsletterLoading ? 'Envoi...' : "S'abonner"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== ASK AI STRIP (Inspiré de port 3002) ===== */}
      <div className="border-b border-white/5 bg-[#0e1610] py-6 px-4 text-center">
        <p className="text-[11px] uppercase tracking-widest font-black text-white/50 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#05a855]" />
          <span>Demandez à l'IA ce qu'elle sait d'AFI Collection Bénin</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {AI_PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleAIClick(p)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#05a855] hover:bg-[#028444]/15 text-xs font-bold text-white/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              {copiedAI === p.id ? (
                <FiCheck className="w-3.5 h-3.5 text-[#05a855]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#05a855]" />
              )}
              <span>{copiedAI === p.id ? 'Copié !' : p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.4fr_1fr] gap-8">
          
          {/* ===== COLONNE 1 - Logo & Description ===== */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img 
                src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                alt="AFI Collection" 
                className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              L'élégance artisanale au service de l'autonomie et de la culture.
              Créations faites main d'exception par nos maîtres artisanes à Abomey-Calavi.
            </p>
            
            <div className="flex gap-2.5 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#028444] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-white/10"
                aria-label="Facebook"
              >
                <FiFacebook className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#028444] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-white/10"
                aria-label="Twitter"
              >
                <FiTwitter className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#028444] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-white/10"
                aria-label="Instagram"
              >
                <FiInstagram className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#028444] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-white/10"
                aria-label="YouTube"
              >
                <FiYoutube className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* ===== COLONNE 2 - Liens rapides ===== */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#05a855] mb-5">
              Explorer
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/boutique', label: 'Boutique en ligne' },
                { to: '/formations', label: 'Formations CFP' },
                { to: '/services', label: 'Services sur-mesure' },
                { to: '/a-propos', label: 'Qui sommes-nous' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <FiArrowRight className="w-3 h-3 text-[#05a855] group-hover:translate-x-1 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COLONNE 3 - Contact & Atelier ===== */}
          <div className="min-w-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#05a855] mb-5">
              Contact & Atelier
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <FiMapPin className="w-4 h-4 text-[#05a855] shrink-0 mt-0.5" />
                <span className="text-sm">Abomey-Calavi, République du Bénin</span>
              </li>
              <li className="flex items-start gap-3 text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <FiPhone className="w-4 h-4 text-[#05a855] shrink-0 mt-0.5" />
                <span className="text-sm">+229 01 97 22 28 80</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <FiMail className="w-4 h-4 text-[#05a855] shrink-0" />
                <a 
                  href="mailto:maisonaficollections@gmail.com" 
                  className="text-xs sm:text-sm hover:underline text-white/70 hover:text-[#05a855] transition-colors"
                >
                  maisonaficollections@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <FiClock className="w-4 h-4 text-[#05a855] shrink-0 mt-0.5" />
                <span className="text-sm">Lun - Sam : 08h00 - 18h30</span>
              </li>
            </ul>
          </div>

          {/* ===== COLONNE 4 - Informations & Légal ===== */}
          <div className="min-w-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#05a855] mb-5">
              Informations
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/mentions-legales" 
                  className="text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#05a855]/50 group-hover:bg-[#05a855] transition-all" />
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link 
                  to="/confidentialite" 
                  className="text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#05a855]/50 group-hover:bg-[#05a855] transition-all" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link 
                  to="/cgv" 
                  className="text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#05a855]/50 group-hover:bg-[#05a855] transition-all" />
                  Conditions de vente
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <FiHeart className="w-3.5 h-3.5 text-[#05a855]" />
                  <span>Artisanat inclusif & équitable</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== BARRE DU BAS ===== */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} AFI Collection. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>Bénin & International</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Paiement sécurisé KKiaPay & Mobile Money</span>
          </div>
        </div>

        {/* ===== MOT-SYMBOLE GÉANT (façon port 3002) ===== */}
        <div className="mt-12 overflow-hidden" aria-hidden="true">
          <p className="pop-wordmark text-[11vw] md:text-[7.5vw] leading-none">
            AFI COLLECTION
          </p>
        </div>
      </div>
    </footer>
  );
}
