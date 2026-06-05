import { ArrowRight, Bot, MapPinned, ShieldCheck, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="absolute inset-x-0 top-0 z-10 px-5 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-xl font-bold">CivicMate</Link>
          <div className="flex gap-2">
            <Link to="/login"><Button variant="secondary">Login</Button></Link>
            <Link to="/register"><Button>Register</Button></Link>
          </div>
        </nav>
      </header>
      <section
        className="relative grid min-h-[88vh] items-end bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,.9), rgba(15,23,42,.35)), url(https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80)' }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-md bg-white/12 px-3 py-1 text-sm font-semibold backdrop-blur">AI Powered Smart Citizen Assistance Platform</p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">CivicMate</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-100 md:text-xl">
              Report civic problems, detect issues from images, track resolution, find nearby emergency support, and coordinate with verified local services.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button className="min-w-40">Get Started <ArrowRight size={18} /></Button></Link>
              <Link to="/login"><Button variant="secondary" className="min-w-40">Open Dashboard</Button></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-4">
        {[
          ['AI detection', Bot],
          ['Realtime status', ShieldCheck],
          ['Emergency maps', Siren],
          ['Provider network', MapPinned]
        ].map(([label, Icon]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-5">
            <Icon className="mb-4 text-blue-300" />
            <p className="font-semibold">{label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
