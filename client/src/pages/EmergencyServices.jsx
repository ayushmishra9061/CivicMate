import { Flame, Hospital, MapPin, PhoneCall, Shield } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { api } from '../services/api';

const serviceTypes = [
  ['hospitals', 'Hospitals', Hospital],
  ['police', 'Police', Shield],
  ['firestations', 'Fire Stations', Flame],
  ['ambulance', 'Ambulance', PhoneCall]
];

export default function EmergencyServices() {
  const [coords, setCoords] = useState({ lat: '28.6139', lng: '77.2090' });
  const [active, setActive] = useState('hospitals');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (kind = active) => {
    setActive(kind);
    setLoading(true);
    try {
      const { data } = await api.get(`/emergency/${kind}`, { params: coords });
      setServices(data.services);
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setCoords({ lat: String(position.coords.latitude), lng: String(position.coords.longitude) });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <h2 className="text-2xl font-bold">Emergency Services</h2>
        <div className="mt-5 grid gap-4">
          <Input label="Latitude" value={coords.lat} onChange={(e) => setCoords({ ...coords, lat: e.target.value })} />
          <Input label="Longitude" value={coords.lng} onChange={(e) => setCoords({ ...coords, lng: e.target.value })} />
          <Button variant="secondary" onClick={useMyLocation}><MapPin size={18} /> Use my location</Button>
          <Button variant="danger" onClick={() => load('ambulance')}><PhoneCall size={18} /> SOS</Button>
        </div>
      </Card>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map(([kind, label, Icon]) => (
            <Button key={kind} variant={active === kind ? 'primary' : 'secondary'} onClick={() => load(kind)}>
              <Icon size={18} /> {label}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <Card><p>Loading nearby services...</p></Card> : services.map((service) => (
            <Card key={`${service.name}-${service.address}`}>
              <h3 className="font-bold">{service.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{service.address}</p>
              <p className="mt-3 text-sm">Rating: {service.rating || 'Not available'}</p>
              <p className="text-sm">Open now: {service.openNow === undefined ? 'Unknown' : service.openNow ? 'Yes' : 'No'}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
