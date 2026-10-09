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
    toast.success(now ? 'Ajouté aux favoris' : 'Retiré des favoris');
  };

  return (
    <Link
      to={`/produit/${product.id}`}
      className="pop-card wappe-lift group block overflow-hidden flex flex-col justify-between"
    >
      {/* Image Container with 4:5 mobile / square desktop aspect ratio - Full Image Visible */}
      <div className="aspect-[4/5] sm:aspect-square bg-black/10 overflow-hidden relative w-full flex items-center justify-center p-2 rounded-t-[1.25rem]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = AFI_FALLBACK_PRODUCT;
          }}
        />

        {/* Favorite Heart Button - 44px Touch target */}
        <button
          onClick={handleFavorite}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-2.5 right-2.5 w-11 h-11 rounded-full cursor-pointer flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#028444] ${
            fav ? 'bg-[#028444] text-white' : 'bg-black/60 text-white/80 hover:bg-black/85 hover:text-[#05a855]'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add To Cart Floating Button - 44px Touch target */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          aria-label="Ajouter au panier"
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full cursor-pointer bg-[#028444] hover:bg-[#05a855] text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#028444]"
        >
          <FiShoppingCart className="w-5 h-5" />
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
        <h3 className="font-bold text-[#0f1f14] text-xs sm:text-sm line-clamp-1 group-hover:text-[#028444] transition-colors leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[11px] sm:text-xs text-[#0f1f14]/60 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="font-extrabold text-[#028444] text-xs sm:text-sm tracking-tight">
            {product.price.toLocaleString('fr-FR')}{" "}
            <span className="text-[10px] font-semibold text-neutral-500">FCFA</span>
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${inStock ? 'bg-emerald-500/10 text-[#028444]' : 'bg-rose-500/10 text-rose-600'}`}>
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

