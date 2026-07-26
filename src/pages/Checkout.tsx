import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiTruck, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi, paymentsApi, ApiError, type Order } from '../lib/api';
import toast from 'react-hot-toast';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'kkiapay-widget': any;
    }
  }
  interface Window {
    FedaPay?: {
      init: (selectorOrOptions: any, options?: any) => any;
      CHECKOUT_COMPLETED?: string;
    };
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    closeKkiapayWidget?: () => void;
    addSuccessListener?: (fn: (data: { transactionId: string }) => void) => void;
    addFailedListener?: (fn: () => void) => void;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'Bénin',
    phone: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Connectez-vous pour valider votre commande');
      navigate('/connexion?redirect=/validation-commande');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (items.length === 0 && !pendingOrder) {
      navigate('/panier');
    }
  }, [items, navigate, pendingOrder]);

  if (isLoading || !isAuthenticated || (items.length === 0 && !pendingOrder)) return null;

  const FEDAPAY_PUBLIC_KEY = import.meta.env.VITE_FEDAPAY_PUBLIC_KEY || 'pk_sandbox_DI3uszKPCm0nuxSZjgdNJhf7';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.FedaPay) {
      toast.error('Plateforme FedaPay pas encore disponible. Veuillez rafraîchir la page.');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const { order } = await ordersApi.create(orderItems, address);
      setPendingOrder(order);

      const cleanPhone = address.phone ? address.phone.replace(/\D/g, '') : '';

      const widget = window.FedaPay.init({
        public_key: FEDAPAY_PUBLIC_KEY,
        transaction: {
          amount: Math.round(order.total),
          description: `Commande AFI #${order.id}`,
          custom_metadata: { order_id: String(order.id) }
        },
        customer: {
          email: user?.email || 'client@aficollection.com',
          lastname: user?.name || 'Client',
          firstname: 'AFI',
          ...(cleanPhone ? { phone_number: { number: cleanPhone, country: 'bj' } } : {})
        },
        onComplete: async (response: any) => {
          if (response && response.reason === 'CHECKOUT_COMPLETED') {
            try {
              const res = await paymentsApi.verify(response.transaction.id, order.id);
              clearCart();
              toast.success('Paiement FedaPay confirmé ! 🎉');
              navigate(`/mon-compte?commande=${res.order.id}`);
            } catch (err: any) {
              toast.error(err?.message || 'Erreur lors de la vérification du paiement FedaPay');
            }
          } else {
            toast.error('Le paiement FedaPay a été annulé');
          }
          setSubmitting(false);
        }
      });

      if (widget && typeof widget.open === 'function') {
        widget.open();
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Une erreur est survenue lors de la création de la commande');
      }
    }
  };



  return (
    <div className="bg-[#f5f8f5] min-h-screen py-12">
      <SEO title="Validation de commande" description="Finalisez votre commande AFI Collection. Livraison rapide et paiement sécurisé au Bénin." />
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <Link to="/panier" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a6b3c] mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au panier
        </Link>

        <motion.h1
          className="text-3xl font-black text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Validation de la commande
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-2 bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-bold text-gray-800 text-lg">Adresse de livraison</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Rue / Quartier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Ex: Avenue Jean-Paul II, Abomey-Calavi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Abomey-Calavi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Code postal</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="01BP1234"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pays <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="97000000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#1a6b3c]/20 hover:shadow-xl mt-4"
              >
                {submitting ? 'Création de la commande…' : `Valider et Payer avec FedaPay (${total.toLocaleString('fr-FR')} FCFA)`}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Mode test (sandbox) — aucun montant réel ne sera débité.
              </p>
            </form>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl p-6 h-fit shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-gray-800 mb-4">Récapitulatif</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-gray-800 mt-4 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span className="text-[#1a6b3c]">{total.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-[#1a6b3c]" />
                <span>Livraison 48h</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#1a6b3c]" />
                <span>Paiement sécurisé via Kkiapay</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
