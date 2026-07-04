import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiDollarSign, FiMail, FiAlertCircle } from 'react-icons/fi';
import { adminApi } from '../../services/api/modules/admin';
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

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: accent }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
      <p className="text-3xl font-black text-gray-800 mt-2 tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>
        {value}
      </p>
    </div>
  );
}

export function AdminDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o, m] = await Promise.all([
          adminApi.getProducts(),
          adminApi.getAllOrders(),
          adminApi.getMessages(),
        ]);
        setProducts(p);
        setOrders(o);
        setMessages(m);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Chargement des statistiques...</p>;
  }

  const revenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.filter((p) => p.stock <= 3);
  const unreadMessages = messages.filter((m) => !m.read);
  const recentOrders = [...orders].slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Vue d'ensemble</h1>
        <p className="text-sm text-gray-400 mt-1">L'état de votre boutique en un coup d'œil.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiBox} label="Produits" value={String(products.length)} accent="#1a6b3c" />
        <StatCard icon={FiShoppingBag} label="Commandes" value={String(orders.length)} accent="#3b82f6" />
        <StatCard icon={FiDollarSign} label="Revenu confirmé" value={`${revenue.toLocaleString('fr-FR')} F`} accent="#f59e0b" />
        <StatCard icon={FiMail} label="Messages non lus" value={String(unreadMessages.length)} accent="#ef4444" />
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Stock faible sur {lowStock.length} produit{lowStock.length > 1 ? 's' : ''}</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {lowStock.map((p) => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm">Commandes récentes</h2>
          <Link to="/admin/commandes" className="text-xs font-semibold text-[#1a6b3c] hover:underline">Voir tout</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-6">Aucune commande pour l'instant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Commande</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-mono text-gray-500">#{o.id}</td>
                  <td className="px-5 py-3 text-gray-700">{o.User?.name || '—'}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{o.total.toLocaleString('fr-FR')} F</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
