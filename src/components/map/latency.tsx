import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Tipe untuk data sensor
interface Sensor {
  sensor_id: number;
  Kode: string;
  Nama: string;
  Lat: string; // Menggunakan string sesuai dengan data API
  Long: string; // Menggunakan string sesuai dengan data API
  Kota: string;
  Provinsi: string;
  Tipe: string;
  Kategori: string;
  UPT: string;
  Last_latency: number | null;
  Status: number | null;
}

// Tipe untuk marker
interface Marker {
  position: [number, number];
  popup: string;
  category: string;
  latency: number | null;
}

// Ikon untuk kategori Accelerograph
const getAccelerographIcon = (latency: number | null) => {
  if (latency === null) return L.icon({ iconUrl: '/sensor/accelero/tg_black.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 2) return L.icon({ iconUrl: '/sensor/accelero/tg_green.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 5) return L.icon({ iconUrl: '/sensor/accelero/tg_yellow.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 15) return L.icon({ iconUrl: '/sensor/accelero/tg_orange.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 60) return L.icon({ iconUrl: '/sensor/accelero/tg_red.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 900) return L.icon({ iconUrl: '/sensor/accelero/tg_purple.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  return L.icon({ iconUrl: '/sensor/accelero/tg_black.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
};

// Ikon untuk kategori Intensitymeter
const getIntensitymeterIcon = (latency: number | null) => {
  if (latency === null) return L.icon({ iconUrl: '/sensor/intensity/s_black.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 2) return L.icon({ iconUrl: '/sensor/intensity/s_green.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 5) return L.icon({ iconUrl: '/sensor/intensity/s_yellow.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 15) return L.icon({ iconUrl: '/sensor/intensity/s_orange.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 60) return L.icon({ iconUrl: '/sensor/intensity/s_red.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  if (latency < 900) return L.icon({ iconUrl: '/sensor/intensity/s_purple.svg', iconSize: [10, 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
  return L.icon({ iconUrl: '/sensor/intensity/s_black.svg', iconSize: [10 , 10], iconAnchor: [5, 10], popupAnchor: [1, -34] });
};

interface MapProps {
  center: number[];
  zoom: number;
}

// Komponen Map
const Map: React.FC<MapProps> = ({ center, zoom }) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sensors');
        const data: Sensor[] = await response.json();

        const formattedMarkers: Marker[] = data.map((sensor) => ({
          position: [parseFloat(sensor.Lat), parseFloat(sensor.Long)] as [number, number],
          popup: `<strong>${sensor.Kode}</strong><br>${sensor.Tipe}<br>${sensor.Kota}, ${sensor.Provinsi}`,
          category: sensor.Kategori,
          latency: sensor.Last_latency, // Menyimpan Last_latency
        }));

        setMarkers(formattedMarkers);
      } catch (error) {
        console.error('Error fetching sensors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  useEffect(() => {
    if (loading) return;

    const map = L.map('map', {
      attributionControl: false,
      zoomControl: false,
    }).setView(center as [number, number], zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
    
    markers.forEach(marker => {
      const icon = marker.category === 'Accelerograph' ? getAccelerographIcon(marker.latency) : getIntensitymeterIcon(marker.latency);
      const m = L.marker(marker.position, { icon }).addTo(map);
      if (marker.popup) {
        m.bindPopup(marker.popup);
      }
    });

    return () => {
      map.remove();
    };
  }, [loading, markers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full w-full rounded-lg">
      <img
        src="https://cdn.jsdelivr.net/gh/Rian201196/image@88946dd9a046478b6346a2ee76668e0fff57605a/latency-crop.png"
        alt="Logo"
        className="absolute top-0 left-0 w-[20%] z-[999]"
      />
      <div id="map" className="h-full w-full rounded-lg"></div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white z-[999] bg-opacity-70 p-4 rounded-lg">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A651'}}></div>
            <span className="ml-2 text-xs">&lt; 2s  </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFF200'}}></div>
            <span className="ml-2 text-xs">&lt; 5s  </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F7941D'}}></div>
            <span className="ml-2 text-xs">&lt; 15s</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ED1C24'}}></div>
            <span className="ml-2 text-xs">&lt; 1m</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#662D91'}}></div>
            <span className="ml-2 text-xs">&lt; 15m</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#231F20'}}></div>
            <span className="ml-2 text-xs">&lt; OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;