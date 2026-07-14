import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart,
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiPackage, 
  FiChevronDown,
  FiHeart
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/formations', label: 'Formations' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-black/5' : 'border-b border-gray-100/50'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png" 
              alt="AFI Collection" 
              className="h-10 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#1a6b3c]/10 text-[#1a6b3c]' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#1a6b3c]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/panier"
              aria-label="Panier"
              className="relative p-2.5 rounded-full text-gray-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/5 transition-all duration-300 group"
            >
              <FiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1a6b3c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-[#1a6b3c]/25">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <div className="hidden md:block relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-600 hidden xl:block">
                      {user.name?.split(' ')[0] || 'Utilisateur'}
                    </span>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/mon-compte"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#1a6b3c]/5 hover:text-[#1a6b3c] transition-colors"
                        >
                          <FiPackage className="w-4 h-4" />
                          Mes commandes
                        </Link>
                        <Link
                          to="/mon-compte?favoris=true"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#1a6b3c]/5 hover:text-[#1a6b3c] transition-colors"
                        >
                          <FiHeart className="w-4 h-4" />
                          Mes favoris
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/connexion"
                    className="text-sm font-semibold text-gray-500 hover:text-[#1a6b3c] px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="text-sm font-semibold bg-[#1a6b3c] hover:bg-[#14532d] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-[#1a6b3c]/20 hover:shadow-[#1a6b3c]/40 hover:scale-105"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2.5 rounded-full text-gray-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/5 transition-all duration-300"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="border-t border-gray-100/50 pt-4 pb-6 space-y-1 bg-white/50">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#1a6b3c]/10 text-[#1a6b3c]' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#1a6b3c]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="border-t border-gray-100/50 pt-4 mt-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white font-bold text-base">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/mon-compte"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-[#1a6b3c]/5 hover:text-[#1a6b3c] transition-colors"
                  >
                    <FiPackage className="w-5 h-5" />
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link
                    to="/connexion"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-semibold text-[#1a6b3c] border border-[#1a6b3c] py-3 rounded-lg hover:bg-[#1a6b3c]/5 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-semibold bg-[#1a6b3c] text-white py-3 rounded-lg hover:bg-[#14532d] transition-colors shadow-lg shadow-[#1a6b3c]/20"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
