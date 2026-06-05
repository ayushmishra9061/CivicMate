import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'citizen' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <Link to="/" className="text-xl font-bold text-civic-blue">CivicMate</Link>
        <h1 className="mt-6 text-2xl font-bold dark:text-white">Create account</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="citizen">Citizen</option>
            <option value="provider">Service Provider</option>
          </Select>
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-civic-red dark:bg-red-950/40">{error}</p> : null}
        <Button className="mt-6 w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Already registered? <Link className="font-semibold text-civic-blue" to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
