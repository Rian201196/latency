// components/SensorTable.tsx

import React from 'react';

interface Sensor {
  sensor_id: number;
  kode: string;
  nama: string;
  lat: number;
  long: number;
  kota: string;
  provinsi: string;
  tipe: string;
  kategori: string;
  upt: string;
  last_latency: string | null; // Nullable
  status: string | null; // Nullable
  created_at: string; // ISO string
}

interface SensorTableProps {
  sensors: Sensor[];
}

const SensorTable: React.FC<SensorTableProps> = ({ sensors }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Sensor ID</th>
          <th className="border border-gray-300 p-2">Kode</th>
          <th className="border border-gray-300 p-2">Nama</th>
          <th className="border border-gray-300 p-2">Lat</th>
          <th className="border border-gray-300 p-2">Long</th>
          <th className="border border-gray-300 p-2">Kota</th>
          <th className="border border-gray-300 p-2">Provinsi</th>
          <th className="border border-gray-300 p-2">Tipe</th>
          <th className="border border-gray-300 p-2">Kategori</th>
          <th className="border border-gray-300 p-2">UPT</th>
          <th className="border border-gray-300 p-2">Last Latency</th>
          <th className="border border-gray-300 p-2">Status</th>
          <th className="border border-gray-300 p-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        {sensors.map(sensor => (
          <tr key={sensor.sensor_id}>
            <td className="border border-gray-300 p-2">{sensor.sensor_id}</td>
            <td className="border border-gray-300 p-2">{sensor.kode}</td>
            <td className="border border-gray-300 p-2">{sensor.nama}</td>
            <td className="border border-gray-300 p-2">{sensor.lat}</td>
            <td className="border border-gray-300 p-2">{sensor.long}</td>
            <td className="border border-gray-300 p-2">{sensor.kota}</td>
            <td className="border border-gray-300 p-2">{sensor.provinsi}</td>
            <td className="border border-gray-300 p-2">{sensor.tipe}</td>
            <td className="border border-gray-300 p-2">{sensor.kategori}</td>
            <td className="border border-gray-300 p-2">{sensor.upt}</td>
            <td className="border border-gray-300 p-2">{sensor.last_latency}</td>
            <td className="border border-gray-300 p-2">{sensor.status}</td>
            <td className="border border-gray-300 p-2">{new Date(sensor.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SensorTable;