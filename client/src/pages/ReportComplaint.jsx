import { ImagePlus, MapPin, Send } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
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
  useEffect(() => {
    getCurrentLocation();
  }, []);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [detecting, setDetecting] = useState(false);

  const detectIssue = async (file) => {
    setDetecting(true);
  
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      const { data } = await api.post("/ai/detect", formData);
  
      console.log(data);
  
      if (data.success && data.detection) {
  
        const issueMap = {
          Potholes: "Potholes",
          Garbage: "Garbage accumulation",
          streetlight: "Broken streetlights",
          Streetlight: "Broken streetlights",
          "Broken streetlight": "Broken streetlights",
          "Broken Streetlight": "Broken streetlights",
          water_leakage: "Water leakage",
          "Water leakage": "Water leakage",
          Other: "Other",
        };
  
        const issueType =
          issueMap[data.detection.issueType] || data.detection.issueType;
          
        const messages = {
          "Potholes": "AI detected potholes",
          "Garbage accumulation": "AI detected garbage accumulation",
          "Broken streetlights": "AI detected broken streetlights",
          "Water leakage": "AI detected water leakage",
          "Other": "AI detected an issue",
        };

        setForm((prev) => ({
          ...prev,
          issueType,
          description: `${messages[issueType] || "AI detected an issue"} with ${Math.round(
            data.detection.confidence * 100
          )}% confidence. Please review the complaint details before submitting.`,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDetecting(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
  
          const data = await response.json();
  
          setForm((prev) => ({
            ...prev,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
            address: data.display_name || "",
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              "",
          }));
        } catch (err) {
          console.error(err);
  
          setForm((prev) => ({
            ...prev,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          }));
        }
      },
      (error) => {
        console.error(error);
  
        alert("Unable to retrieve your location.");
      }
    );
  };

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
          <Select
            label="Issue type"
            value={form.issueType}
            onChange={(e) => setForm({ ...form, issueType: e.target.value })}
          >
            {[
              "Potholes",
              "Garbage accumulation",
              "Broken streetlights",
              "Water leakage",
              "Road damage",
              "Other",
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
            <textarea
              className="focus-ring min-h-32 rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />

            <p className="text-xs text-yellow-500">
              📍Location detected automatically. Please verify or edit the
              address if needed.
            </p>

            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => cameraInputRef.current.click()}
            >
              📷 Capture Photo
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current.click()}
            >
              🖼 Upload Image
            </Button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
                detectIssue(file);
              }}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
                detectIssue(file);
              }}
            />

            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Issue Preview"
                  className="h-56 w-full rounded-md border object-cover"
                />

                <p className="mt-2 text-center text-sm text-green-600">
                  Selected: {image?.name}
                </p>
              </div>
            )}
            {detecting && (
              <p className="text-sm text-blue-600">🤖 Detecting issue...</p>
            )}
          </div>
          <Button>
            <Send size={18} /> Submit Complaint
          </Button>
          {status ? (
            <p className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
              {status}
            </p>
          ) : null}
        </form>
      </Card>
      <Card className="h-fit">
        <MapPin className="text-civic-green" />
        <h3 className="mt-4 text-lg font-bold">AI detection flow</h3>
        <p className="mt-2 text-sm text-slate-500">
          Uploaded images are sent to the detection service to infer issue type,
          confidence, and priority before admin verification.
        </p>
      </Card>
    </div>
  );
}
