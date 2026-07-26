import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  FiPackage, FiUser, FiLogOut, FiDownload, FiLock, FiCheck, FiHeart, FiTrash2,
  FiClock, FiCheckCircle, FiTruck, FiXCircle, FiShield, FiArrowRight, FiPlus, FiCamera
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi, authApi, productsApi, ApiError, type Order, type Product } from '../lib/api';
import { getFavorites, toggleFavorite } from '../lib/favorites';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  pending: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FiClock },
  paid: { label: 'Payée', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle },
  shipped: { label: 'Expédiée', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FiTruck },
  delivered: { label: 'Livrée', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: FiCheckCircle },
  cancelled: { label: 'Annulée', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: FiXCircle },
};

const RECEIPT_ELIGIBLE = ['pending', 'paid', 'shipped', 'delivered'];

function generatePrintableReceipt(order: Order) {
  const win = window.open('', '_blank');
  if (!win) return;
  const itemsHtml = (order.OrderItem || []).map((item) => `
    <tr>
      <td style="padding:10px; border-bottom:1px solid #eee;">${item.Product?.name || 'Produit'}</td>
      <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">${item.quantity}</td>
      <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">${item.price.toLocaleString('fr-FR')} FCFA</td>
      <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
    </tr>
  `).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reçu de paiement - Commande #${order.id}</title>
      <meta charset="utf-8">
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; max-width: 700px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1a6b3c; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1a6b3c; }
        .badge { background: #e6f4ea; color: #1a6b3c; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        th { text-align: left; background: #f8faf8; padding: 10px; font-size: 12px; color: #666; border-bottom: 2px solid #ddd; }
        .total-box { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #1a6b3c; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">AFI Collection</div>
          <div style="font-size:12px; color:#666; margin-top:4px;">Abomey-Calavi, Bénin | maisonaficollections@gmail.com</div>
        </div>
        <div class="badge">Commande #${order.id}</div>
      </div>

      <div style="margin-top: 25px; font-size: 13px; color:#444;">
        <strong>Reçu Officiel de Paiement</strong><br>
        Date de commande: ${new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        Statut de livraison: ${order.status.toUpperCase()}
      </div>

      <table>
        <thead>
          <tr>
            <th>Article</th>
            <th style="text-align:center;">Qté</th>
            <th style="text-align:right;">Prix Unit.</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="total-box">
        Montant Total: ${order.total.toLocaleString('fr-FR')} FCFA
      </div>

      <div class="footer">
        Merci pour votre confiance. Ce reçu confirme votre achat auprès de la maison AFI Collection.
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  win.document.close();
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    ordersApi
      .getMine()
      .then((data) => setOrders(data.orders || []))
      .catch(() => toast.error('Erreur lors du chargement de vos commandes'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (order: Order) => {
    setDownloadingId(order.id);
    try {
      await ordersApi.downloadReceipt(order.id);
      toast.success('Reçu PDF téléchargé avec succès !');
    } catch {
      toast('Impression du reçu en cours...', { icon: '📄' });
      generatePrintableReceipt(order);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs animate-pulse space-y-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-64 mx-auto" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <FiPackage className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-gray-900">Aucune commande pour le moment</h3>
        <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
          Explorez nos créations artisanales et passez votre première commande en toute simplicité.
        </p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 mt-5 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-3 rounded-full transition text-xs shadow-md shadow-[#1a6b3c]/20 hover:scale-105"
        >
          <span>Découvrir la boutique</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const canDownload = RECEIPT_ELIGIBLE.includes(order.status);
        const statusInfo = STATUS_CONFIG[order.status] || {
          label: order.status, bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: FiClock
        };
        const StatusIcon = statusInfo.icon;

        return (
          <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all space-y-4">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#1a6b3c] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    Commande #{order.id}
                  </span>
                  <span className="text-xs text-gray-400">
                    du {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-lg font-black text-gray-900 font-mono mt-1">
                  {order.total.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusInfo.label}
                </span>

                {canDownload && (
                  <button
                    onClick={() => handleDownload(order)}
                    disabled={downloadingId === order.id}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a6b3c] bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200/80 transition disabled:opacity-50"
                    title="Télécharger le reçu"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{downloadingId === order.id ? 'Génération…' : 'Reçu'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Order Items List */}
            {order.OrderItem && order.OrderItem.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Articles commandés ({order.OrderItem.reduce((sum, item) => sum + item.quantity, 0)})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.OrderItem.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100/80">
                      {item.Product?.image ? (
                        <img
                          src={item.Product.image}
                          alt={item.Product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white shrink-0 border border-gray-200/60"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1a6b3c] flex items-center justify-center shrink-0 font-bold text-xs">
                          AFI
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-xs truncate">{item.Product?.name || 'Produit'}</p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Paiement Sécurisé Mobile Money / CB</span>

              {canDownload ? (
                <button
                  onClick={() => handleDownload(order)}
                  disabled={downloadingId === order.id}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#1a6b3c] hover:bg-[#14532d] px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>{downloadingId === order.id ? 'Téléchargement…' : 'Télécharger la Facture PDF'}</span>
                </button>
              ) : (
                <span className="text-xs text-gray-400 italic">Facture annulée</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FavoritesTab() {
  const { addItem } = useCart();
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
      .then((data) => setProducts((data.products || []).filter((p: Product) => favIds.includes(p.id))))
      .catch(() => toast.error('Erreur lors du chargement de vos favoris'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (id: number) => {
    toggleFavorite(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Produit retiré des favoris');
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs animate-pulse">
        <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <FiHeart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-gray-900">Aucun produit favori</h3>
        <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
          Cliquer sur le cœur d'un produit pour l'enregistrer dans votre liste de coups de cœur.
        </p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 mt-5 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-3 rounded-full transition text-xs shadow-md shadow-[#1a6b3c]/20 hover:scale-105"
        >
          <span>Parcourir la boutique</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition flex items-center gap-4 group">
          <Link to={`/produit/${product.id}`} className="shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded-2xl object-cover bg-gray-50 border border-gray-100 group-hover:scale-105 transition duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400';
              }}
            />
          </Link>
          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-[10px] font-bold text-[#1a6b3c] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              {product.category || 'Artisanat'}
            </span>
            <Link to={`/produit/${product.id}`} className="block">
              <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-[#1a6b3c] transition-colors">
                {product.name}
              </h4>
            </Link>
            <p className="text-[#1a6b3c] font-black text-xs font-mono">
              {product.price.toLocaleString('fr-FR')} FCFA
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="inline-flex items-center gap-1 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
              <button
                onClick={() => handleRemove(product.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Retirer des favoris"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image trop volumineuse (maximum 5 Mo)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (name !== user?.name) payload.name = name;
      if (avatarUrl !== user?.avatar) payload.avatar = avatarUrl;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (Object.keys(payload).length === 0) {
        toast('Aucune modification à enregistrer', { icon: 'ℹ️' });
        setSaving(false);
        return;
      }

      await authApi.updateProfile(payload);
      await refreshUser();
      toast.success('Profil et photo mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Photo de profil Uploader */}
      <div className="flex items-center gap-5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60">
        <div className="relative group shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a6b3c] to-[#4ade80] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-1 -right-1 bg-white text-[#1a6b3c] p-2 rounded-full border border-gray-200 shadow-md cursor-pointer hover:bg-emerald-50 transition hover:scale-105"
            title="Changer la photo de profil"
          >
            <FiCamera className="w-4 h-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h3 className="font-extrabold text-sm text-gray-900">Photo de Profil</h3>
          <p className="text-xs text-gray-500 mt-0.5">Format JPG, PNG ou WEBP. Maximum 5 Mo.</p>
          <label
            htmlFor="avatar-upload"
            className="inline-block text-xs font-bold text-[#1a6b3c] hover:underline cursor-pointer mt-1.5"
          >
            Téléverser une photo
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
          <FiUser className="w-4 h-4 text-[#1a6b3c]" /> Informations personnelles
        </h2>
        <p className="text-xs text-gray-400 mb-5">Mettez à jour votre nom d'utilisateur affiché sur vos commandes.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Adresse Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200/60 rounded-xl text-xs text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h2 className="text-base font-black text-gray-900 mb-1 flex items-center gap-2">
          <FiLock className="w-4 h-4 text-[#1a6b3c]" /> Sécurité & Mot de passe
        </h2>
        <p className="text-xs text-gray-400 mb-5">Laissez vide si vous ne souhaitez pas modifier votre mot de passe.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-3 rounded-xl transition text-xs shadow-md shadow-[#1a6b3c]/20 disabled:opacity-50"
        >
          <FiCheck className="w-4 h-4" />
          <span>{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}</span>
        </button>
      </div>
    </form>
  );
}

export default function Account() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'orders' | 'profile' | 'favorites'>(
    searchParams.get('favoris') === 'true' ? 'favorites' : 'orders'
  );

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/connexion?redirect=/mon-compte');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="bg-[#f8faf8] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role?.toLowerCase() === 'admin';

  return (
    <div className="bg-[#f8faf8] min-h-screen pb-16 text-gray-900">
      <SEO title="Mon Compte Client" description="Gérez vos commandes, votre profil et vos favoris sur AFI Collection." />
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-[#07170d] via-[#1a6b3c] to-[#0a2314] text-[#fff] py-10 shadow-lg">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1a6b3c] to-[#4ade80] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-black/20 border-2 border-white/20 shrink-0 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                {isAdmin ? (
                  <span className="bg-purple-400/20 text-purple-200 border border-purple-300/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    👑 Admin
                  </span>
                ) : (
                  <span className="bg-white/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Client Privilégié
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
              >
                <FiShield className="w-4 h-4" />
                <span>Espace Administrateur</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-md transition border border-white/20"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Main Content */}
      <div className="container mx-auto px-6 md:px-12 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-1.5 sticky top-24">
              <button
                onClick={() => setTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition ${
                  tab === 'orders'
                    ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiPackage className="w-4 h-4" />
                  <span>Mes commandes</span>
                </div>
                <FiArrowRight className={`w-3.5 h-3.5 transition-transform ${tab === 'orders' ? 'translate-x-1' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setTab('favorites')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition ${
                  tab === 'favorites'
                    ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiHeart className="w-4 h-4" />
                  <span>Mes favoris</span>
                </div>
                <FiArrowRight className={`w-3.5 h-3.5 transition-transform ${tab === 'favorites' ? 'translate-x-1' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition ${
                  tab === 'profile'
                    ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiUser className="w-4 h-4" />
                  <span>Mon profil & sécurité</span>
                </div>
                <FiArrowRight className={`w-3.5 h-3.5 transition-transform ${tab === 'profile' ? 'translate-x-1' : 'opacity-0'}`} />
              </button>
            </div>
          </div>

          {/* Main Tab Panel */}
          <div className="md:col-span-3">
            {tab === 'orders' && <OrdersTab />}
            {tab === 'favorites' && <FavoritesTab />}
            {tab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

