import { Complaint } from '../models/Complaint.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { detectIssueFromImage, inferPriority } from '../services/aiService.js';
import { createNotification, notifyAdmins } from '../services/notificationService.js';
import { uploadBufferToStorage } from '../services/storageService.js';

const canAccessComplaint = (user, complaint) =>
  user.role === 'admin' || complaint.userId.toString() === user._id.toString();

export const createComplaint = asyncHandler(async (req, res) => {
  let imageUrl;
  let aiDetection;

  if (req.file) {
    const upload = await uploadBufferToStorage(req.file, `${req.protocol}://${req.get('host')}`);
    imageUrl = upload.secure_url;
    aiDetection = await detectIssueFromImage(imageUrl);
  }

  const issueType = aiDetection?.issueType && aiDetection.issueType !== 'Other' ? aiDetection.issueType : req.body.issueType || 'Other';
  const location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;

  const complaint = await Complaint.create({
    userId: req.user._id,
    issueType,
    description: req.body.description,
    imageUrl,
    location,
    priority: aiDetection?.priority || inferPriority(issueType),
    aiDetection
  });

  await createNotification({
    userId: req.user._id,
    title: 'Complaint submitted',
    message: `Complaint ${complaint.complaintId} has been submitted.`,
    meta: { complaintId: complaint._id }
  });
  notifyAdmins('complaint:new', complaint);

  res.status(201).json({ success: true, complaint });
});

export const getComplaints = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.issueType) filter.issueType = req.query.issueType;

  const complaints = await Complaint.find(filter)
    .populate('userId', 'name email phone')
    .populate('assignedTo', 'businessName category phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, complaints });
});

export const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate('assignedTo', 'businessName category phone');
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (!canAccessComplaint(req.user, complaint)) throw new ApiError(403, 'Access denied');

  res.json({ success: true, complaint });
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (req.user.role !== 'admin' && complaint.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied');
  }

  const citizenFields = ['description', 'location'];
  const adminFields = ['issueType', 'priority', 'status', 'assignedTo'];
  const allowed = req.user.role === 'admin' ? [...citizenFields, ...adminFields] : citizenFields;

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) complaint[field] = req.body[field];
  });

  await complaint.save();
  await createNotification({
    userId: complaint.userId,
    title: 'Complaint updated',
    message: `${complaint.complaintId} is now ${complaint.status}.`,
    meta: { complaintId: complaint._id, status: complaint.status }
  });

  res.json({ success: true, complaint });
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (!canAccessComplaint(req.user, complaint)) throw new ApiError(403, 'Access denied');
  if (req.user.role !== 'admin' && complaint.status !== 'Submitted') {
    throw new ApiError(409, 'Only newly submitted complaints can be deleted by citizens');
  }

  await complaint.deleteOne();
  res.json({ success: true, message: 'Complaint deleted' });
});
