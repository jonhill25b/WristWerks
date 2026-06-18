import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-3xl font-bold text-theme-primary mb-8'>Register</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && <p className='text-red-400 text-sm'>{error}</p>}
        <div className='grid grid-cols-2 gap-3'>
          <input
            required
            placeholder='First Name'
            value={form.firstName}
            onChange={e => update('firstName', e.target.value)}
            className='px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary placeholder-steel-dark focus:border-lime focus:outline-none'
          />
          <input
            required
            placeholder='Last Name'
            value={form.lastName}
            onChange={e => update('lastName', e.target.value)}
            className='px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary placeholder-steel-dark focus:border-lime focus:outline-none'
          />
        </div>
        <input
          type='email'
          required
          placeholder='Email'
          value={form.email}
          onChange={e => update('email', e.target.value)}
          className='w-full px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary placeholder-steel-dark focus:border-lime focus:outline-none'
        />
        <input
          type='password'
          required
          placeholder='Password (min 6 characters)'
          value={form.password}
          onChange={e => update('password', e.target.value)}
          className='w-full px-4 py-2 rounded-lg bg-theme-input border border-theme text-theme-primary placeholder-steel-dark focus:border-lime focus:outline-none'
        />
        <button
          type='submit'
          disabled={loading}
          className='w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors disabled:opacity-50'
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className='text-sm text-steel mt-4 text-center'>
        Already have an account?{' '}
        <Link to={`/login?redirect=${redirect}`} className='text-lime hover:underline'>Login</Link>
      </p>
    </div>
  );
}
