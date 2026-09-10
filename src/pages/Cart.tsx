import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="bg-[#070b08] min-h-screen py-16 text-white">
        <SEO title="Panier" description="Votre panier AFI Collection est vide. Parcourez notre boutique artisanale." />
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            className="bg-[#121914] backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-[#028444]/30 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-[#028444]/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-11 h-11 text-[#05a855]" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Votre panier est vide</h1>
            <p className="text-white/50 mb-6">Parcourez la boutique pour trouver votre bonheur.</p>
            <Link 
              to="/boutique" 
              className="btn-raised"
            >
              Découvrir la boutique
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#070b08] min-h-screen py-12 text-white">
      <SEO title="Panier" description="Consultez votre panier AFI Collection et finalisez votre commande d'articles artisanaux." />
      <div className="container mx-auto px-6 md:px-12">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#05a855] mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Continuer mes achats
        </Link>

        <span className="pop-sticker">Panier</span>
        <h1 className="text-3xl font-black italic uppercase text-white mb-8 mt-3">
          <span className="pop-ghost-wrap">
            <span className="pop-ghost" aria-hidden="true">Panier</span>
            Mon <span className="text-[#05a855]">panier</span>
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div 
                key={item.productId} 
                className="bg-[#121914] backdrop-blur-sm rounded-2xl border border-[#028444]/30 p-4 flex gap-4 shadow-sm hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl bg-black/40 border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/96/028444/ffffff?text=AFI'; }}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Supprimer"
                      className="text-white/50 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 border border-white/10 rounded-full bg-black/30">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-[#05a855]">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Résumé */}
          <motion.div 
            className="bg-[#121914] backdrop-blur-sm rounded-2xl border border-[#028444]/30 p-6 h-fit sticky top-24 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-lg text-white mb-4">Résumé</h2>
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Sous-total</span>
              <span className="font-semibold text-white">{total.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <p className="text-xs text-white/40 mb-4">Frais de livraison calculés à l'étape suivante.</p>
            <button
              onClick={() => navigate('/validation-commande')}
              className="btn-raised w-full"
            >
              Valider ma commande
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
