import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <Link to="/" className="text-xl font-bold text-civic-blue">CivicMate</Link>
        <h1 className="mt-6 text-2xl font-bold dark:text-white">Log in</h1>
        <p className="mt-1 text-sm text-slate-500">Access complaints, services, chatbot, and notifications.</p>
        <div className="mt-6 grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-civic-red dark:bg-red-950/40">{error}</p> : null}
          <Button disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
        </div>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">New here? <Link className="font-semibold text-civic-blue" to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
