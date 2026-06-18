import { Link } from 'react-router-dom';
import { useCart } from '../store/cart.js';
import { useAuth } from '../context/AuthContext.js';

export default function Cart() {
  const { items, removeItem, updateQty, total, clear } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className='text-center py-20'>
        <svg className='w-16 h-16 text-steel-dark mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' />
        </svg>
        <h2 className='text-2xl font-bold mb-2 text-theme-primary'>Your cart is empty</h2>
        <p className='text-steel mb-6'>Browse our shop to find something you like.</p>
        <Link to='/shop' className='px-6 py-2 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>Go to Shop</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-8 text-theme-primary'>Cart</h1>
      <div className='space-y-4'>
        {items.map(item => (
          <div key={item.product.id} className='flex items-center gap-4 p-4 rounded-xl border border-theme bg-theme-card'>
            <div className='w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-theme-input'>
              {item.product.images.length > 0 ? (
                <img src={item.product.images[0]} alt={item.product.name} className='w-full h-full object-cover' />
              ) : (
                <svg className='w-8 h-8 text-steel-dark' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                </svg>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-bold truncate text-theme-primary'>{item.product.name}</h3>
              <p className='text-lime font-medium'>${item.product.price.toFixed(2)}</p>
            </div>
            <div className='flex items-center border border-theme rounded-lg'>
              <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className='px-3 py-1 text-steel hover:text-lime'>-</button>
              <span className='px-3 text-theme-primary'>{item.quantity}</span>
              <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className='px-3 py-1 text-steel hover:text-lime'>+</button>
            </div>
            <p className='font-bold w-20 text-right text-theme-primary'>${(item.product.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.product.id)} className='text-steel-dark hover:text-red-500 transition-colors'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <button onClick={clear} className='text-sm text-steel-dark hover:text-red-500 transition-colors'>Clear Cart</button>
        <div className='flex items-center gap-6'>
          <span className='text-xl font-bold text-theme-primary'>Total: <span className='text-lime'>${total.toFixed(2)}</span></span>
          {user ? (
            <Link to='/checkout' className='px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>Checkout</Link>
          ) : (
            <Link to='/login?redirect=/checkout' className='px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>Login to Checkout</Link>
          )}
        </div>
      </div>
    </div>
  );
}
