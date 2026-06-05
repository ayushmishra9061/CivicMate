import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { streamUploadById } from '../services/storageService.js';

export const getUpload = asyncHandler(async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) throw new ApiError(404, 'Upload not found');

  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  const files = await bucket.find({ _id: new ObjectId(req.params.id) }).toArray();
  const file = files[0];
  if (!file) throw new ApiError(404, 'Upload not found');

  res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  streamUploadById(req.params.id, res);
});
