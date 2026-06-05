import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data.complaints)).catch(() => setComplaints([]));
  }, []);

  const stats = [
    ['Total', complaints.length, FileText, 'text-civic-blue'],
    ['Pending', complaints.filter((c) => ['Submitted', 'Verified', 'Assigned', 'In Progress'].includes(c.status)).length, Clock, 'text-civic-amber'],
    ['Resolved', complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length, CheckCircle2, 'text-civic-green'],
    ['Critical', complaints.filter((c) => c.priority === 'Critical').length, AlertTriangle, 'text-civic-red']
  ];

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg bg-civic-ink p-6 text-white md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Citizen command center</h2>
          <p className="mt-2 max-w-2xl text-slate-200">Submit reports, monitor status, reach emergency services, and get AI help from one workspace.</p>
        </div>
        <Link to="/report"><Button>Report Complaint</Button></Link>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon, color]) => (
          <Card key={label}>
            <Icon className={color} />
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </Card>
        ))}
      </section>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent complaints</h3>
          <Link className="text-sm font-semibold text-civic-blue" to="/tracking">View all</Link>
        </div>
        <div className="grid gap-3">
          {complaints.slice(0, 5).map((complaint) => (
            <div key={complaint._id} className="flex flex-col justify-between gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800 md:flex-row md:items-center">
              <div>
                <p className="font-semibold">{complaint.complaintId}</p>
                <p className="text-sm text-slate-500">{complaint.issueType} - {complaint.location?.address || complaint.location?.city}</p>
              </div>
              <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-civic-blue dark:bg-blue-950/50">{complaint.status}</span>
            </div>
          ))}
          {!complaints.length ? <p className="text-sm text-slate-500">No complaints submitted yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
