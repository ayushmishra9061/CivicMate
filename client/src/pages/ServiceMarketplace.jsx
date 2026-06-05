import { BadgeCheck, Search, Star, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const categories = ['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Technician'];

export default function ServiceMarketplace() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ businessName: '', category: 'Electrician', phone: '', address: '' });

  // const load = () => api.get('/providers', { params: category ? { category } : {} }).then(({ data }) => setProviders(data.providers));
  // useEffect(load, [category]);

  const load = () =>
  api.get('/providers', { params: category ? { category } : {} })
     .then(({ data }) => {
        console.log("Providers API:", data);
        setProviders(data.providers || []);
     });

  const register = async (event) => {
    event.preventDefault();
    await api.post('/providers', { ...form, location: { address: form.address } });
    setForm({ businessName: '', category: 'Electrician', phone: '', address: '' });
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold">Service Provider Marketplace</h2>
            <p className="text-sm text-slate-500">Find verified local services by category, rating, and proximity.</p>
          </div>
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider._id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Store className="mb-3 text-civic-blue" />
                  <h3 className="font-bold">{provider.businessName}</h3>
                  <p className="text-sm text-slate-500">{provider.category}</p>
                </div>
                {provider.verified ? <BadgeCheck className="text-civic-green" /> : null}
              </div>
              <p className="mt-4 text-sm">{provider.location?.address}</p>
              <p className="mt-2 flex items-center gap-1 text-sm"><Star size={15} className="text-civic-amber" /> {provider.rating || 0}</p>
              <Button className="mt-4" variant="secondary">Request Service</Button>
            </Card>
          ))}
        </div>
      </section>
      {user?.role === 'provider' || user?.role === 'admin' ? (
        <Card className="h-fit">
          <h3 className="text-lg font-bold">Register business</h3>
          <form onSubmit={register} className="mt-4 grid gap-4">
            <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Button><Search size={18} /> Submit for verification</Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
