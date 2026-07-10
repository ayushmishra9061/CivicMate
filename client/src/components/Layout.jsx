import { Bell, Bot, Building2, ClipboardList, Home, LifeBuoy, LogOut, Moon, PlusCircle, ShieldCheck, User, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import Button from './Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/report', label: 'Report', icon: PlusCircle },
  { to: '/tracking', label: 'Tracking', icon: ClipboardList },
  { to: '/emergency', label: 'Emergency', icon: LifeBuoy },
  { to: '/providers', label: 'Providers', icon: Wrench },
  { to: '/chat', label: 'AI Chat', icon: Bot }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { notifications, unread } = useNotifications();
  const [dark, setDark] = useState(() => localStorage.getItem('civicmate_theme') === 'dark');
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('civicmate_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const items = user?.role === 'admin' ? [...navItems, { to: '/admin', label: 'Admin', icon: ShieldCheck }] : navItems;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center gap-3 text-left"
        >
          <span className="grid size-11 place-items-center rounded-md bg-civic-blue text-white">
            <Building2 size={22} />
          </span>
          <span>
            <span className="block text-lg font-bold">CivicMate</span>
            <span className="text-xs text-slate-500">
              Smart Citizen Platform
            </span>
          </span>
        </button>
        <nav className="grid gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-civic-blue dark:bg-blue-950/50" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-xl font-bold">{user?.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="secondary"
                  className="size-10 px-0"
                  aria-label="Notifications"
                  onClick={() => setShowNotifications((prev) => !prev)}
                >
                  <Bell size={18} />
                </Button>
                {unread ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-civic-red px-1.5 text-xs text-white">
                    {unread}
                  </span>
                ) : null}

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-[360px] rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-civic-blue" />

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <p className="text-s text-gray-500 dark:text-gray-400">
                          ({unread})
                        </p>
                      </div>
                      {unread > 0 && (
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                          Mark all
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="space-y-3 p-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🚧</span>

                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Complaint Update
                                </h4>
                              </div>

                              {!notification.read && (
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500 "></span>
                              )}
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {notification.message}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>🕒</span>
                              <span>
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => setDark((value) => !value)}
                aria-label="Toggle dark mode"
              >
                <Moon size={18} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/profile")}
                aria-label="Profile"
              >
                <User size={18} />
              </Button>
              <Button variant="ghost" onClick={logout}>
                <LogOut size={18} /> Logout
              </Button>
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {items.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800"
              >
                {label}
              </NavLink>
            ))}
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Outlet context={{ notifications }} />
        </main>
      </div>
    </div>
  );
}
