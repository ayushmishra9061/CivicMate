import { Bell, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const { notifications = [] } = useOutletContext() || {};

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <span className="grid size-16 place-items-center rounded-md bg-blue-50 text-civic-blue dark:bg-blue-950/50"><UserRound size={32} /></span>
        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
        <p className="capitalize text-slate-500">{user.role}</p>
        <div className="mt-6 grid gap-3 text-sm">
          <p className="flex items-center gap-2"><Mail size={16} /> {user.email}</p>
          <p className="flex items-center gap-2"><Phone size={16} /> {user.phone || 'Not added'}</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> {user.address || 'Not added'}</p>
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="text-civic-blue" />
          <h3 className="text-lg font-bold">Notification Center</h3>
        </div>
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <div key={notification._id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-slate-500">{notification.message}</p>
            </div>
          ))}
          {!notifications.length ? <p className="text-sm text-slate-500">No notifications yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
