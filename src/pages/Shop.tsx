import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiTruck, FiShield, FiSearch, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { productsApi, type Product } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

const features = [
  { icon: FiAward, label: '100% Artisanal' },
  { icon: FiTruck, label: 'Livraison rapide' },
  { icon: FiShield, label: 'Paiement sécurisé' }
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    productsApi
      .getAll()
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ['Tous', ...unique];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCategory = category === 'Tous' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f5f8f5] min-h-screen">
      {/* ===== HERO AVEC IMAGE ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        {/* Image de fond */}
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441653/WhatsApp_Image_2026-05-03_at_13.15.44_e6xbcs.jpg"
          alt="Boutique AFI Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200';
          }}
        />
        
        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              La boutique
            </h1>
            <p className="text-white/80 text-base max-w-md mt-3">
              Toutes nos créations artisanales, en un seul endroit.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20">
        {/* ===== BANDEAU CATÉGORIES ===== */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-green-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[#1a6b3c] text-xs font-bold tracking-widest uppercase">
                Filtres
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mt-2">
                Explorez nos <span className="text-[#1a6b3c]">collections.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <feature.icon className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm text-gray-600">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== FILTRES ===== */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-green-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Recherche */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit…"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white/80"
              />
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    category === c 
                      ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Vue */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#1a6b3c]' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Vue grille"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#1a6b3c]' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Vue liste"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </span>
            <button className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
              Trier <FiChevronDown className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* ===== PRODUITS ===== */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-green-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Aucun produit trouvé</h3>
            <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres de recherche</p>
            <button
              onClick={() => { setSearch(''); setCategory('Tous'); }}
              className="mt-4 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' 
              : 'grid-cols-1 gap-4'
          }`}>
            {filtered.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
