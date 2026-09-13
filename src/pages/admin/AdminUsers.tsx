import { useEffect, useState, useMemo } from 'react';
import { FiTrash2, FiSearch, FiShield, FiUser, FiUserCheck, FiLock } from 'react-icons/fi';
import { adminApi, type AdminUser } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data.users || []);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (targetUser: AdminUser, newRole: string) => {
    if (targetUser.id === currentUser?.id && newRole !== 'admin') {
      if (!confirm('Attention: Vous êtes sur le point de retirer vos propres droits administrateur. Voulez-vous continuer ?')) {
        return;
      }
    }

    setUpdatingId(targetUser.id);
    try {
      await adminApi.updateUser(targetUser.id, { role: newRole });
      toast.success(`Rôle de ${targetUser.name} mis à jour : ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
    } catch (error: any) {
      toast.error(error.message || 'Impossible de modifier le rôle');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer l'utilisateur "${name}" ? Cette action est irréversible.`)) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('Utilisateur supprimé');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((u) => u.role?.toLowerCase() === 'admin').length;
  const userCount = users.filter((u) => u.role?.toLowerCase() !== 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f1f14] tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-xs text-[#0f1f14]/50 mt-1">
            Gérez les comptes inscrits et attribuez les rôles administrateur ({users.length} compte{users.length > 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#0f1f14]/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0f1f14]/50 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou e-mail…"
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-xs text-[#0f1f14] placeholder-[#0f1f14]/40 border border-[#0f1f14]/15 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              roleFilter === 'all'
                ? 'bg-[#4ade80] text-black shadow-xs'
                : 'bg-[#0f1f14]/5 text-[#0f1f14]/60 hover:bg-[#028444]/10'
            }`}
          >
            Tous ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              roleFilter === 'admin'
                ? 'bg-[#4ade80] text-black shadow-xs'
                : 'bg-[#0f1f14]/5 text-[#0f1f14]/60 hover:bg-[#028444]/10'
            }`}
          >
            Administrateurs ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              roleFilter === 'user'
                ? 'bg-[#4ade80] text-black shadow-xs'
                : 'bg-[#0f1f14]/5 text-[#0f1f14]/60 hover:bg-[#028444]/10'
            }`}
          >
            Clients ({userCount})
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl shadow-xs overflow-hidden border border-[#0f1f14]/10">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#0f1f14]/50 animate-pulse">
            Chargement des utilisateurs…
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <FiUser className="w-12 h-12 text-[#0f1f14]/60 mx-auto mb-3" />
            <p className="text-sm font-bold text-[#0f1f14]/70">Aucun utilisateur trouvé</p>
            <p className="text-xs text-[#0f1f14]/50 mt-1">Aucun compte ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[#0f1f14]/50 uppercase tracking-wider border-b border-[#0f1f14]/10 bg-[#f3f6f3]">
                  <th className="px-6 py-4 font-bold">Utilisateur</th>
                  <th className="px-6 py-4 font-bold">Adresse Email</th>
                  <th className="px-6 py-4 font-bold">Rôle actuel</th>
                  <th className="px-6 py-4 font-bold">Modifier le rôle</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0f1f14]/10">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role?.toLowerCase() === 'admin';
                  const isMe = u.id === currentUser?.id;

                  return (
                    <tr key={u.id} className="hover:bg-[#f3f6f3] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAdmin 
                              ? 'bg-[#028444] text-white shadow-sm'
                              : 'bg-[#4ade80]/15 text-[#028444]'
                          }`}>
                            {u.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-[#0f1f14] text-xs flex items-center gap-1.5">
                              <span>{u.name || 'Utilisateur'}</span>
                              {isMe && (
                                <span className="bg-[#4ade80]/15 text-[#028444] text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                  Vous
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#0f1f14]/50">
                              Membre depuis {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-[#0f1f14]/60">
                        {u.email}
                      </td>

                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-bold">
                            <FiShield className="w-3 h-3 text-purple-600" />
                            Administrateur
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#0f1f14]/5 text-[#0f1f14]/60 border border-[#0f1f14]/10 px-2.5 py-1 rounded-full text-xs font-medium">
                            <FiUserCheck className="w-3 h-3 text-[#0f1f14]/50" />
                            Client
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={u.role || 'user'}
                          disabled={updatingId === u.id}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ade80]/30 ${
                            isAdmin 
                              ? 'bg-purple-50 border-purple-200 text-purple-700' 
                              : 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#028444]'
                          }`}
                        >
                          <option value="user">👤 Client (User)</option>
                          <option value="admin">👑 Administrateur</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {!isAdmin ? (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-2 text-[#0f1f14]/50 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Supprimer l'utilisateur"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#0f1f14]/50 inline-flex items-center gap-1">
                            <FiLock className="w-3 h-3" /> Protegé
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

