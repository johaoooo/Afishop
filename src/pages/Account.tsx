import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  FiPackage, FiUser, FiLogOut, FiDownload, FiLock, FiCheck, FiHeart, FiTrash2, FiShoppingBag,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ordersApi, authApi, productsApi, ApiError, type Order, type Product } from '../lib/api';
import { getFavorites, toggleFavorite } from '../lib/favorites';
import toast from 'react-hot-toast';

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

const RECEIPT_ELIGIBLE = ['paid', 'shipped', 'delivered'];

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    ordersApi
      .getMine()
      .then((data) => setOrders(data.orders))
      .catch(() => toast.error('Erreur lors du chargement des commandes'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id: number) => {
    setDownloadingId(id);
    try {
      await ordersApi.downloadReceipt(id);
    } catch (error: any) {
      toast.error(error.message || 'Impossible de télécharger le reçu');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const canDownload = RECEIPT_ELIGIBLE.includes(order.status);
        return (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Commande #{order.id}</p>
                <p className="font-bold text-gray-800">{order.total.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              {order.OrderItem && order.OrderItem.length > 0 ? (
                <p className="text-xs text-gray-400">
                  {order.OrderItem.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                </p>
              ) : <span />}

              {canDownload ? (
                <button
                  onClick={() => handleDownload(order.id)}
                  disabled={downloadingId === order.id}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#1a6b3c] hover:text-[#14532d] disabled:opacity-50 transition"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  {downloadingId === order.id ? 'Téléchargement...' : 'Télécharger le reçu'}
                </button>
              ) : (
                <span className="text-xs text-gray-300">Reçu disponible après paiement</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (name !== user?.name) payload.name = name;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (Object.keys(payload).length === 0) {
        toast('Aucune modification à enregistrer', { icon: 'ℹ️' });
        setSaving(false);
        return;
      }

      const { user: updatedUser } = await authApi.updateProfile(payload);
      localStorage.setItem('afi_user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
      <div>
        <h2 className="font-bold text-gray-800 mb-1">Informations personnelles</h2>
        <p className="text-xs text-gray-400 mb-4">Modifiez votre nom affiché sur le site.</p>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom complet</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
          <input
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-gray-300 mt-1">L'email ne peut pas être modifié pour l'instant.</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <FiLock className="w-4 h-4 text-gray-400" /> Changer le mot de passe
        </h2>
        <p className="text-xs text-gray-400 mb-4">Laissez vide si vous ne souhaitez pas le changer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm disabled:opacity-50"
      >
        <FiCheck className="w-4 h-4" />
        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}

function FavoritesTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = getFavorites();
    if (favIds.length === 0) {
      setLoading(false);
      return;
    }
    productsApi
      .getAll()
      .then((data) => setProducts(data.products.filter((p: Product) => favIds.includes(p.id))))
      .catch(() => toast.error('Erreur lors du chargement des favoris'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (id: number) => {
    toggleFavorite(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast('Produit retiré des favoris');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800">Aucun favori</h3>
        <p className="text-gray-400 text-sm mt-1">Vous n'avez pas encore de produits favoris.</p>
        <Link
          to="/boutique"
          className="inline-block mt-4 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <Link to={`/produit/${product.id}`} className="shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-contain bg-gray-50"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/1a6b3c/ffffff?text=AFI';
              }}
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/produit/${product.id}`} className="hover:underline">
              <h4 className="font-bold text-gray-800 text-sm truncate">{product.name}</h4>
            </Link>
            <p className="text-[#1a6b3c] font-bold text-sm mt-1">
              {product.price.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/produit/${product.id}`}
              className="w-9 h-9 rounded-full bg-[#1a6b3c]/10 text-[#1a6b3c] flex items-center justify-center hover:bg-[#1a6b3c]/20 transition"
              aria-label="Voir le produit"
            >
              <FiShoppingBag className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleRemove(product.id)}
              className="w-9 h-9 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
              aria-label="Retirer des favoris"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'orders' | 'profile' | 'favorites'>(
    searchParams.get('favoris') === 'true' ? 'favorites' : 'orders'
  );

  useEffect(() => {
    if (!user) {
      navigate('/connexion?redirect=/mon-compte');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="Mon Compte" description="Gérez vos commandes, votre profil et vos informations personnelles sur AFI Collection." />
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
                <button
                  onClick={() => setTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    tab === 'orders' ? 'bg-[#1a6b3c]/10 text-[#1a6b3c]' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiPackage className="w-4 h-4" />
                  Mes commandes
                </button>
                <button
                  onClick={() => setTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    tab === 'favorites' ? 'bg-[#1a6b3c]/10 text-[#1a6b3c]' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiHeart className="w-4 h-4" />
                  Mes favoris
                </button>
                <button
                  onClick={() => setTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    tab === 'profile' ? 'bg-[#1a6b3c]/10 text-[#1a6b3c]' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiUser className="w-4 h-4" />
                  Mon profil
                </button>
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
            <h1 className="text-2xl font-black text-gray-800 mb-6">
              {tab === 'orders' ? 'Mes commandes' : tab === 'favorites' ? 'Mes favoris' : 'Mon profil'}
            </h1>
            {tab === 'orders' ? <OrdersTab /> : tab === 'favorites' ? <FavoritesTab /> : <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
