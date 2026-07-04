import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api/modules/admin';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', paid: 'Payée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await adminApi.getAllOrders());
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await adminApi.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success('Statut mis à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Commandes</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 px-5 py-6">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-6">Aucune commande pour l'instant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Commande</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Articles</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 align-top">
                  <td className="px-5 py-3 font-mono text-gray-500">#{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{o.User?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{o.User?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {o.OrderItem?.map((item: any) => (
                      <p key={item.id} className="text-xs">{item.quantity}× {item.Product?.name}</p>
                    ))}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800 font-mono">{o.total.toLocaleString('fr-FR')} F</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] cursor-pointer ${STATUS_COLORS[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
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
