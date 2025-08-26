export interface FlightDataItem {
  label: string;
  key: string;
  value: string | number;
}

export interface ParsedFlightData {
  latitude: number | null;
  longitude: number | null;
  pitch_angle: number | null;
  true_track_angle: number | null;
  roll_angle: number | null;
  true_heading: number | null;
  altitude: number | null;
  groundspeed: number | null;
  time: string | null;
  date: string | null;
  position: number | null; // Horizontal Stabilizer
  timestamp: number;
}