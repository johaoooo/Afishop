import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { adminApi, type Product } from '../../lib/api';
import toast from 'react-hot-toast';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Produits</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} au catalogue</p>
        </div>
        <Link
          to="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 px-5 py-6">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-6">Aucun produit pour l'instant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Produit</th>
                <th className="px-5 py-3 font-semibold">Catégorie</th>
                <th className="px-5 py-3 font-semibold">Prix</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800 font-mono">{p.price.toLocaleString('fr-FR')} F</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono ${p.stock <= 3 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/produits/${p.id}/modifier`} className="p-2 text-gray-400 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
