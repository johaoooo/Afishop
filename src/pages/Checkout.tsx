import SEO from '../components/SEO';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';
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
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    closeKkiapayWidget?: () => void;
    addSuccessListener?: (fn: (data: { transactionId: string }) => void) => void;
    addFailedListener?: (fn: (error: any) => void) => void;
    addKkiapayCloseListener?: (fn: () => void) => void;
    addPaymentAbortedListener?: (fn: () => void) => void;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const pendingOrderRef = useRef<Order | null>(null);

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
    if (items.length === 0 && !pendingOrderRef.current) {
      navigate('/panier');
    }
  }, [items, navigate]);

  // KKiaPay Listeners
  useEffect(() => {
    const handleSuccess = async (data: { transactionId: string }) => {
      console.log('✅ [KKiaPay Success Event]:', data);
      const order = pendingOrderRef.current;
      if (order) {
        try {
          const res = await paymentsApi.verify(data.transactionId, order.id);
          clearCart();
          toast.success('Paiement KKiaPay confirmé avec succès ! 🎉');
          navigate(`/mon-compte?commande=${res.order.id}`);
        } catch (err: any) {
          console.error('❌ [KKiaPay Verification Error]:', err);
          toast.error(err?.message || 'Erreur lors de la vérification du paiement KKiaPay');
        } finally {
          setSubmitting(false);
        }
      }
    };

    const handleFailed = (err?: any) => {
      console.warn('⚠️ [KKiaPay Failed Event]:', err);
      toast.error('Le paiement KKiaPay a échoué ou a été annulé.');
      setSubmitting(false);
    };

    const handleClose = () => {
      console.log('ℹ️ [KKiaPay Closed Event]');
      setSubmitting(false);
    };

    if (window.addSuccessListener) {
      window.addSuccessListener(handleSuccess);
    }
    if (window.addFailedListener) {
      window.addFailedListener(handleFailed);
    }
    if (window.addKkiapayCloseListener) {
      window.addKkiapayCloseListener(handleClose);
    }
    if (window.addPaymentAbortedListener) {
      window.addPaymentAbortedListener(handleClose);
    }
  }, [navigate, clearCart]);

  if (isLoading || !isAuthenticated || (items.length === 0 && !pendingOrder)) return null;

  const KKIAPAY_PUBLIC_KEY = import.meta.env.VITE_KKIAPAY_PUBLIC_KEY || 'da52a61056cd11f193801de6de503f5f';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.openKkiapayWidget) {
      toast.error('Le service de paiement KKiaPay se charge. Veuillez patienter un instant.');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const { order } = await ordersApi.create(orderItems, address);
      pendingOrderRef.current = order;
      setPendingOrder(order);

      // Clean phone number (8 digits for Bénin)
      let cleanPhone = address.phone ? address.phone.replace(/\D/g, '') : '';
      if (cleanPhone.startsWith('229') && cleanPhone.length > 8) {
        cleanPhone = cleanPhone.slice(3);
      }

      const paymentAmount = Math.max(1, Math.round(order.total || total || 1));

      const kkiapayConfig = {
        amount: paymentAmount,
        key: KKIAPAY_PUBLIC_KEY,
        sandbox: true,
        phone: cleanPhone || '97000000',
        name: (user?.name && user.name.trim()) || 'Client AFI',
        email: (user?.email && user.email.trim()) || 'client@aficollection.com',
        data: String(order.id),
        theme: '#028444',
        position: 'center'
      };

      console.log('🚀 [KKiaPay Launch Params]:', kkiapayConfig);

      // Trigger KKiaPay Sandbox Widget
      window.openKkiapayWidget(kkiapayConfig);
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
    <div className="bg-[#f3f6f3] min-h-screen py-12 text-[#0f1f14]">
      <SEO title="Validation de commande" description="Finalisez votre commande AFI Collection. Livraison rapide et paiement sécurisé KKiaPay au Bénin." />
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <Link to="/panier" className="inline-flex items-center gap-2 text-sm text-[#0f1f14]/60 hover:text-[#028444] mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au panier
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span className="pop-sticker">Commande</span>
          <h1 className="text-3xl font-black uppercase text-[#0f1f14] mt-3">
            <span className="pop-ghost-wrap">
              <span className="pop-ghost" aria-hidden="true">Commande</span>
              Validation de la <span className="text-[#028444]">commande</span>
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-2 bg-white backdrop-blur-sm border border-[#028444]/30 rounded-2xl p-6 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-bold text-[#0f1f14] text-lg">Adresse de livraison</h2>

              <div>
                <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-1.5">
                  Rue / Quartier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Ex: Avenue Jean-Paul II, Abomey-Calavi"
                  className="w-full border border-[#0f1f14]/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 transition-all bg-white text-[#0f1f14]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-1.5">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Abomey-Calavi"
                    className="w-full border border-[#0f1f14]/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 transition-all bg-white text-[#0f1f14]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-1.5">Code postal</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="01BP1234"
                    className="w-full border border-[#0f1f14]/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 transition-all bg-white text-[#0f1f14]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-1.5">
                    Pays <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full border border-[#0f1f14]/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 transition-all bg-white text-[#0f1f14]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f14]/70 mb-1.5">
                    Téléphone (Mobile Money) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="97000000"
                    className="w-full border border-[#0f1f14]/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 transition-all bg-white text-[#0f1f14]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-raised w-full mt-4 disabled:opacity-60"
              >
                {submitting ? 'Création de la commande…' : `Payer avec KKiaPay (${total.toLocaleString('fr-FR')} FCFA)`}
              </button>

              <div className="bg-[#028444]/15 border border-[#028444]/30 rounded-xl p-3 text-center text-xs text-[#028444] font-medium">
                <span className="font-bold">Mode Sandbox (Test KKiaPay)</span> — MTN Mobile Money, Moov, Celtiis & Carte. Aucun montant réel ne sera débité.
              </div>
            </form>
          </motion.div>

          <motion.div
            className="bg-white backdrop-blur-sm border border-[#028444]/30 rounded-2xl p-6 h-fit shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-[#0f1f14] mb-4">Récapitulatif</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm border-b border-[#0f1f14]/10 pb-2">
                  <span>{item.name} <span className="text-[#0f1f14]/50">× {item.quantity}</span></span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-[#0f1f14] mt-4 pt-4 border-t border-[#0f1f14]/10">
              <span>Total</span>
              <span className="text-[#028444]">{total.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="mt-6 space-y-2 text-xs text-[#0f1f14]/50">
              <div className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-[#028444]" />
                <span>Livraison 48h au Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#028444]" />
                <span>Paiement sécurisé via KKiaPay</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-[#028444]" />
                <span>Confirmation instantanée par SMS / E-mail</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
