import { FlightDataItem, ParsedFlightData } from '../types/flightData';

export const parseFlightDataArray = (dataArray: FlightDataItem[]): ParsedFlightData => {
  const parsedData: ParsedFlightData = {
    latitude: null,
    longitude: null,
    pitch_angle: null,
    true_track_angle: null,
    roll_angle: null,
    true_heading: null,
    altitude: null,
    groundspeed: null,
    time: null,
    date: null,
    position: null,
    timestamp: Date.now()
  };

  dataArray.forEach(item => {
    const value = item.value;
    
    if (value === "n/a" || value === null || value === undefined) {
      return;
    }

    switch (item.key) {
      case 'latitude':
        parsedData.latitude = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'longitude':
        parsedData.longitude = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'pitch_angle':
        parsedData.pitch_angle = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'true_track_angle':
        parsedData.true_track_angle = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'roll_angle':
        parsedData.roll_angle = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'true_heading':
        parsedData.true_heading = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'altitude':
        parsedData.altitude = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'groundspeed':
        parsedData.groundspeed = typeof value === 'string' ? parseFloat(value) : value;
        break;
      case 'time':
        parsedData.time = typeof value === 'string' ? value : String(value);
        break;
      case 'date':
        parsedData.date = typeof value === 'string' ? value : String(value);
        break;
      case 'position':
        parsedData.position = typeof value === 'string' ? parseFloat(value) : value;
        break;
    }
  });

  return parsedData;
};

export const generateSampleFlightData = (): FlightDataItem[] => {
  return [
    { label: "Latitude", key: "latitude", value: (40.7128 + (Math.random() - 0.5) * 0.01).toFixed(6) },
    { label: "Longitude", key: "longitude", value: (-74.0060 + (Math.random() - 0.5) * 0.01).toFixed(6) },
    { label: "Pitch Angle", key: "pitch_angle", value: (5 + (Math.random() - 0.5) * 4).toFixed(2) },
    { label: "Track Angle", key: "true_track_angle", value: (90 + (Math.random() - 0.5) * 10).toFixed(1) },
    { label: "Roll", key: "roll_angle", value: (-2 + (Math.random() - 0.5) * 6).toFixed(2) },
    { label: "Heading", key: "true_heading", value: (90 + (Math.random() - 0.5) * 10).toFixed(1) },
    { label: "Altitude", key: "altitude", value: (35000 + (Math.random() - 0.5) * 1000).toFixed(0) },
    { label: "Ground Speed", key: "groundspeed", value: (420 + (Math.random() - 0.5) * 40).toFixed(1) },
    { label: "Time", key: "time", value: new Date().toLocaleTimeString() },
    { label: "Date", key: "date", value: new Date().toLocaleDateString() },
    { label: "Horizontal Stabilizer", key: "position", value: (0.5 + (Math.random() - 0.5) * 0.2).toFixed(3) }
  ];
};