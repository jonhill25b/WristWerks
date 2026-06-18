import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, type Product } from '../lib/api.js';
import { useCart } from '../store/cart.js';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      api.products.get(id)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className='text-center py-20 text-steel'>Loading...</div>;
  if (!product) return <div className='text-center py-20 text-steel'>Product not found.</div>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
      {/* Image */}
      <div className='aspect-square bg-theme-input rounded-xl flex items-center justify-center overflow-hidden border border-steel/20'>
        {product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className='w-full h-full object-cover' />
        ) : (
          <svg className='w-24 h-24 text-steel-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
          </svg>
        )}
      </div>

      {/* Details */}
      <div>
        <Link to='/shop' className='text-sm text-steel hover:text-lime transition-colors'>
          &larr; Back to Shop
        </Link>
        <h1 className='text-3xl font-bold text-theme-primary mt-2'>{product.name}</h1>
        <p className='text-2xl font-bold text-lime mt-2'>${product.price.toFixed(2)}</p>
        <p className='text-theme-secondary mt-4 leading-relaxed'>{product.description}</p>

        <div className='mt-6 flex items-center gap-4'>
          <label className='text-sm text-steel'>Qty:</label>
          <div className='flex items-center border border-theme rounded-lg'>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className='px-3 py-1 text-steel hover:text-lime transition-colors'
            >
              -
            </button>
            <span className='px-4 text-theme-primary'>{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className='px-3 py-1 text-steel hover:text-lime transition-colors'
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => addItem(product, qty)}
          className='mt-6 w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'
        >
          Add to Cart
        </button>

        <div className='mt-6 text-sm text-steel'>
          <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          <p className='mt-1'>Category: {product.category}</p>
        </div>
      </div>
    </div>
  );
}
