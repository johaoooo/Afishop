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
    <div className="flex flex-col h-full bg-white text-[#0f1f14] select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-[#0f1f14]/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#028444] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-wide text-[#0f1f14]">AFI ADMIN</span>
              <span className="w-2 h-2 rounded-full bg-#4ade80 animate-pulse" />
            </div>
            <p className="text-[11px] text-#4ade80/80 font-medium">Panneau de gestion</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-[#0f1f14]/60 hover:text-[#0f1f14] rounded-lg hover:bg-[#0f1f14]/5"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] uppercase font-bold tracking-widest text-[#0f1f14]/50">
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
                  ? 'bg-[#028444] text-white shadow-md shadow-black/40'
                  : 'text-[#0f1f14]/70 hover:bg-[#0f1f14]/5 hover:text-[#0f1f14]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-[#0f1f14]/50 group-hover:text-[#0f1f14]'
              }`} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <FiChevronRight className="w-4 h-4 text-white opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Action & User Footer */}
      <div className="p-4 border-t border-[#0f1f14]/10 space-y-3 bg-[#f3f6f3]">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#0f1f14]/70 hover:bg-[#0f1f14]/5 hover:text-[#0f1f14] transition-all border border-[#0f1f14]/10"
        >
          <span className="flex items-center gap-2">
            <FiExternalLink className="w-4 h-4 text-[#028444]" />
            Voir le site public
          </span>
          <span className="text-[10px] bg-[#028444]/20 text-[#028444] px-2 py-0.5 rounded-full font-bold">
            Live
          </span>
        </a>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#028444] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate max-w-[120px]">
              <p className="text-xs font-bold text-[#0f1f14] truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-#4ade80 font-medium truncate">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <FiLogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex text-[#0f1f14] font-sans">
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
        <header className="bg-white/90 backdrop-blur-md border-b border-[#0f1f14]/10 sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#0f1f14]/60 hover:text-[#028444] hover:bg-[#0f1f14]/5 rounded-xl transition"
              aria-label="Ouvrir le menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-base md:text-lg font-bold text-[#0f1f14] flex items-center gap-2">
                <span>{currentPage.label}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#4ade80]/10 text-[#028444] px-3 py-1.5 rounded-full border border-[#4ade80]/15 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1a6b3c] animate-pulse" />
              <span>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <Link
              to="/admin/produits/nouveau"
              className="flex items-center gap-2 btn-raised text-black! text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-[#4ade80]/20 hover:scale-102 active:scale-98"
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

