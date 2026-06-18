import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api, type Product } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: 'pre-made' });

  const load = () => {
    setLoading(true);
    api.products.list().then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== 'ADMIN') return <Navigate to='/' replace />;

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('stock', form.stock);
    data.append('category', form.category);
    try {
      if (editing) {
        await api.products.update(editing.id, data);
      } else {
        await api.products.create(data);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', stock: '', category: 'pre-made' });
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({ name: product.name, description: product.description, price: String(product.price), stock: String(product.stock), category: product.category });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await api.products.delete(id); load(); } catch (err) { console.error(err); alert('Failed to delete'); }
  };

  const inputCls = 'w-full px-4 py-2 rounded-lg border border-theme focus:border-lime focus:outline-none bg-theme-input text-theme-primary placeholder-steel-dark';

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-theme-primary'>Products</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', price: '', stock: '', category: 'pre-made' }); }} className='px-4 py-2 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>+ Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='mb-8 p-6 rounded-xl border border-lime/30 bg-theme-card space-y-4'>
          <h3 className='font-bold text-theme-primary'>{editing ? 'Edit Product' : 'New Product'}</h3>
          <input required placeholder='Product Name' value={form.name} onChange={e => update('name', e.target.value)} className={inputCls} />
          <textarea required placeholder='Description' value={form.description} onChange={e => update('description', e.target.value)} rows={3} className={inputCls} />
          <div className='grid grid-cols-3 gap-3'>
            <input type='number' step='0.01' required placeholder='Price' value={form.price} onChange={e => update('price', e.target.value)} className={inputCls} />
            <input type='number' required placeholder='Stock' value={form.stock} onChange={e => update('stock', e.target.value)} className={inputCls} />
            <select value={form.category} onChange={e => update('category', e.target.value)} className={inputCls}>
              <option value='pre-made'>Pre-Made</option>
              <option value='custom'>Custom</option>
            </select>
          </div>
          <div className='flex gap-3'>
            <button type='submit' className='px-6 py-2 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>{editing ? 'Update' : 'Create'}</button>
            <button type='button' onClick={() => setShowForm(false)} className='px-6 py-2 border border-theme text-steel rounded-lg hover:border-steel transition-colors'>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='text-steel'>Loading...</div>
      ) : (
        <div className='space-y-3'>
          {products.filter(p => p.category !== 'custom').map(product => (
            <div key={product.id} className='flex items-center gap-4 p-4 rounded-xl border border-theme bg-theme-card'>
              <div className='w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-theme-input'>
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className='w-full h-full object-cover' />
                ) : (
                  <svg className='w-6 h-6 text-steel-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                  </svg>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-bold truncate text-theme-primary'>{product.name}</h3>
                <p className='text-sm text-steel'>${product.price.toFixed(2)} | Stock: {product.stock}</p>
              </div>
              <div className='flex gap-2'>
                <button onClick={() => handleEdit(product)} className='px-3 py-1 text-sm border border-theme text-steel rounded hover:border-lime hover:text-lime transition-colors'>Edit</button>
                <button onClick={() => handleDelete(product.id)} className='px-3 py-1 text-sm border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors'>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
