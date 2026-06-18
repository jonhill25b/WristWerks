import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2 rounded-lg border border-theme focus:border-lime focus:outline-none bg-theme-input text-theme-primary placeholder-steel-dark';

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-3xl font-bold mb-8 text-theme-primary'>Login</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && <p className='text-red-400 text-sm'>{error}</p>}
        <input type='email' required placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
        <input type='password' required placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
        <button type='submit' disabled={loading} className='w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors disabled:opacity-50'>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
