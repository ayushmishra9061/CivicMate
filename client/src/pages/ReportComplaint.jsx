import { ImagePlus, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import { api } from '../services/api';

const initial = {
  issueType: 'Potholes',
  description: '',
  address: '',
  city: '',
  lat: '',
  lng: ''
};

export default function ReportComplaint() {
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('Submitting complaint...');
    const payload = new FormData();
    payload.append('issueType', form.issueType);
    payload.append('description', form.description);
    payload.append('location', JSON.stringify({
      address: form.address,
      city: form.city,
      lat: Number(form.lat),
      lng: Number(form.lng)
    }));
    if (image) payload.append('image', image);

    try {
      const { data } = await api.post('/complaints', payload);
      setStatus(`Created ${data.complaint.complaintId} with ${data.complaint.priority} priority.`);
      setForm(initial);
      setImage(null);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Could not submit complaint');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <h2 className="text-2xl font-bold">Report Complaint</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Select label="Issue type" value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })}>
            {['Potholes', 'Garbage accumulation', 'Broken streetlights', 'Water leakage', 'Road damage', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </Select>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
            <textarea className="focus-ring min-h-32 rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <Input label="Latitude" type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
            <Input label="Longitude" type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
          </div>
          <label className="focus-ring flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-950">
            <ImagePlus className="mb-2 text-civic-blue" />
            <span className="font-semibold">{image ? image.name : 'Upload issue image'}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => setImage(e.target.files?.[0])} />
          </label>
          <Button><Send size={18} /> Submit Complaint</Button>
          {status ? <p className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">{status}</p> : null}
        </form>
      </Card>
      <Card className="h-fit">
        <MapPin className="text-civic-green" />
        <h3 className="mt-4 text-lg font-bold">AI detection flow</h3>
        <p className="mt-2 text-sm text-slate-500">Uploaded images are sent to the detection service to infer issue type, confidence, and priority before admin verification.</p>
      </Card>
    </div>
  );
}
