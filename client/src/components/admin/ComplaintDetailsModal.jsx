import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function ComplaintDetailsModal({
  complaint,
  onClose,
  onStatusUpdated,
}) {
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
      if (complaint) {
        setStatus(complaint.status);
      }
    }, [complaint]);
    
    if (!complaint) return null;

  const saveStatus = async () => {
    try {
      setSaving(true);

      const { data } = await api.patch(
        `/admin/complaints/${complaint._id}/status`,
        {
          status,
        },
      );

      onStatusUpdated(data.complaint);

      alert("Complaint status updated successfully.");

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not update complaint.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white dark:bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">Complaint Details</h2>

          <button
            onClick={onClose}
            className="rounded px-3 py-1 text-xl hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {/* Left Side */}
          <div className="space-y-3">
            <p>
              <strong>Complaint ID:</strong> {complaint.complaintId}
            </p>

            <p>
              <strong>Citizen:</strong> {complaint.userId?.name}
            </p>

            <p>
              <strong>Email:</strong> {complaint.userId?.email}
            </p>

            <p>
              <strong>Issue Type:</strong> {complaint.issueType}
            </p>

            <p>
              <strong>Priority:</strong> {complaint.priority}
            </p>

            <div className="space-y-2">
              <label className="font-semibold">Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="Submitted">Submitted</option>
                <option value="Verified">Verified</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>

            <div>
              <strong>Location:</strong>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {complaint.location.address}
              </p>

              <p className="text-sm">{complaint.location.city}</p>

              <p className="text-sm">
                {complaint.location.lat}, {complaint.location.lng}
              </p>
            </div>

            <div>
              <strong>Description</strong>

              <p className="mt-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Right Side */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Complaint Image</h3>

            {complaint.imageUrl ? (
              <img
                src={complaint.imageUrl}
                alt="Complaint"
                className="w-full rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-lg border">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t p-5">
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg border px-4 py-2">
              Cancel
            </button>

            <button
              onClick={saveStatus}
              disabled={saving}
              className="rounded-lg bg-civic-blue px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
