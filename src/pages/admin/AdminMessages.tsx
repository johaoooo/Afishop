import { useEffect, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { adminApi } from '../../services/api/modules/admin';
import toast from 'react-hot-toast';

export function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await adminApi.getMessages());
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (m: any) => {
    setSelected(m);
    if (!m.read) {
      try {
        await adminApi.markMessageAsRead(m.id);
        setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, read: true } : msg)));
      } catch {
        // silencieux
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Messages</h1>
        <p className="text-sm text-gray-400 mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
          {unreadCount > 0 && <span className="text-red-500 font-semibold"> · {unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-400 px-5 py-6">Chargement...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-6">Aucun message pour l'instant.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${selected?.id === m.id ? 'bg-green-50' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {m.read ? <FiMail className="w-3.5 h-3.5 text-gray-300 shrink-0" /> : <FiMail className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" />}
                  <p className={`text-sm truncate ${m.read ? 'text-gray-600' : 'font-bold text-gray-800'}`}>{m.name}</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{m.subject || m.message}</p>
                <p className="text-[10px] text-gray-300 mt-1">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</p>
              </button>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {!selected ? (
            <p className="text-sm text-gray-400">Sélectionnez un message pour le lire.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-800">{selected.name}</p>
                  <p className="text-sm text-gray-400">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
                </div>
                <p className="text-xs text-gray-300">{new Date(selected.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              {selected.subject && <p className="text-sm font-semibold text-gray-600">Sujet : {selected.subject}</p>}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-4">{selected.message}</p>
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Répondre par email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
