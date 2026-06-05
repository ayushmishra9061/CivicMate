import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    category: {
      type: String,
      enum: ['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Technician'],
      required: true,
      index: true
    },
    phone: { type: String, required: true, trim: true },
    location: {
      address: String,
      lat: Number,
      lng: Number
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    verified: { type: Boolean, default: false, index: true },
    serviceStatus: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' }
  },
  { timestamps: true }
);

export const ServiceProvider = mongoose.model('ServiceProvider', providerSchema);
