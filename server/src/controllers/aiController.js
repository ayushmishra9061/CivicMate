import { ChatHistory } from '../models/ChatHistory.js';
import { asyncHandler } from '../utils/errors.js';
import { askCivicMate, detectIssueFromImage } from '../services/aiService.js';
import { uploadBufferToStorage } from '../services/storageService.js';

export const detectIssue = asyncHandler(async (req, res) => {
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    const upload = await uploadBufferToStorage(req.file, `${req.protocol}://${req.get('host')}`);
    imageUrl = upload.secure_url;
  }
  const detection = await detectIssueFromImage(imageUrl);
  res.json({ success: true, detection });
});

export const chat = asyncHandler(async (req, res) => {
  const history = await ChatHistory.findOne({ userId: req.user._id });
  const messages = history?.messages || [];
  const reply = await askCivicMate({ message: req.body.message, history: messages, user: req.user });

  await ChatHistory.findOneAndUpdate(
    { userId: req.user._id },
    {
      $push: {
        messages: {
          $each: [
            { role: 'user', content: req.body.message },
            { role: 'assistant', content: reply }
          ]
        }
      }
    },
    { upsert: true, new: true }
  );

  res.json({ success: true, reply });
});

export const chatHistory = asyncHandler(async (req, res) => {
  const history = await ChatHistory.findOne({ userId: req.user._id });
  res.json({ success: true, messages: history?.messages || [] });
});
