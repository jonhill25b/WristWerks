import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { useCart } from '../store/cart.js';
import { useState, type ReactNode } from 'react';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61585107429199';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { count } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isAdminPage = location.pathname.startsWith('/admin');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/custom', label: 'Custom Builder' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className='min-h-screen transition-colors bg-theme-primary text-theme-primary'>
      {/* Navbar */}
      <nav className='sticky top-0 z-50 backdrop-blur-sm border-b bg-theme-primary border-theme' style={{ opacity: 0.95 }}>
        <div className='max-w-7xl mx-auto px-4 flex items-center justify-between h-16'>
          <Link to='/' className='flex items-center gap-2'>
            <img src='/logo.png' alt='Wrist Werks' className='h-10 w-10 rounded-full object-cover border-2 border-lime' onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className='text-xl font-bold tracking-tight'>
              <span className='text-theme-primary'>WRIST</span>{' '}
              <span className='text-lime'>WERKS</span>
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-6'>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`text-sm font-medium transition-colors hover:text-lime ${location.pathname === link.to ? 'text-lime' : 'text-theme-secondary'}`}>
                {link.label}
              </Link>
            ))}

            <Link to='/cart' className='relative text-theme-secondary hover:text-lime transition-colors'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' />
              </svg>
              {count > 0 && (
                <span className='absolute -top-2 -right-2 bg-lime text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>{count}</span>
              )}
            </Link>

            <button onClick={toggle} className='p-2 rounded-lg border border-theme text-theme-secondary hover:border-lime transition-colors' aria-label='Toggle theme'>
              {dark ? (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              ) : (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                </svg>
              )}
            </button>

            {user ? (
              <div className='flex items-center gap-3'>
                {isAdmin && (
                  <Link to='/admin' className={`text-sm font-medium px-3 py-1 rounded border transition-colors ${isAdminPage ? 'bg-lime text-black border-lime' : 'border-lime text-lime hover:bg-lime hover:text-black'}`}>Admin</Link>
                )}
                <Link to='/orders' className='text-sm text-theme-secondary hover:text-lime transition-colors'>Orders</Link>
                <span className='text-sm text-theme-secondary'>{user.firstName}</span>
                <button onClick={logout} className='text-sm text-theme-secondary hover:text-lime transition-colors'>Logout</button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link to='/login' className='text-sm text-theme-secondary hover:text-lime transition-colors'>Login</Link>
                <Link to='/register' className='text-sm font-medium px-3 py-1 rounded border border-lime text-lime hover:bg-lime hover:text-black transition-colors'>Register</Link>
              </div>
            )}
          </div>

          <button className='md:hidden p-2 text-theme-secondary' onClick={() => setMobileOpen(!mobileOpen)} aria-label='Toggle menu'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className='md:hidden border-t border-theme px-4 py-4 space-y-3 bg-theme-primary'>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className='block text-theme-secondary hover:text-lime transition-colors'>{link.label}</Link>
            ))}
            <Link to='/cart' onClick={() => setMobileOpen(false)} className='block text-theme-secondary hover:text-lime'>Cart {count > 0 && `(${count})`}</Link>
            <button onClick={() => { toggle(); setMobileOpen(false); }} className='block text-theme-secondary hover:text-lime'>{dark ? 'Light Mode' : 'Dark Mode'}</button>
            {user ? (
              <>
                {isAdmin && <Link to='/admin' onClick={() => setMobileOpen(false)} className='block text-lime'>Admin</Link>}
                <Link to='/orders' onClick={() => setMobileOpen(false)} className='block text-theme-secondary'>Orders</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className='block text-theme-secondary'>Logout</button>
              </>
            ) : (
              <>
                <Link to='/login' onClick={() => setMobileOpen(false)} className='block text-theme-secondary'>Login</Link>
                <Link to='/register' onClick={() => setMobileOpen(false)} className='block text-lime'>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {children}
      </main>

      <footer className='border-t mt-16 border-theme bg-theme-secondary'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-lg font-bold mb-3'>
                <span className='text-theme-primary'>WRIST</span>{' '}
                <span className='text-lime'>WERKS</span>
              </h3>
              <p className='text-sm text-theme-secondary'>Tactical paracord gear, handcrafted with precision. Every bracelet tells a story of strength and survival.</p>
            </div>
            <div>
              <h4 className='text-sm font-semibold mb-3 text-theme-primary'>Quick Links</h4>
              <div className='space-y-2'>
                <Link to='/shop' className='block text-sm text-theme-secondary hover:text-lime transition-colors'>Shop</Link>
                <Link to='/custom' className='block text-sm text-theme-secondary hover:text-lime transition-colors'>Custom Builder</Link>
                <Link to='/contact' className='block text-sm text-theme-secondary hover:text-lime transition-colors'>Contact</Link>
                <a href={FACEBOOK_URL} target='_blank' rel='noopener noreferrer' className='block text-sm text-theme-secondary hover:text-lime transition-colors'>Facebook Page</a>
              </div>
            </div>
            <div>
              <h4 className='text-sm font-semibold mb-3 text-theme-primary'>Contact</h4>
              <p className='text-sm text-theme-secondary'>Email: info@wristwerks.com</p>
              <p className='text-sm mt-1 text-theme-secondary'>Follow us on Facebook for updates and new products!</p>
            </div>
          </div>
          <div className='border-t mt-8 pt-4 text-center text-xs border-theme text-theme-muted'>
            &copy; {new Date().getFullYear()} Wrist Werks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
