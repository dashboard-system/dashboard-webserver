import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlightDataItem, ParsedFlightData } from '../../types/flightData';
import { parseFlightDataArray, generateSampleFlightData } from '../../utils/dataParser';

interface FlightDataState {
  rawData: FlightDataItem[];
  parsedData: ParsedFlightData;
  connected: boolean;
  lastUpdate: number;
  dataQuality: 'good' | 'degraded' | 'failed';
}

const initialRawData = generateSampleFlightData();

const initialState: FlightDataState = {
  rawData: initialRawData,
  parsedData: parseFlightDataArray(initialRawData),
  connected: false,
  lastUpdate: Date.now(),
  dataQuality: 'good'
};

const flightDataSlice = createSlice({
  name: 'flightData',
  initialState,
  reducers: {
    updateRawFlightData: (state, action: PayloadAction<FlightDataItem[]>) => {
      state.rawData = action.payload;
      state.parsedData = parseFlightDataArray(action.payload);
      state.lastUpdate = Date.now();
      
      const validValues = action.payload.filter(item => item.value !== "n/a").length;
      const totalValues = action.payload.length;
      
      if (validValues > totalValues * 0.8) {
        state.dataQuality = 'good';
      } else if (validValues > totalValues * 0.5) {
        state.dataQuality = 'degraded';
      } else {
        state.dataQuality = 'failed';
      }
    },
    updateSingleParameter: (state, action: PayloadAction<{ key: string; value: string | number }>) => {
      const { key, value } = action.payload;
      const existingIndex = state.rawData.findIndex(item => item.key === key);
      
      if (existingIndex >= 0) {
        state.rawData[existingIndex].value = value;
      } else {
        const label = key.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        state.rawData.push({ label, key, value });
      }
      
      state.parsedData = parseFlightDataArray(state.rawData);
      state.lastUpdate = Date.now();
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    simulateFlightData: (state) => {
      state.rawData = generateSampleFlightData();
      state.parsedData = parseFlightDataArray(state.rawData);
      state.lastUpdate = Date.now();
      state.dataQuality = 'good';
    }
  }
});

export const { 
  updateRawFlightData, 
  updateSingleParameter, 
  setConnectionStatus, 
  simulateFlightData 
} = flightDataSlice.actions;

export default flightDataSlice.reducer;