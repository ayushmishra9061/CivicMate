import { asyncHandler } from '../utils/errors.js';
import { findNearbyEmergencyServices } from '../services/emergencyService.js';

export const nearby = (kind) =>
  asyncHandler(async (req, res) => {
    const services = await findNearbyEmergencyServices({
      kind,
      lat: req.query.lat,
      lng: req.query.lng,
      radius: req.query.radius
    });
    res.json({ success: true, services });
  });
