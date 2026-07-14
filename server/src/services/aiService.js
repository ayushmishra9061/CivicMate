import FormData from "form-data";
import axios from 'axios';
import { env } from '../config/env.js';

const priorityByIssue = {
  'Water leakage': 'Critical',
  'Broken streetlights': 'High',
  Potholes: 'High',
  'Road damage': 'High',
  'Garbage accumulation': 'Medium'
};

const localAnswers = [
  {
    keywords: ['complaint', 'report', 'issue', 'problem', 'pothole', 'garbage', 'streetlight', 'leakage'],
    answer:
      'To report a civic issue, open Report Complaint, add a clear description, enter the location, attach a photo if available, and submit. CivicMate will generate a complaint ID and track status updates.'
  },
  {
    keywords: ['status', 'track', 'tracking', 'progress', 'resolved', 'closed'],
    answer:
      'Open Complaint Tracking to see each complaint status: Submitted, Verified, Assigned, In Progress, Resolved, and Closed. Realtime notifications appear in your notification center.'
  },
  {
    keywords: ['emergency', 'hospital', 'police', 'fire', 'ambulance', 'sos'],
    answer:
      'For emergencies, open Emergency Services and use SOS or choose hospitals, police, fire stations, or ambulance. CivicMate uses OpenStreetMap public data to find nearby services.'
  },
  {
    keywords: ['provider', 'plumber', 'electrician', 'cleaner', 'technician', 'carpenter'],
    answer:
      'Open Providers to search verified local providers by category. Provider accounts can register a business profile and wait for admin verification.'
  },
  {
    keywords: ['admin', 'assign', 'analytics', 'verify'],
    answer:
      'Admins can open Admin Dashboard to view analytics, verify providers, assign complaints, and monitor critical issues.'
  }
];

export const detectIssueFromImage = async (file) => {
  try {
    const formData = new FormData();

    formData.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const { data } = await axios.post(
      `${env.aiServiceUrl}/detect`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000,
      }
    );

    return data;
  } catch (err) {
    console.error("===== AI SERVICE ERROR =====");
    console.error(err.response?.data || err.message);

    return {
      issueType: "Other",
      confidence: 0,
      priority: "Medium",
    };
  }
};