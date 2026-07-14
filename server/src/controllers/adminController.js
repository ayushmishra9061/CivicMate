import { Complaint } from '../models/Complaint.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/errors.js';

export const analytics = asyncHandler(async (_req, res) => {
  const [total, pending, resolved, critical, byCategory, byLocation, monthly, users, providers] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: { $in: ['Submitted', 'Verified', 'Assigned', 'In Progress'] } }),
    Complaint.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
    Complaint.countDocuments({ priority: 'Critical' }),
    Complaint.aggregate([{ $group: { _id: '$issueType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Complaint.aggregate([{ $group: { _id: '$location.city', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Complaint.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    User.countDocuments(),
    ServiceProvider.countDocuments()
  ]);

  res.json({
    success: true,
    analytics: { total, pending, resolved, critical, byCategory, byLocation, monthly, users, providers }
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-refreshTokenHash').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const getAllComplaints = asyncHandler(async (_req, res) => {
  const complaints = await Complaint.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    complaints,
  });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Submitted",
    "Verified",
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status.",
    });
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found.",
    });
  }

  complaint.status = status;

  await complaint.save();

  res.json({
    success: true,
    message: "Complaint status updated successfully.",
    complaint,
  });
});
