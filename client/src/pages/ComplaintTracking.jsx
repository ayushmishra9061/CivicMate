import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import { api } from '../services/api';

const statuses = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export default function ComplaintTracking() {
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('');

  const load = () => {
    api.get('/complaints', { params: status ? { status } : {} }).then(({ data }) => setComplaints(data.complaints));
  };

  useEffect(load, [status]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Complaint Tracking</h2>
          <p className="text-sm text-slate-500">Follow each complaint from submission to closure.</p>
        </div>
        <div className="flex gap-2">
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Button variant="secondary" onClick={load}><RefreshCw size={18} /></Button>
        </div>
      </div>
      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <Card key={complaint._id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-civic-blue">{complaint.complaintId}</p>
                <h3 className="text-lg font-bold">{complaint.issueType}</h3>
                <p className="mt-1 text-sm text-slate-500">{complaint.description}</p>
                <p className="mt-2 text-sm text-slate-500">{complaint.location?.address}, {complaint.location?.city}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-civic-blue dark:bg-blue-950/50">{complaint.status}</span>
                <span className="rounded-md bg-amber-50 px-3 py-1 text-sm font-semibold text-civic-amber dark:bg-amber-950/40">{complaint.priority}</span>
              </div>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-6">
              {statuses.map((item, index) => {
                const active = statuses.indexOf(complaint.status) >= index;
                return <div key={item} className={`h-2 rounded-full ${active ? 'bg-civic-green' : 'bg-slate-200 dark:bg-slate-800'}`} title={item} />;
              })}
            </div>
          </Card>
        ))}
        {!complaints.length ? <Card><p className="text-sm text-slate-500">No matching complaints found.</p></Card> : null}
      </div>
    </div>
  );
}
