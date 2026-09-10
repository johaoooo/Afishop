import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBox, FiShoppingBag, FiDollarSign, FiAlertTriangle,
  FiUsers, FiArrowUpRight, FiPlus, FiBookOpen, FiMail, FiChevronRight, FiTrendingUp
} from 'react-icons/fi';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { adminApi, type Order, type Product, type AdminUser } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'En attente', bg: 'bg-[#4ade80]/10 border-[#4ade80]/25', text: 'text-[#4ade80]', dot: 'bg-[#4ade80]/100' },
  paid: { label: 'Payée', bg: 'bg-[#4ade80]/10 border-[#4ade80]/30', text: 'text-[#4ade80]', dot: 'bg-[#4ade80]' },
  shipped: { label: 'Expédiée', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  delivered: { label: 'Livrée', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700', dot: 'bg-teal-500' },
  cancelled: { label: 'Annulée', bg: 'bg-[#f43f5e]/10 border-[#f43f5e]/25', text: 'text-rose-700', dot: 'bg-[#f43f5e]/100' },
};

const CHART_COLORS = ['#1a6b3c', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function AdminDashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersData, productsData, usersData] = await Promise.all([
          adminApi.getAllOrders(),
          adminApi.getProducts(),
          adminApi.getUsers(),
        ]);
        setOrders(ordersData.orders || []);
        setProducts(productsData.products || []);
        setUsers(usersData.users || []);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white/10 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const revenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.filter((p) => p.stock <= 3);
  const recentOrders = [...orders].slice(0, 5);

  const statusData = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    .map(status => ({
      name: STATUS_CONFIG[status]?.label || status,
      value: orders.filter(o => o.status === status).length,
    }))
    .filter(item => item.value > 0);

  const salesData = [
    { day: 'Lun', ventes: 125000 },
    { day: 'Mar', ventes: 89000 },
    { day: 'Mer', ventes: 195000 },
    { day: 'Jeu', ventes: 140000 },
    { day: 'Ven', ventes: 240000 },
    { day: 'Sam', ventes: 310000 },
    { day: 'Dim', ventes: 180000 },
  ];

  const statCards = [
    {
      label: 'Chiffre d\'affaires',
      value: `${revenue.toLocaleString('fr-FR')} FCFA`,
      trend: '+18.4% ce mois',
      icon: FiDollarSign,
      gradient: 'from-[#4ade80] to-[#1a6b3c]',
      textColor: 'text-[#4ade80]',
      bgColor: 'bg-[#4ade80]/10'
    },
    {
      label: 'Commandes totales',
      value: orders.length,
      trend: `${orders.filter(o => o.status === 'pending').length} en attente`,
      icon: FiShoppingBag,
      gradient: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Produits en stock',
      value: products.length,
      trend: lowStock.length > 0 ? `${lowStock.length} stock faible` : 'Stock optimal',
      icon: FiBox,
      gradient: 'from-purple-500 to-indigo-700',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Utilisateurs inscrits',
      value: users.length,
      trend: '+12% ce mois',
      icon: FiUsers,
      gradient: 'from-[#05a855] to-[#028444]',
      textColor: 'text-[#05a855]',
      bgColor: 'bg-[#028444]/15'
    },
  ];

  return (
    <div className="space-y-8">
      {/* ===== HERO WELCOME BANNER ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-gradient-to-r from-[#0d2818] via-[#1a6b3c] to-[#0d2818] p-6 md:p-8 text-white shadow-xl overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-#4ade80/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#4ade80]/30 text-xs font-semibold backdrop-blur-sm mb-3">
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Tableau de bord administrateur</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Ravi de vous revoir, <span className="text-#4ade80">{user?.name?.split(' ')[0] || 'Admin'}</span> 👋
            </h1>
            <p className="text-white/80 text-sm mt-1 max-w-xl">
              Voici l'état actuel de votre boutique AFI Collection : {products.length} produits référencés et {orders.length} commandes enregistrées.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/produits/nouveau"
              className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg"
            >
              <FiPlus className="w-4 h-4" />
              Ajouter un produit
            </Link>
            <Link
              to="/admin/commandes"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#1c1917]/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition"
            >
              Gérer les commandes
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===== STAT CARDS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-[#1c1917] rounded-2xl p-5 shadow-xs border border-white/10/80 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#4ade80]">
                <span className="bg-[#4ade80]/10 px-2 py-0.5 rounded-md text-[11px]">
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ===== LOW STOCK ALERT BANNER ===== */}
      {lowStock.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#4ade80]/90 border border-[#4ade80]/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#4ade80]/10 flex items-center justify-center text-amber-600 shrink-0">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Alerte stock faible sur {lowStock.length} produit{lowStock.length > 1 ? 's' : ''} !
              </p>
              <p className="text-xs text-[#4ade80] mt-0.5">
                {lowStock.map(p => `${p.name} (${p.stock} restant)`).join(', ')}
              </p>
            </div>
          </div>
          <Link
            to="/admin/produits"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-[#4ade80]/60 hover:bg-[#4ade80]/25 px-3.5 py-2 rounded-xl transition shrink-0"
          >
            <span>Réapprovisionner</span>
            <FiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-[#1c1917] rounded-2xl p-6 shadow-xs border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-base">Aperçu des ventes</h3>
              <p className="text-xs text-white/40 mt-0.5">Évolution des revenus hebdomadaires</p>
            </div>
            <span className="text-xs font-semibold text-[#4ade80] bg-[#4ade80]/10 px-3 py-1 rounded-full border border-[#4ade80]/15">
              7 derniers jours
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a6b3c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1a6b3c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="#1a6b3c" strokeWidth={3} fillOpacity={1} fill="url(#colorVentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-[#1c1917] rounded-2xl p-6 shadow-xs border border-white/10 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-white text-base">Statut des commandes</h3>
            <p className="text-xs text-white/40 mt-0.5">Répartition actuelle</p>
          </div>
          
          {statusData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-white/40">
              Aucune donnée de commande
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-2 mt-4 pt-4 border-t border-white/10">
                {statusData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span className="text-white/60 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-white/85">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== RECENT ORDERS TABLE ===== */}
      <div className="bg-[#1c1917] rounded-2xl shadow-xs border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/50">
          <div>
            <h2 className="font-bold text-white text-base">Commandes récentes</h2>
            <p className="text-xs text-white/40 mt-0.5">Derniers achats effectués sur la boutique</p>
          </div>
          <Link 
            to="/admin/commandes" 
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4ade80] hover:text-[#bbf7d0] hover:underline"
          >
            <span>Voir toutes les commandes</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">
            Aucune commande enregistrée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/10 bg-[#1c1917]/30">
                  <th className="px-6 py-3.5 font-bold">N° Commande</th>
                  <th className="px-6 py-3.5 font-bold">Client</th>
                  <th className="px-6 py-3.5 font-bold">Date</th>
                  <th className="px-6 py-3.5 font-bold">Total</th>
                  <th className="px-6 py-3.5 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentOrders.map((o) => {
                  const statusInfo = STATUS_CONFIG[o.status] || {
                    label: o.status,
                    bg: 'bg-white/10 border-white/10',
                    text: 'text-white/70',
                    dot: 'bg-gray-400'
                  };

                  return (
                    <tr key={o.id} className="hover:bg-[#1c1917]/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#4ade80]">
                        #{o.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#4ade80]/15 text-[#4ade80] font-bold text-xs flex items-center justify-center">
                            {o.User?.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="font-semibold text-white/85 text-xs">{o.User?.name || 'Client Anonyme'}</p>
                            <p className="text-[11px] text-white/40">{o.User?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/50">
                        {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 font-bold text-white font-mono text-xs">
                        {o.total.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== QUICK ACTIONS SHORTCUTS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/produits"
          className="bg-[#1c1917] p-5 rounded-2xl border border-white/10 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#4ade80]/10 text-[#4ade80] flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiBox className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-[#4ade80] transition-colors">Gérer les produits</h4>
            <p className="text-xs text-white/40 mt-0.5">Consulter, modifier le catalogue</p>
          </div>
        </Link>

        <Link
          to="/admin/formations"
          className="bg-[#1c1917] p-5 rounded-2xl border border-white/10 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiBookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-600 transition-colors">Formations CFP</h4>
            <p className="text-xs text-white/40 mt-0.5">Gérer les filières & inscrits</p>
          </div>
        </Link>

        <Link
          to="/admin/messages"
          className="bg-[#1c1917] p-5 rounded-2xl border border-white/10 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiMail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-600 transition-colors">Messages reçus</h4>
            <p className="text-xs text-white/40 mt-0.5">Demandes de contact & devis</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

