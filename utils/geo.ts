// Lightweight database of major touring markets to avoid immediate external API dependency
const CITY_COORDINATES: Record<string, { lat: number, lng: number }> = {
  'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
  'Portland, OR': { lat: 45.5152, lng: -122.6784 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
  'Las Vegas, NV': { lat: 36.1699, lng: -115.1398 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 },
  'Denver, CO': { lat: 39.7392, lng: -104.9903 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'New Orleans, LA': { lat: 29.9511, lng: -90.0715 },
  'Nashville, TN': { lat: 36.1627, lng: -86.7816 },
  'Atlanta, GA': { lat: 33.7490, lng: -84.3880 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Detroit, MI': { lat: 42.3314, lng: -83.0458 },
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589 },
  'Philadelphia, PA': { lat: 39.9526, lng: -75.1652 },
  'Washington, DC': { lat: 38.9072, lng: -77.0369 },
  'Miami, FL': { lat: 25.7617, lng: -80.1918 },
  'Toronto, ON': { lat: 43.6532, lng: -79.3832 },
  'Vancouver, BC': { lat: 49.2827, lng: -123.1207 },
};

export interface RouteMetrics {
  distanceMiles: number;
  driveTimeHours: number;
  estimatedGasCost: number;
  isLongDrive: boolean;
  isImpossible: boolean;
}

// Haversine formula to calculate distance between two points
const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3959; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const calculateRouteMetrics = (cityA: string, cityB: string): RouteMetrics | null => {
  const coordA = CITY_COORDINATES[cityA] || findClosestMatch(cityA);
  const coordB = CITY_COORDINATES[cityB] || findClosestMatch(cityB);

  if (!coordA || !coordB) return null;

  const distance = getDistanceFromLatLonInMiles(coordA.lat, coordA.lng, coordB.lat, coordB.lng);
  
  // Estimate logic: Avg speed 60mph + 10% buffer for stops/traffic
  const driveTime = (distance / 55); 
  
  // Gas Estimate: Avg Van/Bus gets 12 MPG, Gas $4.00/gal
  const gasCost = (distance / 12) * 4.00;

  return {
    distanceMiles: Math.round(distance),
    driveTimeHours: parseFloat(driveTime.toFixed(1)),
    estimatedGasCost: Math.round(gasCost),
    isLongDrive: driveTime > 8,
    isImpossible: driveTime > 14 // Simple heuristic
  };
};

// Helper to handle loose string matching if exact key isn't found
const findClosestMatch = (input: string) => {
  const keys = Object.keys(CITY_COORDINATES);
  const match = keys.find(k => k.toLowerCase().includes(input.toLowerCase()));
  return match ? CITY_COORDINATES[match] : null;
};