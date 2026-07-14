import { ChatHistory } from "../models/ChatHistory.js";
import { asyncHandler } from "../utils/errors.js";
import { askCivicMate, detectIssueFromImage } from "../services/aiService.js";
import { uploadBufferToStorage } from "../services/storageService.js";

export const detectIssue = asyncHandler(async (req, res) => {
  console.log("===== STEP 1 : Request received =====");

  if (!req.file) {
    console.log("❌ No file received");

    return res.status(400).json({
      success: false,
      message: "Image is required",
    });
  }

  console.log("✅ STEP 2 : File received");
  console.log(req.file.originalname);

  console.log("🚀 STEP 3 : Sending image to AI");

  const detection = await detectIssueFromImage(req.file);

  console.log("✅ STEP 4 : AI Detection");
  console.log(detection);

  console.log("💾 STEP 5 : Uploading image to GridFS");

  const upload = await uploadBufferToStorage(
    req.file,
    process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`
  );

  console.log("✅ STEP 6 : Upload complete");
  console.log(upload.secure_url);

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
