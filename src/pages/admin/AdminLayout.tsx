import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, type FC } from 'react';
import {
  FiGrid, FiBox, FiShoppingBag, FiBookOpen, FiMail, FiLogOut, FiExternalLink, FiUsers,
  FiMenu, FiX, FiShield, FiPlus, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: FC<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { to: '/admin', label: "Vue d'ensemble", icon: FiGrid, exact: true },
  { to: '/admin/produits', label: 'Produits', icon: FiBox },
  { to: '/admin/commandes', label: 'Commandes', icon: FiShoppingBag },
  { to: '/admin/formations', label: 'Formations', icon: FiBookOpen },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: FiUsers },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentPage = navItems.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  ) || navItems[0];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a1e12] via-[#0d2818] to-[#08180e] text-white select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white shadow-lg shadow-[#1a6b3c]/30 group-hover:scale-105 transition-transform">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-wide text-white">AFI ADMIN</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-emerald-400/80 font-medium">Panneau de gestion</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] uppercase font-bold tracking-widest text-white/40">
          Menu principal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#1a6b3c] to-[#25854d] text-white shadow-md shadow-[#1a6b3c]/30'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-emerald-300' : 'text-white/50 group-hover:text-white'
              }`} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <FiChevronRight className="w-4 h-4 text-emerald-300 opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Action & User Footer */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/10"
        >
          <span className="flex items-center gap-2">
            <FiExternalLink className="w-4 h-4 text-emerald-400" />
            Voir le site public
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            Live
          </span>
        </a>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-[#1a6b3c] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate max-w-[120px]">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <FiLogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f6f4] flex text-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-2xl z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[80vw] h-full z-10"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#1a6b3c] hover:bg-gray-100 rounded-xl transition"
              aria-label="Ouvrir le menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>{currentPage.label}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-[#1a6b3c] px-3 py-1.5 rounded-full border border-emerald-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1a6b3c] animate-pulse" />
              <span>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <Link
              to="/admin/produits/nouveau"
              className="flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-[#1a6b3c]/20 hover:scale-102 active:scale-98"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau Produit</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Admin Page View */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

