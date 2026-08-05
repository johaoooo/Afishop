import SEO from '../components/SEO';
import { useEffect, useState, useRef, useMemo, type FC } from 'react';
import { 
  FiSearch, FiGrid, FiList, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiTag, FiArrowUp, FiArrowDown, FiX, FiFilter, FiRotateCcw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, type Product } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

interface SortOption {
  value: string;
  label: string;
  icon: FC<{ className?: string }>;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Nouveautés', icon: FiChevronDown },
  { value: 'price-asc', label: 'Prix croissant', icon: FiArrowUp },
  { value: 'price-desc', label: 'Prix décroissant', icon: FiArrowDown },
  { value: 'name-asc', label: 'Nom A-Z', icon: FiArrowUp },
  { value: 'name-desc', label: 'Nom Z-A', icon: FiArrowDown },
];

interface CategoryItem {
  id: string;
  label: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'macrame-tricot', label: 'Macramé & Tricotage' },
  { id: 'teinture-pagne', label: 'Teinture de Pagne' },
  { id: 'decoration-artisanale', label: 'Décoration Artisanale' },
  { id: 'mode-accessoires', label: 'Mode & Accessoires' },
  { id: 'sesame', label: 'Sésame' },
  { id: 'soja', label: 'Soja' },
];

const CATEGORY_MAP: Record<string, string[]> = {
  'macrame-tricot': ['macramé', 'macrame', 'tricot', 'tricotage', 'porte-clés', 'porte cle', 'panier', 'set de table'],
  'teinture-pagne': ['teinture', 'pagne', 'motif traditionnel'],
  'decoration-artisanale': ['décoration', 'decoration', 'artisanale', 'cadre', 'rideau', 'centre de table'],
  'mode-accessoires': ['mode', 'accessoire', 'accessoires', 'sac', 'valise', 'chaussure', 'pagne tissé'],
  'sesame': ['sésame', 'sesame', 'chips', 'épice', 'farine'],
  'soja': ['soja', 'farine', 'épice', 'produit dérivé'],
};

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  products: Product[];
  catOpen: boolean;
}

const CategorySidebarContent: FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
  catOpen,
}) => {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectCategory('tous')}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
          selectedCategory === 'tous'
            ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${selectedCategory === 'tous' ? 'bg-white' : 'bg-gray-400'}`} />
        <span className="flex-1 text-left truncate">Toutes les catégories</span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
          selectedCategory === 'tous' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {products.length}
        </span>
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
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#1a6b3c] text-white shadow-md shadow-[#1a6b3c]/20 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-gray-300'}`} />
            <span className="flex-1 text-left truncate">{cat.label}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {catCount}
            </span>
          </button>
        );
      })}
    </div>
  );
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
  const [catOpen, setCatOpen] = useState(true);
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

  const processed = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, selectedCategory, search]);

  const sorted = useMemo(() => {
    return [...processed].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'newest':
        default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
  }, [processed, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [selectedCategory, search, sortBy]);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];
  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);
  const hasActiveFilters = selectedCategory !== 'tous' || search !== '';

  const handleResetFilters = () => {
    setSelectedCategory('tous');
    setSearch('');
  };

  return (
    <div className="bg-[#f5f8f5] min-h-screen">
      <SEO 
        title="Boutique" 
        description="Découvrez nos créations artisanales : macramé, tricotage, teinture de pagne, décoration artisanale, mode et accessoires, et produits agroalimentaires (sésame, soja). AFI Collection — l'élégance artisanale au service de la tradition." 
      />

      {/* ===== HERO ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-12 sm:py-16 md:py-28 overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-7 relative z-30">
        <div className="max-w-2xl mx-auto relative">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl shadow-xl border-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Effacer la recherche"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto h-max z-20 transition-all">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                    Filtres
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs text-[#1a6b3c] hover:text-[#14532d] font-semibold transition"
                    title="Réinitialiser tous les filtres"
                  >
                    <FiRotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="space-y-2 pb-3 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filtres actifs</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategory !== 'tous' && (
                      <span className="inline-flex items-center gap-1 bg-[#1a6b3c]/10 text-[#1a6b3c] text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {selectedCat?.label}
                        <button onClick={() => setSelectedCategory('tous')} className="hover:text-red-600">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {search !== '' && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        "{search}"
                        <button onClick={() => setSearch('')} className="hover:text-red-600">
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 pb-2 mb-1"
                >
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Catégories
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${catOpen ? '' : '-rotate-90'}`} />
                </button>
                <CategorySidebarContent
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  products={products}
                  catOpen={catOpen}
                />
              </div>
            </div>
          </aside>

          <AnimatePresence>
            {mobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileFilterOpen(false)} 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-80 max-w-[85vw] bg-white shadow-2xl h-full flex flex-col z-10 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <FiFilter className="w-5 h-5 text-[#1a6b3c]" />
                      <h3 className="font-bold text-gray-900 text-base">Filtres</h3>
                    </div>
                    <button 
                      onClick={() => setMobileFilterOpen(false)} 
                      className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/50 transition"
                      aria-label="Fermer"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 overflow-y-auto space-y-6">
                    {hasActiveFilters && (
                      <div className="flex items-center justify-between bg-[#1a6b3c]/5 p-3 rounded-xl">
                        <span className="text-xs font-bold text-[#1a6b3c]">Filtres actifs</span>
                        <button
                          onClick={handleResetFilters}
                          className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <FiRotateCcw className="w-3 h-3" />
                          Réinitialiser
                        </button>
                      </div>
                    )}
                    <div>
                      <button
                        onClick={() => setCatOpen((v) => !v)}
                        className="w-full flex items-center justify-between gap-2 py-2 mb-2"
                      >
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catégories</span>
                        <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${catOpen ? '' : '-rotate-90'}`} />
                      </button>
                      <CategorySidebarContent
                        selectedCategory={selectedCategory}
                        onSelectCategory={(id) => {
                          setSelectedCategory(id);
                          setMobileFilterOpen(false);
                        }}
                        products={products}
                        catOpen={catOpen}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-[#1a6b3c]/10 hover:text-[#1a6b3c] rounded-xl transition"
                    aria-label="Filtrer"
                  >
                    <FiTag className="w-4 h-4 text-[#1a6b3c]" />
                    <span>Filtres</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{sorted.length}</span> produit{sorted.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={() => setSortOpen((v) => !v)}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a6b3c] font-medium px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <currentSort.icon className="w-4 h-4 text-[#1a6b3c]" />
                      <span className="hidden sm:inline">{currentSort.label}</span>
                      <FiChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30">
                        {SORT_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${sortBy === opt.value ? 'bg-[#1a6b3c]/10 text-[#1a6b3c] font-semibold' : 'text-gray-600'}`}
                            >
                              <Icon className="w-4 h-4" />
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1a6b3c]' : 'text-gray-400'}`}>
                      <FiGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1a6b3c]' : 'text-gray-400'}`}>
                      <FiList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-2"><div className="h-3 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/3" /></div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <FiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Aucun produit trouvé</h3>
                <button onClick={handleResetFilters} className="mt-5 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-2.5 rounded-full transition text-sm">
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6' : 'grid-cols-1 gap-4'}`}>
                {paginated.map((p, index) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.04 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition">
              <FiChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${p === page ? 'bg-[#1a6b3c] text-white shadow-md' : 'border border-gray-200 bg-white text-gray-700'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
