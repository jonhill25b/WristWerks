import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, type Product, type Order, type User } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    Promise.all([api.products.list(), api.orders.list(), api.users.list()]).then(([products, orders, users]) => {
      setStats({ products: products.length, orders: orders.length, users: users.length, pendingOrders: orders.filter((o: Order) => o.status === 'PENDING').length });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (user?.role !== 'ADMIN') return <Navigate to='/' replace />;

  const cards = [
    { label: 'Products', value: stats.products, to: '/admin/products', color: 'text-lime' },
    { label: 'Orders', value: stats.orders, to: '/admin/orders', color: 'text-blue-400' },
    { label: 'Users', value: stats.users, to: '/admin/users', color: 'text-purple-400' },
    { label: 'Pending Orders', value: stats.pendingOrders, to: '/admin/orders', color: 'text-yellow-400' },
  ];

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8 text-theme-primary'>Admin Dashboard</h1>
      {loading ? (
        <div className='text-steel'>Loading stats...</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cards.map(card => (
            <Link key={card.label} to={card.to} className='p-6 rounded-xl border hover:border-lime/50 transition-colors border-theme bg-theme-card'>
              <p className='text-sm text-steel'>{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </Link>
          ))}
        </div>
      )}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Link to='/admin/products' className='p-4 rounded-lg border hover:border-lime/50 transition-colors border-theme'>
          <h3 className='font-bold text-theme-primary'>Manage Products</h3>
          <p className='text-sm text-steel mt-1'>Add, edit, and remove products</p>
        </Link>
        <Link to='/admin/orders' className='p-4 rounded-lg border hover:border-lime/50 transition-colors border-theme'>
          <h3 className='font-bold text-theme-primary'>Manage Orders</h3>
          <p className='text-sm text-steel mt-1'>View and update order status</p>
        </Link>
        <Link to='/admin/users' className='p-4 rounded-lg border hover:border-lime/50 transition-colors border-theme'>
          <h3 className='font-bold text-theme-primary'>Manage Users</h3>
          <p className='text-sm text-steel mt-1'>View and manage user accounts</p>
        </Link>
      </div>
    </div>
  );
}
