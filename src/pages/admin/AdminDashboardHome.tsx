import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBox, FiShoppingBag, FiDollarSign, FiAlertCircle,
  FiUsers
} from 'react-icons/fi';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { adminApi, type Order, type Product, type AdminUser } from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CHART_COLORS = ['#1a6b3c', '#4ade80', '#3b82f6', '#f59e0b', '#ef4444'];

export function AdminDashboardHome() {
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
        toast.error(error.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  }

  const revenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.filter((p) => p.stock <= 3);
  const recentOrders = [...orders].slice(0, 5);

  const statusData = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(status => ({
    name: STATUS_LABELS[status] || status,
    value: orders.filter(o => o.status === status).length,
  }));

  const salesData = [
    { day: 'Lun', ventes: 12 },
    { day: 'Mar', ventes: 8 },
    { day: 'Mer', ventes: 15 },
    { day: 'Jeu', ventes: 10 },
    { day: 'Ven', ventes: 20 },
    { day: 'Sam', ventes: 18 },
    { day: 'Dim', ventes: 5 },
  ];

  const statCards = [
    { label: 'Utilisateurs', value: users?.length || 0, icon: FiUsers, color: '#1a6b3c', bg: 'bg-green-50' },
    { label: 'Produits', value: products?.length || 0, icon: FiBox, color: '#3b82f6', bg: 'bg-blue-50' },
    { label: 'Commandes', value: orders?.length || 0, icon: FiShoppingBag, color: '#8b5cf6', bg: 'bg-purple-50' },
    { label: 'Revenus', value: `${revenue.toLocaleString()} FCFA`, icon: FiDollarSign, color: '#f59e0b', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6`} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Stock faible sur {lowStock.length} produit{lowStock.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {lowStock.map((p) => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Statut des commandes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
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
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Ventes de la semaine</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="ventes" stroke="#1a6b3c" fill="#4ade80" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Dernières commandes</h2>
          <Link to="/admin/commandes" className="text-xs font-semibold text-[#1a6b3c] hover:underline">
            Voir tout
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 px-6 py-6">Aucune commande pour l'instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Commande</th>
                  <th className="px-6 py-3 font-semibold">Client</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-mono text-gray-500">#{o.id}</td>
                    <td className="px-6 py-3 text-gray-700">{o.User?.name || '—'}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">{o.total.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
