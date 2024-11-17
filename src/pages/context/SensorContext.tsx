// context/SensorContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import useSensors from '../hooks/useSensors';

// Define the shape of the sensor data
interface Sensor {
    sensor_id: number;
    Kode: string;
    Nama: string;
    Lat: string; 
    Long: string; 
    Kota: string;
    Provinsi: string;
    Tipe: string;
    Kategori: string;
    UPT: string;
    Last_latency: number | null;
    Status: number | null;
  }

// Define the shape of the context value
interface SensorContextType {
  sensors: Sensor[];
  loading: boolean;
  error: string | null;
}

// Create the context with a default value of null
const SensorContext = createContext<SensorContextType | null>(null);

interface SensorProviderProps {
  children: ReactNode; // Define the type for children prop
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
  const sensorData = useSensors();
  
  return (
    <SensorContext.Provider value={sensorData}>
      {children}
    </SensorContext.Provider>
  );
};

// Custom hook to use the SensorContext
export const useSensorContext = (): SensorContextType => {
  const context = useContext(SensorContext);
  
  if (!context) {
    throw new Error('useSensorContext must be used within a SensorProvider');
  }

  return context;
};