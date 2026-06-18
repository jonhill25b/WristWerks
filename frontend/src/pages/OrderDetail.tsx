import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, type Order } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  SHIPPED: 'bg-lime/20 text-lime',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id || !user) return;
    api.orders.get(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  if (!user) return <div className='text-center py-20 text-steel'>Please log in.</div>;
  if (loading) return <div className='text-center py-20 text-steel'>Loading...</div>;
  if (!order) return <div className='text-center py-20 text-steel'>Order not found.</div>;

  return (
    <div>
      <Link to='/orders' className='text-sm text-steel hover:text-lime transition-colors'>&larr; Back to Orders</Link>

      <div className='mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-theme-primary'>
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className='text-sm text-steel mt-1'>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] || 'bg-steel/20 text-steel'}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className='mt-8 p-4 rounded-xl border border-steel/20 bg-theme-card'>
        <h3 className='font-bold text-theme-primary mb-3'>Items</h3>
        {order.items.map(item => (
          <div key={item.id} className='flex justify-between py-2 border-b border-steel/10 last:border-0'>
            <div>
              <p className='text-theme-primary'>{item.name}</p>
              <p className='text-sm text-steel'>Qty: {item.quantity}</p>
            </div>
            <p className='text-lime font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className='border-t border-steel/20 mt-2 pt-2 flex justify-between font-bold'>
          <span className='text-theme-primary'>Total</span>
          <span className='text-lime'>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className='mt-6 p-4 rounded-xl border border-steel/20 bg-theme-card'>
        <h3 className='font-bold text-theme-primary mb-3'>Shipping</h3>
        <p className='text-steel'>{order.shippingName}</p>
        <p className='text-steel'>{order.shippingAddress}</p>
        <p className='text-steel'>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
      </div>

      {/* Custom Order Details */}
      {order.isCustomOrder && order.customConfig && (
        <div className='mt-6 p-4 rounded-xl border border-lime/30 bg-lime/5'>
          <h3 className='font-bold text-lime mb-3'>Custom Order Details</h3>
          <pre className='text-sm text-steel overflow-x-auto'>
            {JSON.stringify(order.customConfig, null, 2)}
          </pre>
        </div>
      )}

      {/* Payment */}
      <div className='mt-6 p-4 rounded-xl border border-steel/20 bg-theme-card'>
        <h3 className='font-bold text-theme-primary mb-2'>Payment</h3>
        <p className='text-steel'>Method: {order.paymentMethod}</p>
        {order.note && <p className='text-steel mt-1'>Note: {order.note}</p>}
      </div>
    </div>
  );
}
