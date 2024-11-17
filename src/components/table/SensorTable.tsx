// components/SensorTable.tsx
import React, { useEffect, useState } from 'react';
import { useSensorContext } from '../../pages/context/SensorContext'; // Import the context hook

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

const SensorTable: React.FC = () => {
  const { sensors } = useSensorContext(); // Get sensors from context
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sensor; direction: 'ascending' | 'descending' } | null>(null);

  // Filter data based on search term
  const filteredSensors = sensors.filter(sensor =>
    sensor.sensor_id.toString().includes(searchTerm) ||
    sensor.Kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.Nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.Tipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.Provinsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort function
  const sortedSensors = React.useMemo(() => {
    let sortableSensors = [...filteredSensors];
    if (sortConfig !== null) {
    sortableSensors.sort((a, b) => {
      const valueA = a[sortConfig.key] as string | number;
      const valueB = b[sortConfig.key] as string | number; 

      // Handle potential null or undefined values
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      // For string comparisons
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      }

      // For numeric comparisons
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortConfig.direction === 'ascending' 
          ? valueA - valueB 
          : valueB - valueA;
      }

      // Fallback for other types
      if (valueA < valueB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }

      return 0;
    });
  }
    return sortableSensors;
  }, [filteredSensors, sortConfig]);

  // Request sorting
  const requestSort = (key: keyof Sensor) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-auto h-full w-full max-w-full">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full text-gray-800 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th onClick={() => requestSort('sensor_id')} className="cursor-pointer border border-gray-300 p-2">ID</th>
              <th onClick={() => requestSort('Kode')} className="cursor-pointer border border-gray-300 p-2">Kode</th>
              <th onClick={() => requestSort('Nama')} className="cursor-pointer border border-gray-300 p-2">Nama</th>
              <th onClick={() => requestSort('Provinsi')} className="cursor-pointer border border-gray-300 p-2 ">Provinsi</th>
              <th onClick={() => requestSort('Tipe')} className="cursor-pointer border border-gray-300 p-2">Tipe</th>
              <th onClick={() => requestSort('Last_latency')} className="cursor-pointer border border-gray-300 p-2">Latency</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {sortedSensors.length > 0 ? (
              sortedSensors.map(sensor => (
                <tr key={sensor.sensor_id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{sensor.sensor_id}</td>
                  <td className="border border-gray-300 p-2">{sensor.Kode}</td>
                  <td className="border border-gray-300 p-2">{sensor.Nama}</td>
                  <td className="border border-gray-300 p-2">{sensor.Provinsi}</td>
                  <td className="border border-gray-300 p-2">{sensor.Tipe}</td>
                  <td className="border border-gray-300 p-2">{sensor.Last_latency !== null ? sensor.Last_latency : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-2 text-center">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;