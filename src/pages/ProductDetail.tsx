import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { productsApi, type Product } from '../lib/api';
import { AFI_FALLBACK_PRODUCT } from '../lib/images';
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
      <div className="bg-[#f3f6f3] min-h-screen py-16 text-[#0f1f14]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="bg-white backdrop-blur-sm rounded-3xl border border-[#028444]/30 p-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square bg-[#0f1f14]/10 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 bg-[#0f1f14]/10 rounded w-1/4" />
                <div className="h-10 bg-[#0f1f14]/10 rounded w-3/4" />
                <div className="h-4 bg-[#0f1f14]/10 rounded w-full" />
                <div className="h-4 bg-[#0f1f14]/10 rounded w-full" />
                <div className="h-8 bg-[#0f1f14]/10 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f3f6f3] min-h-screen py-16 text-[#0f1f14]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div 
            className="bg-white backdrop-blur-sm rounded-3xl border border-[#028444]/30 p-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#0f1f14]/60 mb-4">Ce produit n'existe pas ou n'est plus disponible.</p>
            <Link to="/boutique" className="text-[#028444] font-semibold hover:underline">Retour à la boutique</Link>
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
    <div className="bg-[#f3f6f3] min-h-screen pb-24 md:pb-12 pt-12 text-[#0f1f14]">
      <SEO
        title={product.name}
        description={product.description?.slice(0, 160)}
        image={product.image}
        url={`https://aficollection.com/produit/${product.id}`}
      />
      <div className="container mx-auto px-4 md:px-12 max-w-5xl">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-sm text-[#0f1f14]/60 hover:text-[#028444] mb-4 md:mb-6 group">
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à la boutique
        </Link>

        <motion.div 
          className="bg-white backdrop-blur-sm rounded-2xl md:rounded-3xl border border-[#028444]/30 p-4 md:p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Image */}
            <div className="aspect-square bg-black/40 border border-[#0f1f14]/10 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = AFI_FALLBACK_PRODUCT; }}
              />
            </div>

            {/* Infos */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#028444]">
                {product.category} · {product.brand}
              </p>
              <h1 className="text-xl md:text-3xl font-black text-[#0f1f14] mt-1">{product.name}</h1>
              <p className="text-sm md:text-base text-[#0f1f14]/60 mt-3 md:mt-4 leading-relaxed">{product.description}</p>

              <p className="text-2xl md:text-3xl font-black text-[#028444] mt-4 md:mt-6">
                {product.price.toLocaleString('fr-FR')} FCFA
              </p>

              <p className="text-sm mt-2 md:mt-3">
                {inStock ? (
                  <span className="text-[#028444] font-medium">✅ En stock — {product.stock} disponibles</span>
                ) : (
                  <span className="text-red-500 font-medium">❌ Rupture de stock</span>
                )}
              </p>

              {inStock && (
                <div className="flex items-center gap-1 border border-[#0f1f14]/10 rounded-full w-fit mt-4 md:mt-6 bg-[#0f1f14]/5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 md:w-10 md:h-10 rounded-full hover:bg-[#028444]/10 transition flex items-center justify-center text-lg"
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-12 h-12 md:w-10 md:h-10 rounded-full hover:bg-[#028444]/10 transition flex items-center justify-center text-lg"
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
                  className="btn-raised w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiShoppingBag className="w-4 h-4" /> Commander maintenant
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="btn-ghost w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Garanties */}
              <div className="hidden md:flex gap-4 mt-6 pt-4 border-t border-[#0f1f14]/10">
                <div className="flex items-center gap-2 text-xs text-[#0f1f14]/60">
                  <FiTruck className="w-4 h-4 text-[#028444]" />
                  <span>Livraison 48h</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#0f1f14]/60">
                  <FiShield className="w-4 h-4 text-[#028444]" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Garanties sur mobile */}
        <div className="md:hidden flex gap-4 mt-4 pt-4 border-t border-[#0f1f14]/10">
          <div className="flex items-center gap-2 text-xs text-[#0f1f14]/60">
            <FiTruck className="w-4 h-4 text-[#028444]" />
            <span>Livraison 48h</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#0f1f14]/60">
            <FiShield className="w-4 h-4 text-[#028444]" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>

      {/* Barre fixe bas de page (mobile) */}
      {inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#0f1f14]/10 px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-[#0f1f14]/15 rounded-full bg-[#0f1f14]/5 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full hover:bg-[#028444]/10 transition flex items-center justify-center text-lg"
                aria-label="Diminuer"
              >−</button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-full hover:bg-[#028444]/10 transition flex items-center justify-center text-lg"
                aria-label="Augmenter"
              >+</button>
            </div>
            <button
              onClick={handleBuyNow}
              className="btn-raised flex-1"
            >
              <FiShoppingBag className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Commander {product.price.toLocaleString('fr-FR')} FCFA
            </button>
            <button
              onClick={handleAddToCart}
              className="shrink-0 border-2 border-[#028444] text-[#028444] font-bold w-12 h-12 rounded-xl flex items-center justify-center active:scale-90 transition bg-[#028444]/10"
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
