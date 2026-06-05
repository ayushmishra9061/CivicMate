import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AIChatbot from './pages/AIChatbot';
import ComplaintTracking from './pages/ComplaintTracking';
import Dashboard from './pages/Dashboard';
import EmergencyServices from './pages/EmergencyServices';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ReportComplaint from './pages/ReportComplaint';
import ServiceMarketplace from './pages/ServiceMarketplace';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportComplaint />} />
        <Route path="/tracking" element={<ComplaintTracking />} />
        <Route path="/emergency" element={<EmergencyServices />} />
        <Route path="/providers" element={<ServiceMarketplace />} />
        <Route path="/chat" element={<AIChatbot />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
