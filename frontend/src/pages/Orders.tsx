import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type Order } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  SHIPPED: 'bg-lime/20 text-lime',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.orders.list()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className='text-center py-20'>
        <h2 className='text-2xl font-bold text-theme-primary mb-4'>Please log in</h2>
        <Link to='/login?redirect=/orders' className='px-6 py-2 bg-lime text-black font-bold rounded-lg'>Login</Link>
      </div>
    );
  }

  if (loading) return <div className='text-center py-20 text-steel'>Loading orders...</div>;
  if (orders.length === 0) return <div className='text-center py-20 text-steel'>No orders yet.</div>;

  return (
    <div>
      <h1 className='text-3xl font-bold text-theme-primary mb-8'>My Orders</h1>
      <div className='space-y-4'>
        {orders.map(order => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className='block p-4 rounded-xl border border-steel/20 bg-theme-card hover:border-lime/50 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-steel'>Order #{order.id.slice(0, 8)}</p>
                <p className='text-theme-primary font-bold'>{order.shippingName}</p>
                {order.isCustomOrder && <span className='text-xs text-lime'>Custom Order</span>}
              </div>
              <div className='text-right'>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-steel/20 text-steel'}`}>
                  {order.status}
                </span>
                <p className='text-lime font-bold mt-1'>${order.total.toFixed(2)}</p>
              </div>
            </div>
            <p className='text-xs text-steel-dark mt-2'>{new Date(order.createdAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
