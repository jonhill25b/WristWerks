import { useState } from 'react';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61585107429199';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSubmitted(true);
  };

  const inputCls = 'w-full px-4 py-2 rounded-lg border border-theme focus:border-lime focus:outline-none bg-theme-input text-theme-primary placeholder-steel-dark';

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-2 text-theme-primary'>Contact Us</h1>
      <p className='mb-8 text-theme-secondary'>
        Have a question about an order or want to discuss a custom build? Reach out!
      </p>

      {submitted ? (
        <div className='p-6 rounded-xl border border-lime/30 bg-lime/5 text-center'>
          <svg className='w-12 h-12 text-lime mx-auto mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <h3 className='text-xl font-bold text-theme-primary'>Message Sent!</h3>
          <p className='mt-2 text-theme-secondary'>We will get back to you as soon as possible.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className='mt-4 px-4 py-2 border border-lime text-lime rounded-lg hover:bg-lime hover:text-black transition-colors'>Send Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <input required placeholder='Your Name' value={form.name} onChange={e => update('name', e.target.value)} className={inputCls} />
            <input type='email' required placeholder='Your Email' value={form.email} onChange={e => update('email', e.target.value)} className={inputCls} />
          </div>
          <input required placeholder='Subject' value={form.subject} onChange={e => update('subject', e.target.value)} className={inputCls} />
          <textarea required placeholder='Your message...' value={form.message} onChange={e => update('message', e.target.value)} rows={6} className={inputCls} />
          <button type='submit' disabled={sending} className='w-full px-6 py-3 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors disabled:opacity-50'>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}

      <div className='mt-12 p-6 rounded-xl border text-center border-theme bg-theme-card'>
        <h3 className='text-lg font-bold mb-2 text-theme-primary'>Visit Our Facebook Page</h3>
        <p className='text-sm mb-4 text-theme-secondary'>
          Follow us on Facebook for new product announcements, custom order spotlights, and more!
        </p>
        <a href={FACEBOOK_URL} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-6 py-2 bg-lime text-black font-bold rounded-lg hover:bg-lime-dark transition-colors'>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
          Facebook Page
        </a>
      </div>
    </div>
  );
}
