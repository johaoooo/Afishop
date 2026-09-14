import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  UserCheck, 
  Search, 
  X, 
  ChevronRight, 
  ArrowRight, 
  GraduationCap, 
  Heart, 
  Package, 
  Sparkles, 
  Home,
  Store,
  BriefcaseBusiness,
  Users,
  MapPin
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_SLOGANS = [
  "Créations d'exception & Macramé d'art.",
  "Artisanat béninois 100% fait main.",
  "Inclusion sociale & Savoir-faire ancestral.",
  "Maroquinerie fine & Terroir d'Afrique.",
];

function NavSlogan() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % NAV_SLOGANS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[2.8em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -12, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 text-white/70 font-bold text-sm leading-snug"
        >
          {NAV_SLOGANS[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Header fusionné au hero (façon accueil) sur toutes les pages à hero
  // immersif : transparent tant qu'on est en haut, fond sombre dès qu'on
  // scrolle, qu'on ouvre le menu ou qu'on est sur une page sans hero.
  const HERO_PATHS = ['/', '/boutique', '/a-propos', '/formations', '/services', '/contact'];
  const hasHero = HERO_PATHS.includes(location.pathname);
  const transparent = hasHero && !scrolled && !open && !mobileMenuOpen;

  // Barre de progression du scroll (façon Wappe, en vert AFI)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermeture lors d'un changement de page
  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Focus champ recherche
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 120);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeMenus = () => {
    setOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="wappe-scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP : CardNav flottant (inspiré de port 3002)
          ═══════════════════════════════════════════════════════════ */}
      <div className="nav-desktop-only aka-nav-container">
        <nav className={`aka-card-nav ${open ? 'is-open' : ''} ${transparent ? 'is-transparent' : ''}`}>
          
          {/* Barre du haut fixe dans la pilule */}
          <div className="aka-nav-top">
            
            {/* Bouton Menu Hamburger à gauche */}
            <button 
              type="button" 
              className={`aka-nav-menu-btn ${open ? 'open' : ''}`}
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Ouvrir le menu de navigation"
            >
              <div className="aka-hamburger">
                <div className="aka-hline" />
                <div className="aka-hline" />
              </div>
              <span>{open ? 'Fermer' : 'Menu'}</span>
            </button>

            {/* Logo Central AFI */}
            <Link to="/" className="aka-nav-logo" onClick={closeMenus} aria-label="Accueil AFI Collection">
              <img 
                src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                alt="AFI Collection" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] brightness-110"
              />
            </Link>

            {/* Actions à droite : Recherche, Panier, Compte, WhatsApp */}
            <div className="aka-nav-right">
              
              {/* Recherche Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className="aka-nav-pill aka-nav-pill--icon-only"
                  title="Rechercher"
                  aria-label="Rechercher des créations"
                >
                  <Search size={16} className="aka-nav-pill-icon" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 mt-3 w-80 bg-[#0f1f14] rounded-2xl shadow-2xl border border-[#05a855]/40 p-3 z-50"
                    >
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher un sac, pagne..."
                          className="w-full bg-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white border border-white/20 focus:outline-none focus:border-[#05a855] transition-all placeholder-white/40"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05a855]" />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton Chariot / Panier */}
              <Link
                to="/panier"
                className="aka-nav-pill aka-nav-pill--icon-only"
                title={`Mon Panier (${count} articles)`}
                aria-label="Mon Panier"
              >
                <ShoppingCart size={16} className="aka-nav-pill-icon" />
                {count > 0 && (
                  <span className="aka-cart-badge">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>

              {/* Bouton Compte Client */}
              <div className="relative" ref={userDropdownRef}>
                {isAuthenticated && user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((v) => !v)}
                    className="aka-nav-pill aka-nav-pill--icon-only border-[#028444]/60"
                    title={`Connecté : ${user.name}`}
                  >
                    <UserCheck size={16} className="aka-nav-pill-icon text-[#05a855]" />
                  </button>
                ) : (
                  <Link
                    to="/connexion"
                    className="aka-nav-pill aka-nav-pill--icon-only"
                    title="Connexion / Mon compte"
                  >
                    <User size={16} className="aka-nav-pill-icon" />
                  </Link>
                )}

                {/* Dropdown utilisateur connecté */}
                <AnimatePresence>
                  {isAuthenticated && user && userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-[#0f1f14] rounded-2xl shadow-2xl border border-[#05a855]/40 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3.5 bg-[#028444] text-white">
                        <p className="text-[10px] text-white/80 uppercase font-black tracking-wider">Espace Membre</p>
                        <p className="text-sm font-black truncate mt-0.5">{user.name}</p>
                        <p className="text-[11px] text-white/80 truncate">{user.email}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          to="/mon-compte"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-[#05a855] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#05a855]" />
                          <span>Mes commandes</span>
                        </Link>

                        <Link
                          to="/mon-compte?favoris=true"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-[#05a855] transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Mes favoris</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#028444] hover:bg-[#05a855] transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Panneau Admin</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton WhatsApp CTA */}
              <a
                href="https://wa.me/2290196062287"
                target="_blank"
                rel="noreferrer"
                className="btn-raised btn-sm flex items-center gap-1.5"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Déploiement : Grille de 3 Cartes (GSAP / Framer Motion) */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="aka-nav-content overflow-hidden"
              >
                {/* Carte 1 : Identité & Slogans */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.35 }}
                  className="aka-nav-card aka-card-1"
                >
                  <div className="aka-card-label">AFI COLLECTION</div>
                  <div className="aka-card-brand">
                    <Link to="/" onClick={closeMenus} className="aka-card-logo-link">
                      <img 
                        src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                        alt="AFI Collection" 
                        className="h-16 w-auto object-contain mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] brightness-110"
                      />
                    </Link>
                    <NavSlogan />
                  </div>
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/50">
                    <span>Abomey-Calavi · Bénin</span>
                    <span className="text-[#05a855] font-bold">100% Fait main</span>
                  </div>
                </motion.div>

                {/* Carte 2 : Boutique & Savoir-faire */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="aka-nav-card aka-card-2"
                >
                  <div className="aka-card-label">Boutique & Savoir-Faire</div>
                  <div className="aka-card-links">
                    <Link to="/boutique" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Boutique</span>
                        <em className="aka-link-sub">Sacs macramé, sandales & pagnes</em>
                      </span>
                    </Link>

                    <Link to="/formations" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Formations CFP</span>
                        <em className="aka-link-sub">Ateliers Dorcas & savoir-faire</em>
                      </span>
                    </Link>

                    <Link to="/panier" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Mon Panier ({count})</span>
                        <em className="aka-link-sub">Total : {total.toLocaleString('fr-FR')} FCFA</em>
                      </span>
                    </Link>
                  </div>
                </motion.div>

                {/* Carte 3 : Univers & Contact */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  className="aka-nav-card aka-card-3"
                >
                  <div className="aka-card-label">Univers & Contact</div>
                  <div className="aka-card-links">
                    <Link to="/a-propos" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Qui Sommes-Nous</span>
                        <em className="aka-link-sub">Notre histoire & inclusion sociale</em>
                      </span>
                    </Link>

                    <Link to="/services" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Nos Services</span>
                        <em className="aka-link-sub">Sur-mesure, gros & événementiel</em>
                      </span>
                    </Link>

                    <Link to="/contact" onClick={closeMenus} className="aka-card-link group">
                      <ArrowRight className="aka-link-arrow" />
                      <span className="aka-card-link-textWrap">
                        <span className="aka-card-link-label">Contact & Atelier</span>
                        <em className="aka-link-sub">Écrivez-nous ou passez à l'atelier</em>
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE : Barre fixe 58px + Drawer animé
          ═══════════════════════════════════════════════════════════ */}
      <div className="nav-mobile-only">
        <header className={`sm-header ${transparent ? 'is-transparent' : ''}`}>
          {/* Bouton Hamburger Mobile */}
          <button
            type="button"
            className="sm-header-icon-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X size={20} className="text-[#05a855]" /> : <div className="aka-hamburger"><div className="aka-hline" /><div className="aka-hline" /></div>}
          </button>

          {/* Logo Mobile */}
          <Link to="/" onClick={closeMenus} className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
              alt="AFI Collection" 
              className="h-9 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] brightness-110"
            />
          </Link>

          {/* Actions Droite Mobile */}
          <div className="flex items-center gap-2">
            <Link
              to="/panier"
              onClick={closeMenus}
              className="sm-header-icon-btn"
              aria-label="Voir le panier"
            >
              <ShoppingCart size={17} className="text-[#05a855]" />
              {count > 0 && (
                <span className="sm-cart-badge">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? "/mon-compte" : "/connexion"}
              onClick={closeMenus}
              className="sm-header-icon-btn"
              aria-label="Mon compte"
            >
              {isAuthenticated ? <UserCheck size={17} className="text-[#05a855]" /> : <User size={17} />}
            </Link>
          </div>
        </header>

        {/* Drawer Mobile Flou & Animé */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[58px] bottom-0 bg-[#070b08]/98 backdrop-blur-2xl z-[9300] overflow-y-auto p-5 flex flex-col justify-between text-white"
            >
              <div className="space-y-6">
                {/* Recherche rapide */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher sacs, pagnes, sandales..."
                    className="w-full bg-white/10 border border-[#05a855]/40 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#05a855]"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05a855]" />
                </form>

                {/* Liens principaux */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#05a855] px-2">Navigation</p>
                  
                  <Link
                    to="/"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#028444] border-2 border-black shadow-[2px_2px_0px_#000] text-white flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <span className="font-bold text-sm text-white">Accueil</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/boutique"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#05a855]/15 border border-[#05a855]/40 text-[#05a855] flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white">Boutique & Créations</div>
                        <div className="text-[11px] text-white/55">Sacs macramé, sandales, pagnes</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/formations"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#05a855]/15 border border-[#05a855]/40 text-[#05a855] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white">Formations CFP</div>
                        <div className="text-[11px] text-white/55">Ateliers & transmission Dorcas</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/services"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#05a855]/15 border border-[#05a855]/40 text-[#05a855] flex items-center justify-center shrink-0">
                        <BriefcaseBusiness className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <span className="font-bold text-sm text-white">Nos Services</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/a-propos"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#05a855]/15 border border-[#05a855]/40 text-[#05a855] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <span className="font-bold text-sm text-white">Qui Sommes-Nous</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/contact"
                    onClick={closeMenus}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#05a855]/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#05a855]/15 border border-[#05a855]/40 text-[#05a855] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <span className="font-bold text-sm text-white">Contact & Ateliers</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>

              {/* Bas du Drawer : Boutons CTA */}
              <div className="pt-6 border-t border-white/15 space-y-3">
                <a
                  href="https://wa.me/2290196062287"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-raised btn-xl w-full flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>Commander sur WhatsApp</span>
                </a>

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenus();
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-rose-600 cursor-pointer"
                  >
                    Se déconnecter ({user?.name})
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-xs text-white/60 pt-1">
                    <Link to="/connexion" onClick={closeMenus} className="text-[#05a855] font-bold underline">
                      Connexion
                    </Link>
                    <span>·</span>
                    <Link to="/inscription" onClick={closeMenus} className="hover:text-white">
                      Créer un compte
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Espacement de tête : uniquement sur les pages sans hero immersif
          (les pages à hero démarrent sous le header transparent fusionné) */}
      {!hasHero && <div className="h-20 md:h-24" aria-hidden="true" />}
    </>
  );
}
