import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, trim: true },
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    ward: { type: String, trim: true },
    city: { type: String, trim: true }
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    issueType: {
      type: String,
      enum: ['Potholes', 'Garbage accumulation', 'Broken streetlights', 'Water leakage', 'Road damage', 'Other'],
      default: 'Other'
    },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    imageUrl: { type: String },
    location: { type: locationSchema, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted',
      index: true
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
    aiDetection: {
      issueType: String,
      confidence: Number,
      priority: String
    }
  },
  { timestamps: true }
);

complaintSchema.pre('validate', function setComplaintId(next) {
  if (!this.complaintId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.complaintId = `CM-${date}-${suffix}`;
  }
  next();
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
