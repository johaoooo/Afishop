import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiUser, FiMail, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ordersApi, type Order } from '../lib/api';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/connexion?redirect=/mon-compte');
      return;
    }

    ordersApi
      .getMine()
      .then((data) => setOrders(data.orders))
      .catch(() => toast.error('Erreur lors du chargement des commandes'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <div className="container mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-[#1a6b3c]" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/mon-compte"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#1a6b3c]/10 text-[#1a6b3c] font-semibold text-sm"
                >
                  <FiPackage className="w-4 h-4" />
                  Mes commandes
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition text-sm font-semibold"
                >
                  <FiLogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-black text-gray-800 mb-6">Mes commandes</h1>

            {/* Profil */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <h2 className="font-bold text-gray-800 mb-4">Mes informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Membre depuis {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Commandes */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-48" />
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Aucune commande</h3>
                <p className="text-gray-400 text-sm mt-1">Vous n'avez pas encore passé de commande.</p>
                <Link
                  to="/boutique"
                  className="inline-block mt-4 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
                >
                  Découvrir la boutique
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Commande #{order.id}</p>
                        <p className="font-bold text-gray-800">
                          {order.total.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    {order.OrderItem && order.OrderItem.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          {order.OrderItem.reduce((sum, item) => sum + item.quantity, 0)} articles
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
