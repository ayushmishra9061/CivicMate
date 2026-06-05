import { ServiceProvider } from '../models/ServiceProvider.js';
import { ApiError, asyncHandler } from '../utils/errors.js';

export const registerProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.create({ ...req.body, ownerId: req.user._id });
  res.status(201).json({ success: true, provider });
});

export const listProviders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.user?.role !== 'admin') filter.verified = true;

  const providers = await ServiceProvider.find(filter).sort({ verified: -1, rating: -1 });
  res.json({ success: true, providers });
});

export const updateProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findById(req.params.id);
  if (!provider) throw new ApiError(404, 'Service provider not found');
  const isOwner = provider.ownerId?.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Access denied');

  const ownerFields = ['businessName', 'category', 'phone', 'location', 'serviceStatus'];
  const adminFields = ['verified', 'rating'];
  const allowed = req.user.role === 'admin' ? [...ownerFields, ...adminFields] : ownerFields;
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) provider[field] = req.body[field];
  });

  await provider.save();
  res.json({ success: true, provider });
});
