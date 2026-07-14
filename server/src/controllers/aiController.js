import { ChatHistory } from "../models/ChatHistory.js";
import { asyncHandler } from "../utils/errors.js";
import { askCivicMate, detectIssueFromImage } from "../services/aiService.js";
import { uploadBufferToStorage } from "../services/storageService.js";

export const detectIssue = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image is required",
    });
  }

  const detection = await detectIssueFromImage(req.file);

  const upload = await uploadBufferToStorage(
    req.file,
    process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`
  );

  return res.json({
    success: true,
    detection,
    imageUrl: upload.secure_url,
  });
});

export const chat = asyncHandler(async (req, res) => {
  const history = await ChatHistory.findOne({ userId: req.user._id });
  const messages = history?.messages || [];
  const reply = await askCivicMate({
    message: req.body.message,
    history: messages,
    user: req.user,
  });

  await ChatHistory.findOneAndUpdate(
    { userId: req.user._id },
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: req.body.message },
            { role: "assistant", content: reply },
          ],
        },
      },
    },
    { upsert: true, new: true },
  );

  res.json({ success: true, reply });
});

export const chatHistory = asyncHandler(async (req, res) => {
  const history = await ChatHistory.findOne({ userId: req.user._id });
  res.json({ success: true, messages: history?.messages || [] });
});
