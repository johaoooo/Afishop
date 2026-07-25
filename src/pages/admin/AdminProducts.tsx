import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBox, FiAlertTriangle, FiTag } from 'react-icons/fi';
import { adminApi, type Product } from '../../lib/api';
import toast from 'react-hot-toast';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('toutes');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products || []);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Produit supprimé');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.category) set.add(p.category.toLowerCase()); });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'toutes' || p.category?.toLowerCase() === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Catalogue des produits</h1>
          <p className="text-xs text-gray-400 mt-1">
            Gérez vos articles en vente ({products.length} référence{products.length > 1 ? 's' : ''})
          </p>
        </div>
        <Link
          to="/admin/produits/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-[#1a6b3c]/20 hover:scale-102 shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          Ajouter un nouveau produit
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou description…"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-xs text-gray-900 placeholder-gray-400 border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-400 font-medium shrink-0">Catégorie:</span>
          <button
            onClick={() => setCategoryFilter('toutes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              categoryFilter === 'toutes'
                ? 'bg-[#1a6b3c] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(p => p.category?.toLowerCase() === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition ${
                  categoryFilter === cat
                    ? 'bg-[#1a6b3c] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl shadow-xs overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
            Chargement du catalogue produit…
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <FiBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-700">Aucun produit trouvé</p>
            <p className="text-xs text-gray-400 mt-1">Essayez de modifier votre recherche ou ajoutez un nouveau produit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 font-bold">Produit</th>
                  <th className="px-6 py-4 font-bold">Catégorie</th>
                  <th className="px-6 py-4 font-bold">Prix</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60 relative">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100';
                            }} 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-[#1a6b3c] transition-colors">{p.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{p.description || 'Aucune description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#1a6b3c] px-2.5 py-1 rounded-lg text-xs font-semibold capitalize">
                        <FiTag className="w-3 h-3" />
                        {p.category || 'Général'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 font-mono text-sm">
                      {p.price.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4">
                      {p.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">
                          Épuisé
                        </span>
                      ) : p.stock <= 3 ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
                          <FiAlertTriangle className="w-3 h-3" />
                          {p.stock} restant{p.stock > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#1a6b3c] border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          {p.stock} en stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/produits/${p.id}/modifier`} 
                          className="p-2 text-gray-500 hover:text-[#1a6b3c] hover:bg-emerald-50 rounded-xl transition"
                          title="Modifier"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)} 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

