import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
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
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-[#1a6b3c]/8 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a6b3c/ffffff?text=AFI';
          }}
        />

        <span className="absolute top-2 left-2 bg-white/90 text-[#1a6b3c] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-xs">
          {product.category}
        </span>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavorite}
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
              fav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-400'
            }`}
          >
            <FiHeart className={`w-3 h-3 ${fav ? 'fill-current' : ''}`} />
          </button>
          <span
            className="w-7 h-7 rounded-full bg-white/80 text-gray-400 flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <FiEye className="w-3 h-3" />
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!inStock}
          aria-label="Ajouter au panier"
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md text-[#1a6b3c] flex items-center justify-center hover:bg-[#1a6b3c] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 z-10"
        >
          <FiShoppingCart className="w-4 h-4" />
        </button>

        {!inStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow">
              Rupture
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-[#1a6b3c] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-[#1a6b3c] text-sm">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <span className={`text-[10px] font-medium ${inStock ? 'text-green-600' : 'text-red-400'}`}>
            {inStock ? 'En stock' : 'Rupture'}
          </span>
        </div>
      </div>
    </Link>
  );
}
