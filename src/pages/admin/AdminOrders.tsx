import { useEffect, useState, useMemo } from 'react';
import { adminApi, type Order } from '../../lib/api';
import { FiShoppingBag, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'En attente', bg: 'bg-[#4ade80]/10', text: 'text-[#4ade80]', border: 'border-[#4ade80]/25' },
  paid: { label: 'Payée', bg: 'bg-[#4ade80]/10', text: 'text-[#4ade80]', border: 'border-[#4ade80]/30' },
  shipped: { label: 'Expédiée', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  delivered: { label: 'Livrée', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  cancelled: { label: 'Annulée', bg: 'bg-[#f43f5e]/10', text: 'text-rose-700', border: 'border-[#f43f5e]/25' },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllOrders();
      setOrders(data.orders || []);
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

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesSearch = 
        String(o.id).includes(search) ||
        o.User?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.User?.email?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Gestion des commandes</h1>
        <p className="text-xs text-white/40 mt-1">
          Suivez et mettez à jour le traitement des commandes ({orders.length} au total)
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#1c1917] rounded-2xl p-4 shadow-xs border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° commande, client ou email…"
              className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-xl text-xs text-white placeholder-white/30 border border-white/10/80 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {STATUSES.map((status) => {
              const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length;
              const label = status === 'all' ? 'Toutes' : STATUS_CONFIG[status]?.label || status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    statusFilter === status
                      ? 'bg-[#4ade80] text-black shadow-xs'
                      : 'bg-white/10 text-white/60 hover:bg-[#1c1917]/15'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-[#1c1917] rounded-2xl shadow-xs overflow-hidden border border-white/10">
        {loading ? (
          <div className="p-12 text-center text-sm text-white/40 animate-pulse">
            Chargement des commandes…
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <FiShoppingBag className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-sm font-bold text-white/70">Aucune commande trouvée</p>
            <p className="text-xs text-white/40 mt-1">Aucun enregistrement ne correspond à vos filtres.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/10 bg-white/50">
                  <th className="px-6 py-4 font-bold">Commande</th>
                  <th className="px-6 py-4 font-bold">Client</th>
                  <th className="px-6 py-4 font-bold">Articles</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Changer le statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.map((o) => {
                  const statusInfo = STATUS_CONFIG[o.status] || {
                    label: o.status, bg: 'bg-white/10', text: 'text-white/70', border: 'border-white/10'
                  };

                  return (
                    <tr key={o.id} className="hover:bg-[#1c1917]/80 transition-colors align-top">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#4ade80]">#{o.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#4ade80]/15 text-[#4ade80] font-bold text-xs flex items-center justify-center shrink-0">
                            {o.User?.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{o.User?.name || 'Client anonyme'}</p>
                            <p className="text-[11px] text-white/40">{o.User?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {o.OrderItem?.map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5 text-xs text-white/70">
                              <span className="font-bold text-[#4ade80] bg-[#4ade80]/10 px-1.5 py-0.5 rounded text-[10px]">
                                {item.quantity}×
                              </span>
                              <span className="truncate max-w-[180px]">{item.Product?.name || 'Produit'}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white font-mono text-xs">
                        {o.total.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-4 text-xs text-white/50">
                        {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30`}
                        >
                          <option value="pending">En attente</option>
                          <option value="paid">Payée</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

