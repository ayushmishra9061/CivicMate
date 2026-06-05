import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

const getBucket = () =>
  new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });

export const uploadBufferToStorage = (file, baseUrl) =>
  new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        size: file.size
      }
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => {
      const url = `/api/uploads/${uploadStream.id.toString()}`;
      resolve({
        id: uploadStream.id.toString(),
        secure_url: `${baseUrl}${url}`,
        url
      });
    });

    uploadStream.end(file.buffer);
  });

export const streamUploadById = (id, res) => {
  const bucket = getBucket();
  const objectId = new ObjectId(id);
  return bucket.openDownloadStream(objectId).pipe(res);
};
