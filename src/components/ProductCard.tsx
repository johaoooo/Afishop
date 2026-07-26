import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import type { Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { toggleFavorite, isFavorite } from '../lib/favorites';
import toast from 'react-hot-toast';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [fav, setFav] = useState(() => isFavorite(product.id));
  const inStock = product.stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleFavorite(product.id);
    setFav(now);
    toast(now ? 'Ajouté aux favoris ❤️' : 'Retiré des favoris');
  };

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container with 4:5 mobile / square desktop aspect ratio */}
      <div className="aspect-[4/5] sm:aspect-square bg-gray-100 overflow-hidden relative w-full">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';
          }}
        />

        {/* Gradient Overlay on image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Favorite Heart Button - Always visible on mobile */}
        <button
          onClick={handleFavorite}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all z-10 ${
            fav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <FiHeart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add To Cart Floating Button */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          aria-label="Ajouter au panier"
          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#1a6b3c] hover:bg-[#14532d] text-white shadow-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
        >
          <FiShoppingCart className="w-4 h-4" />
        </button>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
              Épuisé
            </span>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-3 sm:p-4 space-y-1.5 bg-white">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover:text-[#1a6b3c] transition-colors leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <span className="font-black text-[#1a6b3c] text-xs sm:text-sm font-mono">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-1 ${inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
            {inStock ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>En stock</span>
              </>
            ) : 'Rupture'}
          </span>
        </div>
      </div>
    </Link>
  );
}

