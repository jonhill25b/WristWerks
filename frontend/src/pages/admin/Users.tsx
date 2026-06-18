import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api, type User } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.users.list().then(setUsers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== 'ADMIN') return <Navigate to='/' replace />;

  const toggleRole = async (u: User) => {
    const newRole = u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Change ${u.email} to ${newRole}?`)) return;
    try { await api.users.update(u.id, { role: newRole }); load(); } catch (err) { console.error(err); alert('Failed to update user'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try { await api.users.delete(id); load(); } catch (err) { console.error(err); alert('Failed to delete'); }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8 text-theme-primary'>Users</h1>
      {loading ? (
        <div className='text-steel'>Loading...</div>
      ) : (
        <div className='space-y-3'>
          {users.map(u => (
            <div key={u.id} className='flex items-center gap-4 p-4 rounded-xl border border-theme bg-theme-card'>
              <div className='flex-1 min-w-0'>
                <p className='font-bold text-theme-primary'>{u.firstName} {u.lastName}</p>
                <p className='text-sm text-steel'>{u.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-lime/20 text-lime' : 'bg-steel/20 text-steel'}`}>{u.role}</span>
              <div className='flex gap-2'>
                <button onClick={() => toggleRole(u)} className='px-3 py-1 text-sm border border-theme text-steel rounded hover:border-lime hover:text-lime transition-colors'>{u.role === 'ADMIN' ? 'Make Customer' : 'Make Admin'}</button>
                {u.id !== user!.id && (
                  <button onClick={() => handleDelete(u.id)} className='px-3 py-1 text-sm border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors'>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
