import axios from 'axios';
import { env } from '../config/env.js';

const typeMap = {
  hospitals: [
    { key: 'amenity', value: 'hospital' },
    { key: 'healthcare', value: 'hospital' }
  ],
  police: [{ key: 'amenity', value: 'police' }],
  firestations: [{ key: 'amenity', value: 'fire_station' }],
  ambulance: [
    { key: 'emergency', value: 'ambulance_station' },
    { key: 'amenity', value: 'ambulance_station' }
  ]
};

const buildOverpassQuery = ({ kind, lat, lng, radius }) => {
  const filters = typeMap[kind] || typeMap.hospitals;
  const clauses = filters
    .flatMap(({ key, value }) => [
      `node(around:${radius},${lat},${lng})["${key}"="${value}"];`,
      `way(around:${radius},${lat},${lng})["${key}"="${value}"];`,
      `relation(around:${radius},${lat},${lng})["${key}"="${value}"];`
    ])
    .join('\n');

  return `
    [out:json][timeout:25];
    (
      ${clauses}
    );
    out center tags 25;
  `;
};

export const findNearbyEmergencyServices = async ({ kind, lat, lng, radius = 5000 }) => {
  const query = buildOverpassQuery({ kind, lat, lng, radius });
  const { data } = await axios.post(env.overpassUrl, `data=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'CivicMate/1.0 free-open-data civic assistance'
    },
    timeout: 20000
  });

  return (data.elements || []).map((place) => {
    const tags = place.tags || {};
    return {
      name: tags.name || `${kind} service`,
      address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || tags.operator || 'Address unavailable in OpenStreetMap',
      rating: null,
      location: {
        lat: place.lat || place.center?.lat,
        lng: place.lon || place.center?.lon
      },
      openNow: tags.opening_hours || 'Unknown',
      source: 'OpenStreetMap',
      osmId: `${place.type}/${place.id}`
    };
  });
};
