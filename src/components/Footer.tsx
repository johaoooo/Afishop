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
  FiClock
} from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d2818] text-white">
      {/* ===== NEWSLETTER ===== */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold text-white">
                Restez <span className="text-[#4ade80]">informés</span>
              </h4>
              <p className="text-white/40 text-sm mt-1">
                Recevez nos actualités et offres exclusives
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 min-w-0 px-5 py-3 rounded-l-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-transparent transition-all"
              />
              <button className="shrink-0 px-4 sm:px-6 py-3 bg-[#1a6b3c] hover:bg-[#14532d] rounded-r-xl transition-colors duration-300 flex items-center gap-2 font-semibold text-sm">
                <FiSend className="w-4 h-4" />
                <span className="hidden sm:inline">S'abonner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* ===== COLONNE 1 - Logo & Description ===== */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img 
                src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                alt="AFI Collection" 
                className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              L'élégance artisanale au service de la tradition et de l'innovation.
              Des créations uniques faites main par des artisans talentueux.
            </p>
            
            <div className="flex gap-3 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1a6b3c] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <FiFacebook className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1a6b3c] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <FiTwitter className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1a6b3c] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <FiInstagram className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1a6b3c] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="YouTube"
              >
                <FiYoutube className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* ===== COLONNE 2 - Liens rapides ===== */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Liens rapides
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/boutique', label: 'Boutique' },
                { to: '/formations', label: 'Formations' },
                { to: '/services', label: 'Services' },
                { to: '/a-propos', label: 'À propos' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/40 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <FiArrowRight className="w-3 h-3 text-[#4ade80]/30 group-hover:text-[#4ade80] group-hover:translate-x-1 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== COLONNE 3 - Contact ===== */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/40 hover:text-white/70 transition-colors duration-300 group">
                <FiMapPin className="w-4 h-4 text-[#4ade80]/50 group-hover:text-[#4ade80] shrink-0 mt-0.5" />
                <span className="text-sm">Cotonou, Bénin</span>
              </li>
              <li className="flex items-start gap-3 text-white/40 hover:text-white/70 transition-colors duration-300 group">
                <FiPhone className="w-4 h-4 text-[#4ade80]/50 group-hover:text-[#4ade80] shrink-0 mt-0.5" />
                <span className="text-sm">+229 97 00 00 00</span>
              </li>
              <li className="flex items-start gap-3 text-white/40 hover:text-white/70 transition-colors duration-300 group">
                <FiMail className="w-4 h-4 text-[#4ade80]/50 group-hover:text-[#4ade80] shrink-0 mt-0.5" />
                <span className="text-sm">contact@aficollection.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/40 hover:text-white/70 transition-colors duration-300 group">
                <FiClock className="w-4 h-4 text-[#4ade80]/50 group-hover:text-[#4ade80] shrink-0 mt-0.5" />
                <span className="text-sm">Lun - Sam: 8h - 18h</span>
              </li>
            </ul>
          </div>

          {/* ===== COLONNE 4 - Informations ===== */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Informations
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/mentions-legales" 
                  className="text-white/40 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#4ade80]/30 group-hover:bg-[#4ade80] transition-all" />
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link 
                  to="/confidentialite" 
                  className="text-white/40 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#4ade80]/30 group-hover:bg-[#4ade80] transition-all" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link 
                  to="/cgv" 
                  className="text-white/40 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#4ade80]/30 group-hover:bg-[#4ade80] transition-all" />
                  Conditions générales
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-white/20 text-xs">
                  <FiHeart className="w-3 h-3 text-[#4ade80]/30" />
                  <span>Fait avec passion au Bénin</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== BARRE DU BAS ===== */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {currentYear} AFI Collection. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-white/20 text-xs">
            <span>Artisanat béninois</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Made with <FiHeart className="w-3 h-3 inline text-[#4ade80]/30" /> in Cotonou</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
