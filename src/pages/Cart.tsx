import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="bg-[#f5f8f5] min-h-screen py-16">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-green-100 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-[#1a6b3c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-11 h-11 text-[#1a6b3c]" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2">Votre panier est vide</h1>
            <p className="text-gray-500 mb-6">Parcourez la boutique pour trouver votre bonheur.</p>
            <Link 
              to="/boutique" 
              className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-semibold px-7 py-3 rounded-full transition-colors"
            >
              Découvrir la boutique
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f8f5] min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a6b3c] mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Continuer mes achats
        </Link>

        <h1 className="text-3xl font-black text-gray-800 mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div 
                key={item.productId} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100 p-4 flex gap-4 shadow-sm hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/96/1a6b3c/ffffff?text=AFI'; }}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Supprimer"
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 border border-gray-200 rounded-full bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-[#1a6b3c]">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Résumé */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100 p-6 h-fit sticky top-24 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-bold text-lg text-gray-800 mb-4">Résumé</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sous-total</span>
              <span className="font-semibold text-gray-800">{total.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Frais de livraison calculés à l'étape suivante.</p>
            <button
              onClick={() => navigate('/validation-commande')}
              className="w-full bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#1a6b3c]/20 hover:shadow-xl"
            >
              Valider ma commande
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
