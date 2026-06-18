import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.js';

export default function Home() {
  const { dark } = useTheme();
  return (
    <div className='space-y-16'>
      <section className='relative text-center py-20 px-4'>
        <div className='absolute inset-0 bg-gradient-to-b from-lime/5 to-transparent pointer-events-none' />
        <h1 className='text-5xl md:text-7xl font-black tracking-tight mb-4'>
          <span className={dark ? 'text-white' : 'text-black'}>WRIST</span>{' '}
          <span className='text-lime'>WERKS</span>
        </h1>
        <p className={`text-xl md:text-2xl mb-2 ${dark ? 'text-steel' : 'text-steel-dark'}`}>TACTICAL PARACORD GEAR</p>
        <p className={`${dark ? 'text-steel' : 'text-steel-dark'} max-w-2xl mx-auto mb-8`}>
          Handcrafted paracord bracelets built for strength, style, and survival. Every piece is made with military-grade 550 paracord by a fellow veteran.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/shop' className='px-8 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>Shop Now</Link>
          <Link to='/custom' className='px-8 py-3 border-2 border-lime text-lime font-bold rounded-lg hover:bg-lime hover:text-black transition-colors'>Build Custom</Link>
        </div>
      </section>

      <section className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {[
          { title: 'Military Grade', desc: 'Genuine 550 military-spec paracord rated for 550 lbs of tensile strength.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { title: 'Handcrafted', desc: 'Every bracelet is hand-woven with care. No mass production — just quality gear.', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
          { title: 'Custom Orders', desc: 'Want something unique? Build your own with our custom bracelet builder.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
        ].map((f) => (
          <div key={f.title} className={`p-6 rounded-xl border hover:border-lime/50 transition-colors ${dark ? 'border-steel/20 bg-charcoal' : 'border-gray-200 bg-gray-50'}`}>
            <svg className='w-10 h-10 text-lime mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={f.icon} />
            </svg>
            <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-black'}`}>{f.title}</h3>
            <p className={`text-sm ${dark ? 'text-steel' : 'text-steel-dark'}`}>{f.desc}</p>
          </div>
        ))}
      </section>

      <section className='text-center py-12 border-y border-lime/20'>
        <h2 className={`text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-black'}`}>Ready to gear up?</h2>
        <p className={`${dark ? 'text-steel' : 'text-steel-dark'} mb-6`}>Browse our collection or design your own custom piece.</p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/shop' className='px-6 py-2 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>View Products</Link>
          <Link to='/custom' className='px-6 py-2 border border-lime text-lime font-bold rounded-lg hover:bg-lime hover:text-black transition-colors'>Custom Builder</Link>
        </div>
      </section>

      <section className='text-center py-8'>
        <p className='text-steel-dark text-sm uppercase tracking-widest mb-2'>Proudly</p>
        <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-black'}`}>Veteran Owned & Operated</h3>
        <p className={`${dark ? 'text-steel' : 'text-steel-dark'} mt-2 max-w-lg mx-auto`}>Founded by a retired Army veteran, Wrist Werks brings military precision and discipline into every piece of tactical gear we create.</p>
      </section>
    </div>
  );
}
