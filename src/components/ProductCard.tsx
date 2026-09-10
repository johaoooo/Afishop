import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import type { Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { toggleFavorite, isFavorite } from '../lib/favorites';
import toast from 'react-hot-toast';
import { AFI_FALLBACK_PRODUCT } from '../lib/images';

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
      className="pop-card group block overflow-hidden flex flex-col justify-between"
    >
      {/* Image Container with 4:5 mobile / square desktop aspect ratio - Full Image Visible */}
      <div className="aspect-[4/5] sm:aspect-square bg-black/30 overflow-hidden relative w-full flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = AFI_FALLBACK_PRODUCT;
          }}
        />

        {/* Gradient Overlay on image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Favorite Heart Button - Always visible on mobile */}
        <button
          onClick={handleFavorite}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all z-10 ${
            fav ? 'bg-[#028444] text-white' : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-[#05a855]'
          }`}
        >
          <FiHeart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add To Cart Floating Button */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          aria-label="Ajouter au panier"
          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#028444] hover:bg-[#05a855] text-white border-2 border-white/90 shadow-[2px_2px_0px_#000] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110 hover:rotate-12 z-10"
        >
          <FiShoppingCart className="w-4 h-4" />
        </button>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="pop-sticker text-[10px]!">
              Épuisé
            </span>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 sm:p-4 space-y-1.5">
        <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-[#05a855] transition-colors leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[11px] sm:text-xs text-white/50 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="font-black text-[#05a855] text-xs sm:text-sm font-mono">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-1 ${inStock ? 'text-[#05a855]' : 'text-rose-400'}`}>
            {inStock ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#05a855] animate-pulse inline-block" />
                <span>En stock</span>
              </>
            ) : 'Rupture'}
          </span>
        </div>
      </div>
    </Link>
  );
}

