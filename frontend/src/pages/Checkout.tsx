import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart.js';
import { api } from '../lib/api.js';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    paymentMethod: 'cashapp',
    note: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await api.orders.create({
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        ...form,
      });
      clear();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-2 rounded-lg border border-theme focus:border-lime focus:outline-none bg-theme-input text-theme-primary placeholder-steel-dark';

  if (items.length === 0) {
    return (
      <div className='text-center py-20'>
        <h2 className='text-2xl font-bold mb-4 text-theme-primary'>No items to checkout</h2>
        <button onClick={() => navigate('/shop')} className='px-6 py-2 bg-lime text-black font-bold rounded-lg'>Go to Shop</button>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8 text-theme-primary'>Checkout</h1>

      <div className='mb-8 p-4 rounded-xl border border-steel/20 bg-theme-card'>
        <h3 className='font-bold mb-3 text-theme-primary'>Order Summary</h3>
        {items.map(item => (
          <div key={item.product.id} className='flex justify-between text-sm py-1'>
            <span className='text-steel'>{item.product.name} x{item.quantity}</span>
            <span className='text-white'>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className='border-t border-steel/20 mt-2 pt-2 flex justify-between font-bold'>
          <span className='text-white'>Total</span>
          <span className='text-lime'>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='font-bold text-theme-primary'>Shipping Information</h3>
        <input required placeholder='Full Name' value={form.shippingName} onChange={e => update('shippingName', e.target.value)} className={inputCls} />
        <input required placeholder='Address' value={form.shippingAddress} onChange={e => update('shippingAddress', e.target.value)} className={inputCls} />
        <div className='grid grid-cols-3 gap-3'>
          <input required placeholder='City' value={form.shippingCity} onChange={e => update('shippingCity', e.target.value)} className={inputCls} />
          <input required placeholder='State' value={form.shippingState} onChange={e => update('shippingState', e.target.value)} className={inputCls} />
          <input required placeholder='ZIP' value={form.shippingZip} onChange={e => update('shippingZip', e.target.value)} className={inputCls} />
        </div>

        <h3 className='font-bold pt-4 text-theme-primary'>Payment Method</h3>
        <select value={form.paymentMethod} onChange={e => update('paymentMethod', e.target.value)} className={inputCls}>
          <option value='cashapp'>CashApp</option>
          <option value='venmo'>Venmo</option>
          <option value='paypal'>PayPal</option>
          <option value='other'>Other (specify in notes)</option>
        </select>

        {form.paymentMethod === 'cashapp' && (
          <div className='p-4 rounded-lg bg-lime/10 border border-lime/30'>
            <p className='text-sm text-theme-primary'>
              <strong>Payment Instructions:</strong> After placing your order, please send payment via CashApp.
            </p>
          </div>
        )}

        <textarea placeholder='Notes (optional)' value={form.note} onChange={e => update('note', e.target.value)} rows={3} className={inputCls} />

        <button type='submit' disabled={submitting} className='w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors disabled:opacity-50'>
          {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
