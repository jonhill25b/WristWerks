import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api, type Order } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  SHIPPED: 'bg-lime/20 text-lime',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    api.orders.list().then(setOrders).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== 'ADMIN') return <Navigate to='/' replace />;

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.orders.updateStatus(id, status);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const selectCls = 'px-4 py-2 rounded-lg border border-theme focus:border-lime focus:outline-none bg-theme-input text-theme-primary';

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-theme-primary'>Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className={selectCls}>
          <option value='ALL'>All Orders</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className='text-steel'>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className='text-steel'>No orders found.</div>
      ) : (
        <div className='space-y-4'>
          {filtered.map(order => (
            <div key={order.id} className='p-4 rounded-xl border border-steel/20 bg-theme-card'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div>
                  <p className='text-sm text-steel'>#{order.id.slice(0, 8)} | {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className='font-bold text-theme-primary'>{order.shippingName}</p>
                  {order.user && <p className='text-xs text-steel'>{order.user.email}</p>}
                  {order.isCustomOrder && <span className='text-xs text-lime'>Custom Order</span>}
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-lime font-bold'>${order.total.toFixed(2)}</span>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${STATUS_COLORS[order.status]}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className='mt-2 text-sm text-steel'>
                {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
              </div>
              {order.isCustomOrder && order.customConfig && (
                <pre className='mt-2 text-xs text-steel-dark overflow-x-auto bg-black/30 p-2 rounded'>
                  {JSON.stringify(order.customConfig, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
