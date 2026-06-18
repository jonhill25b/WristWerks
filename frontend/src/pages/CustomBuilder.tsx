import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../lib/api.js';

const PARACORD_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'OD Green', hex: '#4B5320' },
  { name: 'Coyote Brown', hex: '#81613C' },
  { name: 'Navy Blue', hex: '#1B2A4A' },
  { name: 'Red', hex: '#8B0000' },
  { name: 'Orange', hex: '#CC5500' },
  { name: 'Purple', hex: '#4B0082' },
  { name: 'Pink', hex: '#C71585' },
  { name: 'Yellow', hex: '#CCCC00' },
  { name: 'White', hex: '#E8E8E8' },
  { name: 'Gray', hex: '#696969' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Camo Green', hex: '#4B5320' },
  { name: 'Camo Brown', hex: '#5C4033' },
  { name: 'Tiger Stripe', hex: '#CC5500' },
  { name: 'Multicam', hex: '#7B6B5A' },
  { name: 'Ranger Green', hex: '#4E5C3A' },
];

const WEAVE_STYLES = [
  { name: 'Cobra', desc: 'Classic cobra weave — the most popular style' },
  { name: 'Solomon Bar', desc: 'Flat, clean look with a distinctive pattern' },
  { name: 'Snake', desc: 'Sleek, rounded design that stands out' },
  { name: 'Fishtail', desc: 'Unique fishtail pattern for a bold look' },
  { name: 'Two-Strand', desc: 'Simple and elegant two-strand twist' },
];

const CHARM_OPTIONS = [
  { name: 'None', price: 0 },
  { name: 'Military Star', price: 3 },
  { name: 'Cross', price: 3 },
  { name: 'Skull', price: 4 },
  { name: 'Compass', price: 5 },
  { name: 'Dog Tag', price: 6 },
  { name: 'Anchor', price: 4 },
  { name: 'Lightning Bolt', price: 3 },
  { name: 'Heart', price: 3 },
  { name: 'Paw Print', price: 4 },
];

export default function CustomBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [primaryColor, setPrimaryColor] = useState(PARACORD_COLORS[0]);
  const [secondaryColor, setSecondaryColor] = useState(PARACORD_COLORS[1]);
  const [weaveStyle, setWeaveStyle] = useState(WEAVE_STYLES[0]);
  const [selectedCharms, setSelectedCharms] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const basePrice = 20;
  const charmPrice = selectedCharms.reduce((sum, name) => {
    const charm = CHARM_OPTIONS.find(c => c.name === name);
    return sum + (charm?.price || 0);
  }, 0);
  const totalPrice = basePrice + charmPrice;

  const toggleCharm = (name: string) => {
    if (name === 'None') {
      setSelectedCharms([]);
      return;
    }
    setSelectedCharms(prev => {
      const filtered = prev.filter(c => c !== 'None');
      if (filtered.includes(name)) return filtered.filter(c => c !== name);
      return [...filtered, name];
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login?redirect=/custom');
      return;
    }

    setSubmitting(true);
    try {
      const customConfig = {
        primaryColor: primaryColor.name,
        primaryHex: primaryColor.hex,
        secondaryColor: secondaryColor.name,
        secondaryHex: secondaryColor.hex,
        weaveStyle: weaveStyle.name,
        charms: selectedCharms.filter(c => c !== 'None'),
      };

      await api.orders.create({
        items: [{
          name: `Custom Bracelet — ${weaveStyle.name}, ${primaryColor.name}/${secondaryColor.name}`,
          quantity: 1,
          price: totalPrice,
        }],
        shippingName: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        isCustomOrder: true,
        customConfig,
        note: `Custom build: ${weaveStyle.name} weave, ${primaryColor.name} primary / ${secondaryColor.name} secondary, charms: ${selectedCharms.join(', ') || 'none'}`,
      });

      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Failed to submit custom order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPrimaryBtnCls = (c: typeof PARACORD_COLORS[0]) =>
    `w-10 h-10 rounded-lg border-2 transition-all ${primaryColor.name === c.name ? 'border-lime scale-110' : 'border-theme hover:border-steel'}`;

  const getSecondaryBtnCls = (c: typeof PARACORD_COLORS[0]) =>
    `w-10 h-10 rounded-lg border-2 transition-all ${secondaryColor.name === c.name ? 'border-lime scale-110' : 'border-theme hover:border-steel'}`;

  const getWeaveBtnCls = (w: typeof WEAVE_STYLES[0]) =>
    `p-4 rounded-lg border text-left transition-colors ${weaveStyle.name === w.name ? 'border-lime bg-lime/10' : 'border-steel/20 hover:border-steel/50'}`;

  const getCharmBtnCls = (charm: typeof CHARM_OPTIONS[0]) =>
    `p-3 rounded-lg border text-left transition-colors ${(selectedCharms.includes(charm.name) || (charm.name === 'None' && selectedCharms.length === 0)) ? 'border-lime bg-lime/10' : 'border-steel/20 hover:border-steel/50'}`;

  return (
    <div>
      <h1 className='text-3xl font-bold text-theme-primary mb-2'>Custom Bracelet Builder</h1>
      <p className='text-theme-secondary mb-8'>
        Design your perfect paracord bracelet. Choose colors, weave style, and add charms.
      </p>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Preview */}
        <div className='lg:col-span-1'>
          <div className='sticky top-24 p-6 rounded-xl border border-steel/20 bg-theme-card'>
            <h3 className='text-lg font-bold text-theme-primary mb-4'>Preview</h3>
            <div
              className='aspect-square rounded-lg flex items-center justify-center mb-4'
              style={{
                background: `repeating-linear-gradient(45deg, ${primaryColor.hex}, ${primaryColor.hex} 10px, ${secondaryColor.hex} 10px, ${secondaryColor.hex} 20px)`,
              }}
            >
              <div className='text-center p-4 bg-black/60 rounded-lg'>
                <p className='text-white font-bold'>{weaveStyle.name}</p>
                <p className='text-steel text-sm mt-1'>{primaryColor.name} / {secondaryColor.name}</p>
                {selectedCharms.filter(c => c !== 'None').length > 0 && (
                  <p className='text-lime text-sm mt-1'>
                    + {selectedCharms.filter(c => c !== 'None').join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className='text-center'>
              <span className='text-2xl font-bold text-lime'>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className='mt-4 w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors disabled:opacity-50'
            >
              {submitting ? 'Submitting...' : 'Place Custom Order'}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Primary Color */}
          <section>
            <h3 className='text-lg font-bold text-theme-primary mb-3'>Primary Color</h3>
            <div className='flex flex-wrap gap-2'>
              {PARACORD_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setPrimaryColor(c)}
                  className={getPrimaryBtnCls(c)}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className='text-sm text-steel mt-2'>{primaryColor.name}</p>
          </section>

          {/* Secondary Color */}
          <section>
            <h3 className='text-lg font-bold text-theme-primary mb-3'>Secondary Color</h3>
            <div className='flex flex-wrap gap-2'>
              {PARACORD_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSecondaryColor(c)}
                  className={getSecondaryBtnCls(c)}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className='text-sm text-steel mt-2'>{secondaryColor.name}</p>
          </section>

          {/* Weave Style */}
          <section>
            <h3 className='text-lg font-bold text-theme-primary mb-3'>Weave Style</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {WEAVE_STYLES.map(w => (
                <button
                  key={w.name}
                  onClick={() => setWeaveStyle(w)}
                  className={getWeaveBtnCls(w)}
                >
                  <p className='font-bold text-theme-primary'>{w.name}</p>
                  <p className='text-sm text-steel mt-1'>{w.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Charms */}
          <section>
            <h3 className='text-lg font-bold text-theme-primary mb-3'>
              Charms <span className='text-sm font-normal text-steel'>(select multiple)</span>
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {CHARM_OPTIONS.map(charm => (
                <button
                  key={charm.name}
                  onClick={() => toggleCharm(charm.name)}
                  className={getCharmBtnCls(charm)}
                >
                  <p className='font-medium text-theme-primary text-sm'>{charm.name}</p>
                  {charm.price > 0 && <p className='text-xs text-lime'>+${charm.price.toFixed(2)}</p>}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
