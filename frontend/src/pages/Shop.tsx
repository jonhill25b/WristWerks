import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type Product } from '../lib/api.js';
import { useCart } from '../store/cart.js';
import { useAuth } from '../context/AuthContext.js';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.products.list(
      category !== 'all' ? { category: category === 'custom' ? 'custom' : 'pre-made' } : undefined
    )
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
        <h1 className='text-3xl font-bold text-theme-primary'>Shop</h1>
        <div className='flex gap-3'>
          <input
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary placeholder-steel-dark focus:border-lime focus:outline-none'
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className='px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary focus:border-lime focus:outline-none'
          >
            <option value='all'>All</option>
            <option value='pre-made'>Pre-Made</option>
            <option value='custom'>Custom</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className='text-center py-20 text-steel'>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className='text-center py-20 text-steel'>No products found.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map(product => (
            <div
              key={product.id}
              className='rounded-xl border border-steel/20 bg-theme-card overflow-hidden hover:border-lime/50 transition-colors group'
            >
              <Link to={`/shop/${product.id}`} className='block'>
                <div className='aspect-square bg-theme-input flex items-center justify-center overflow-hidden'>
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    />
                  ) : (
                    <svg className='w-16 h-16 text-steel-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                    </svg>
                  )}
                </div>
              </Link>
              <div className='p-4'>
                <Link to={`/shop/${product.id}`}>
                  <h3 className='font-bold text-theme-primary group-hover:text-lime transition-colors'>
                    {product.name}
                  </h3>
                </Link>
                <p className='text-sm text-theme-secondary mt-1 line-clamp-2'>
                  {product.description}
                </p>
                <div className='flex items-center justify-between mt-3'>
                  <span className='text-lg font-bold text-lime'>
                    {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Custom'}
                  </span>
                  {product.category !== 'custom' && (
                    <button
                      onClick={(e) => { e.preventDefault(); addItem(product); }}
                      className='px-3 py-1 text-sm bg-lime text-black font-medium rounded hover:bg-lime-dark transition-colors'
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
