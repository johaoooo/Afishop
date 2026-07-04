import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiBox, FiShoppingBag, FiBookOpen, FiMail, FiLogOut, FiExternalLink, FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex">
      <aside className="w-64 shrink-0 bg-[#0d2818] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">AFI Collection</p>
          <p className="text-lg font-bold mt-0.5">Panneau admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#1a6b3c] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FiExternalLink className="w-4 h-4" />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#1a6b3c] font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-400 leading-tight">{user?.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
