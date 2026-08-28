import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiShoppingCart,
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiPackage, 
  FiChevronDown,
  FiHeart,
  FiSearch,
  FiArrowRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/formations', label: 'Formations CFP' },
  { to: '/a-propos', label: 'Qui sommes-nous' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Détection du scroll pour effet de réduction / ombre
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Fermeture à la navigation
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Focus automatique du champ de recherche
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Barre de navigation principale */}
      <div 
        className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled 
            ? 'shadow-lg shadow-black/8 py-2 sm:py-2.5 border-b border-gray-200/70' 
            : 'py-2.5 sm:py-3.5 border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo de la marque agrandi */}
            <Link to="/" className="flex items-center group shrink-0">
              <img 
                src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                alt="AFI Collection" 
                className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Menu de navigation central (Desktop) - Liens verts et police agrandie */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/25' 
                        : 'text-[#1a6b3c] hover:bg-[#1a6b3c]/10 hover:text-[#14532d]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions à droite (Recherche, Panier, Profil & Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Bouton de recherche */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-label="Rechercher des créations"
                  className="p-2.5 rounded-full text-[#1a6b3c] hover:text-[#14532d] hover:bg-[#1a6b3c]/10 transition-all cursor-pointer"
                >
                  <FiSearch className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50"
                    >
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher un sac, pagne..."
                          className="w-full bg-gray-50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-800 border border-gray-200 focus:outline-none focus:border-[#1a6b3c] focus:bg-white transition-all"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton Panier avec badge animé */}
              <Link
                to="/panier"
                aria-label="Voir le panier"
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-emerald-50/70 hover:bg-[#1a6b3c]/15 text-[#1a6b3c] transition-all border border-[#1a6b3c]/20 group"
              >
                <div className="relative">
                  <FiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform text-[#1a6b3c]" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-md animate-bounce">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                {count > 0 && (
                  <span className="hidden md:inline text-xs font-bold text-[#1a6b3c]">
                    {total.toLocaleString('fr-FR')} F
                  </span>
                )}
              </Link>

              {/* Espace Compte / Profil (Desktop) */}
              <div className="hidden md:block relative" ref={userMenuRef}>
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-emerald-50/60 transition-all border border-[#1a6b3c]/20 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs font-bold text-[#1a6b3c] max-w-[100px] truncate">
                        {user.name?.split(' ')[0] || 'Compte'}
                      </span>
                      <FiChevronDown className={`w-3.5 h-3.5 text-[#1a6b3c] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3.5 bg-gradient-to-r from-[#1a6b3c] to-[#14532d] text-white">
                            <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Espace Client</p>
                            <p className="text-sm font-bold truncate mt-0.5">{user.name}</p>
                            <p className="text-[11px] text-white/70 truncate">{user.email}</p>
                          </div>

                          <div className="p-2 space-y-1">
                            <Link
                              to="/mon-compte"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#1a6b3c] transition-colors"
                            >
                              <FiPackage className="w-4 h-4 text-[#1a6b3c]" />
                              <span>Mes commandes</span>
                            </Link>

                            <Link
                              to="/mon-compte?favoris=true"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#1a6b3c] transition-colors"
                            >
                              <FiHeart className="w-4 h-4 text-rose-500" />
                              <span>Mes favoris</span>
                            </Link>

                            {user.role === 'admin' && (
                              <Link
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                              >
                                <span className="w-4 h-4 text-amber-600 font-bold">★</span>
                                <span>Tableau de bord Admin</span>
                              </Link>
                            )}
                          </div>

                          <div className="p-2 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <FiLogOut className="w-4 h-4" />
                              <span>Déconnexion</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/connexion"
                      className="text-sm font-bold text-[#1a6b3c] hover:text-[#14532d] px-3.5 py-2 rounded-xl hover:bg-[#1a6b3c]/10 transition-all"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      className="text-sm font-bold bg-[#1a6b3c] hover:bg-[#14532d] text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-[#1a6b3c]/25 hover:shadow-lg hover:scale-105"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>

              {/* Bouton Toggle Mobile Drawer */}
              <button
                className="lg:hidden p-2.5 rounded-xl text-[#1a6b3c] hover:text-[#14532d] hover:bg-[#1a6b3c]/10 transition-all cursor-pointer"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Drawer Mobile moderne plein écran / slide-in */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay d'arrière-plan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Panneau latéral mobile */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Entête du drawer */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                  <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
                    <img 
                      src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
                      alt="AFI Collection" 
                      className="h-12 w-auto object-contain"
                    />
                  </Link>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Recherche mobile */}
                <div className="p-4 border-b border-gray-100">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher créations..."
                      className="w-full bg-gray-50 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 border border-gray-200 focus:outline-none focus:border-[#1a6b3c]"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </form>
                </div>

                {/* Liens de navigation mobiles (Police agrandie et en vert) */}
                <div className="p-4 space-y-1.5">
                  <p className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-400">Navigation</p>
                  
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all ${
                          isActive 
                            ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20' 
                            : 'text-[#1a6b3c] hover:bg-[#1a6b3c]/10'
                        }`
                      }
                    >
                      <span>{link.label}</span>
                      <FiArrowRight className="w-4 h-4 opacity-70" />
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Pied du drawer mobile */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-2">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200/80">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/mon-compte"
                        onClick={() => setMenuOpen(false)}
                        className="text-center py-2 px-3 text-xs font-bold bg-white text-[#1a6b3c] rounded-xl border border-gray-200 hover:bg-emerald-50"
                      >
                        Commandes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="py-2 px-3 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 cursor-pointer"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/connexion"
                      onClick={() => setMenuOpen(false)}
                      className="text-center py-2.5 px-3 text-xs font-bold text-[#1a6b3c] bg-white border border-[#1a6b3c] rounded-xl hover:bg-emerald-50"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      onClick={() => setMenuOpen(false)}
                      className="text-center py-2.5 px-3 text-xs font-bold text-white bg-[#1a6b3c] rounded-xl hover:bg-[#14532d] shadow-md shadow-[#1a6b3c]/20"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}

                <a
                  href="https://wa.me/2290197222880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <span>Commander sur WhatsApp</span>
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
