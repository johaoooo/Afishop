import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import type { Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const inStock = product.stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a6b3c/ffffff?text=AFI';
          }}
        />
        {!inStock && (
          <span className="absolute top-3 left-3 bg-white/95 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
            Rupture de stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a6b3c]">{product.category}</p>
        <h3 className="font-bold text-gray-800 text-sm mt-0.5 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="font-bold text-[#1a6b3c] text-base">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            aria-label="Ajouter au panier"
            className="w-9 h-9 rounded-full bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
