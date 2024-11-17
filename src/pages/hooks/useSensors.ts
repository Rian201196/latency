// hooks/useSensors.ts
import { useEffect, useState } from 'react';

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

const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch('/api/sensors');
        if (!response.ok) throw new Error('Failed to fetch sensors');
        const data: Sensor[] = await response.json();
        setSensors(data);
      } catch (err) {
        // Handle the unknown error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred'); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  return { sensors, loading, error };
};

export default useSensors;