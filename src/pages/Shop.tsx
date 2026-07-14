import SEO from '../components/SEO';
import { useEffect, useState, useRef } from 'react';
import { 
  FiSearch, FiGrid, FiList, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiTag, FiArrowUp, FiArrowDown, FiX, FiFilter
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { productsApi, type Product } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nouveautés', icon: FiChevronDown },
  { value: 'price-asc', label: 'Prix croissant', icon: FiArrowUp },
  { value: 'price-desc', label: 'Prix décroissant', icon: FiArrowDown },
  { value: 'name-asc', label: 'Nom A-Z', icon: FiArrowUp },
  { value: 'name-desc', label: 'Nom Z-A', icon: FiArrowDown },
];

const CATEGORIES = [
  { id: 'sacs', label: 'Sacs macramé' },
  { id: 'chaussures', label: 'Sandales macramé' },
  { id: 'pagnes', label: 'Pagnes' },
  { id: 'accessoires', label: 'Accessoires' },
  { id: 'tissus', label: 'Tissus' },
  { id: 'vetements', label: 'Vêtements' },
  { id: 'decoration', label: 'Décoration & Ameublement' },
];

const CATEGORY_MAP: Record<string, string[]> = {
  'sacs': ['sacs', 'sac'],
  'chaussures': ['chaussures', 'chaussure', 'sandales', 'sandale'],
  'pagnes': ['pagnes', 'pagne'],
  'accessoires': ['accessoires', 'accessoire'],
  'tissus': ['tissus', 'tissu'],
  'vetements': ['vêtements', 'vetements', 'vêtement', 'vetement'],
  'decoration': ['décoration', 'decoration', 'ameublement', 'maison'],
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 9;
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data.products);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const processed = products.filter((p) => {
    let matchesCategory = selectedCategory === 'tous';
    if (!matchesCategory) {
      const categoryKeywords = CATEGORY_MAP[selectedCategory] || [];
      matchesCategory = categoryKeywords.some(keyword => 
        p.category?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const sorted = [...processed].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'newest':
      default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [selectedCategory, search, sortBy]);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];
  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);

  const [catOpen, setCatOpen] = useState(true);

  const CategorySidebar = () => (
    <div className="space-y-1">
      <button
        onClick={() => setSelectedCategory('tous')}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
          selectedCategory === 'tous'
            ? 'bg-[#1a6b3c] text-white shadow-sm shadow-[#1a6b3c]/20'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        <span className="flex-1 text-left truncate font-bold">Toutes</span>
        <span className="text-[10px] font-semibold text-gray-400">{products.length}</span>
      </button>
      {catOpen && CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const catCount = products.filter((p) => {
          const keywords = CATEGORY_MAP[cat.id] || [];
          return keywords.some(k => p.category?.toLowerCase().includes(k.toLowerCase()));
        }).length;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#1a6b3c] text-white shadow-sm shadow-[#1a6b3c]/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <span className="flex-1 text-left truncate">{cat.label}</span>
            <span className={`text-[10px] font-semibold ${
              isActive ? 'text-white/70' : 'text-gray-400'
            }`}>
              {catCount}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#f5f8f5] min-h-screen">
      <SEO title="Boutique" description="Explorez notre collection de sacs macramé, sandales, pagnes, accessoires, tissus et vêtements africains fabriqués à la main au Bénin." />
      {/* ===== HERO ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-16 md:py-20 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441653/WhatsApp_Image_2026-05-03_at_13.15.44_e6xbcs.jpg"
          alt="Boutique AFI Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200';
          }}
        />
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
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              La boutique
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto mt-3">
              Toutes nos créations artisanales, en un seul endroit.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== BARRE DE RECHERCHE SOUS LE HERO ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-7 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit par nom ou description…"
              className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl shadow-xl border-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* ===== SIDEBAR FILTRES (DESKTOP) ===== */}
          <aside className="hidden lg:block w-44 shrink-0 self-start">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <FiFilter className="w-3.5 h-3.5 text-[#1a6b3c]" />
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Filtres
                </span>
              </div>

              <div>
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 px-1 py-1.5 mb-1"
                >
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Catégories
                  </span>
                  <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${catOpen ? '' : '-rotate-90'}`} />
                </button>
                <CategorySidebar />
              </div>
            </div>
          </aside>

          {/* ===== FILTRES MOBILE ===== */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 text-[#1a6b3c]" />
                    <h3 className="font-bold text-gray-800">Filtres</h3>
                  </div>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-3">
                  <button
                    onClick={() => setCatOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 py-1.5"
                  >
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Catégories</span>
                    <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${catOpen ? '' : '-rotate-90'}`} />
                  </button>
                </div>
                <CategorySidebar />
              </div>
            </div>
          )}

          {/* ===== CONTENU PRODUITS ===== */}
          <div className="flex-1 min-w-0">
            {/* ===== BARRE D'OUTILS ===== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden p-2 text-gray-500 hover:text-[#1a6b3c] hover:bg-gray-100 rounded-lg transition"
                    aria-label="Filtrer"
                  >
                    <FiTag className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{sorted.length}</span> produit{sorted.length > 1 ? 's' : ''}
                    {selectedCategory !== 'tous' && (
                      <span> dans <span className="text-[#1a6b3c] font-semibold">{selectedCat?.label}</span></span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Tri */}
                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={() => setSortOpen((v) => !v)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a6b3c] font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      <currentSort.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{currentSort.label}</span>
                      <FiChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-fade-in-down">
                        {SORT_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                sortBy === opt.value
                                  ? 'bg-[#1a6b3c]/10 text-[#1a6b3c] font-semibold'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Vue grille/liste */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
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
              </div>
            </div>

            {/* ===== PRODUITS ===== */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Aucun produit trouvé</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('tous'); }}
                  className="mt-4 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-full transition text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'grid-cols-1 gap-4'
              }`}>
                {paginated.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    p === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
