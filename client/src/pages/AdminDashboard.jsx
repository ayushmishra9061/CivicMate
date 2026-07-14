import {
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
  Eye,
} from "lucide-react";
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ComplaintDetailsModal from "../components/admin/ComplaintDetailsModal";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
  
    const loadDashboard = async () => {
      try {
        const [analyticsRes, complaintsRes] = await Promise.all([
          api.get("/admin/analytics"),
          api.get("/admin/complaints"),
        ]);
  
        setAnalytics(analyticsRes.data.analytics);
        setComplaints(complaintsRes.data.complaints);
      } catch (err) {
        console.error(err);
      }
    };
  
    loadDashboard();
  }, [user]);

  if (user?.role !== 'admin') {
    return <Card><h2 className="text-xl font-bold">Admin access required</h2><p className="mt-2 text-sm text-slate-500">Your current role cannot view city-wide analytics.</p></Card>;
  }

  if (!analytics) return <Card>Loading analytics...</Card>;

  const stats = [
    ['Total complaints', analytics.total, BarChart3, 'text-civic-blue'],
    ['Pending', analytics.pending, Clock, 'text-civic-amber'],
    ['Resolved', analytics.resolved, CheckCircle2, 'text-civic-green'],
    ['Critical', analytics.critical, ShieldAlert, 'text-civic-red'],
    ['Users', analytics.users, Users, 'text-slate-600']
  ];
  const categoryData = analytics.byCategory.map((item) => ({ name: item._id || 'Unknown', complaints: item.count }));
  const locationData = analytics.byLocation.map((item) => ({ name: item._id || 'Unknown', complaints: item.count }));
  const monthlyData = analytics.monthly.map((item) => ({ name: `${item._id.month}/${item._id.year}`, complaints: item.count }));

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">
          City operations, complaint load, priority risks, and location trends.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value, Icon, color]) => (
          <Card key={label}>
            <Icon className={color} />
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-bold">Complaints by category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-4 font-bold">Monthly trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#059669"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>
      <Card>
        <h3 className="mb-4 font-bold">Complaints by location</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="complaints" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Complaint Management</h3>

          <span className="text-sm text-slate-500">
            {complaints.length} Complaints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Complaint ID</th>
                <th className="p-3 text-left">Citizen</th>
                <th className="p-3 text-left">Issue</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td className="p-3">{complaint.complaintId}</td>

                  <td className="p-3">{complaint.userId?.name}</td>

                  <td className="p-3">{complaint.issueType}</td>

                  <td className="p-3">{complaint.priority}</td>

                  <td className="p-3">{complaint.status}</td>

                  <td className="p-3">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="text-civic-blue hover:text-blue-700"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onStatusUpdated={(updatedComplaint) => {
          // Update the table
          setComplaints((prev) =>
            prev.map((item) =>
              item._id === updatedComplaint._id ? updatedComplaint : item,
            ),
          );

          // Update the selected complaint
          setSelectedComplaint(updatedComplaint);
        }}
      />
    </div>
  );
}
