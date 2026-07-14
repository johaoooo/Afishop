import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { productsApi, type Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi
      .getById(id)
      .then((data) => setProduct(data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#f5f8f5] min-h-screen py-16">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f5f8f5] min-h-screen py-16">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500 mb-4">Ce produit n'existe pas ou n'est plus disponible.</p>
            <Link to="/boutique" className="text-[#1a6b3c] font-semibold hover:underline">Retour à la boutique</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} ajouté au panier 🛒`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/panier');
  };

  return (
    <div className="bg-[#f5f8f5] min-h-screen pb-24 md:pb-12 pt-12">
      <SEO
        title={product.name}
        description={product.description?.slice(0, 160)}
        image={product.image}
        url={`https://aficollection.com/produit/${product.id}`}
      />
      <div className="container mx-auto px-4 md:px-12 max-w-5xl">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a6b3c] mb-4 md:mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à la boutique
        </Link>

        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-green-100 p-4 md:p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Image */}
            <div className="aspect-square bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/1a6b3c/ffffff?text=AFI'; }}
              />
            </div>

            {/* Infos */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#1a6b3c]">
                {product.category} · {product.brand}
              </p>
              <h1 className="text-xl md:text-3xl font-black text-gray-800 mt-1">{product.name}</h1>
              <p className="text-sm md:text-base text-gray-500 mt-3 md:mt-4 leading-relaxed">{product.description}</p>

              <p className="text-2xl md:text-3xl font-black text-[#1a6b3c] mt-4 md:mt-6">
                {product.price.toLocaleString('fr-FR')} FCFA
              </p>

              <p className="text-sm mt-2 md:mt-3">
                {inStock ? (
                  <span className="text-green-600 font-medium">✅ En stock — {product.stock} disponibles</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Rupture de stock</span>
                )}
              </p>

              {inStock && (
                <div className="flex items-center gap-1 border border-gray-200 rounded-full w-fit mt-4 md:mt-6 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 md:w-10 md:h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-lg"
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-12 h-12 md:w-10 md:h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-lg"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
              )}

              <div className="hidden md:flex flex-col gap-3 mt-6">
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#1a6b3c]/20 hover:shadow-xl"
                >
                  <FiShoppingBag className="w-4 h-4" /> Commander maintenant
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full border-2 border-[#1a6b3c] text-[#1a6b3c] hover:bg-[#1a6b3c] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl transition-colors"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Garanties */}
              <div className="hidden md:flex gap-4 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiTruck className="w-4 h-4 text-[#1a6b3c]" />
                  <span>Livraison 48h</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiShield className="w-4 h-4 text-[#1a6b3c]" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Garanties sur mobile */}
        <div className="md:hidden flex gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiTruck className="w-4 h-4 text-[#1a6b3c]" />
            <span>Livraison 48h</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiShield className="w-4 h-4 text-[#1a6b3c]" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>

      {/* Barre fixe bas de page (mobile) */}
      {inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-gray-300 rounded-full bg-gray-50 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-lg"
                aria-label="Diminuer"
              >−</button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-lg"
                aria-label="Augmenter"
              >+</button>
            </div>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#1a6b3c] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#1a6b3c]/20 active:scale-[0.98] transition"
            >
              <FiShoppingBag className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Commander {product.price.toLocaleString('fr-FR')} FCFA
            </button>
            <button
              onClick={handleAddToCart}
              className="shrink-0 border-2 border-[#1a6b3c] text-[#1a6b3c] font-bold w-12 h-12 rounded-xl flex items-center justify-center active:scale-90 transition"
              aria-label="Ajouter au panier"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
