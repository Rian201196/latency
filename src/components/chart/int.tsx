'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  label: string;
  value: number;
}

// Definisi warna untuk setiap kategori
const LATENCY_COLORS: { [key: string]: string } = {
  't < 2s': '#00A651',     // Hijau (tercepat)
  't < 5s': '#FFF200',     // Kuning
  't < 15s': '#F7941D',    // Oranye
  't < 1m': '#ED1C24',     // Merah
  't < 15m': '#662D91',    // Ungu
  'OFF': '#231F20'         // Hitam
};

// Definisikan urutan label
const LABEL_ORDER = ['t < 2s', 't < 5s', 't < 15s', 't < 1m', 't < 15m', 'OFF'];

const categorizeLatency = (latency: number | null): string => {
  if (latency === null) return 'OFF';
  if (latency < 2) return 't < 2s';
  if (latency < 5) return 't < 5s';
  if (latency < 15) return 't < 15s';
  if (latency < 60) return 't < 1m';
  if (latency < 900) return 't < 15m';
  return 'OFF';
};

const BarChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch('/api/sensors');
        const data = await response.json();

        const intensitySensors = data.filter((sensor: any) => 
          sensor.Kategori === 'Intensitymeter'
        );

        const categorizedData: { [key: string]: number } = {};
        
        intensitySensors.forEach((sensor: any) => {
          const category = categorizeLatency(sensor.Last_latency);
          categorizedData[category] = (categorizedData[category] || 0) + 1;
        });

        // Konversi ke array DataPoint sesuai urutan yang diinginkan
        const formattedDataPoints: DataPoint[] = LABEL_ORDER.map(label => ({
          label,
          value: categorizedData[label] || 0, // Jika tidak ada data, set value ke 0
        }));

        setDataPoints(formattedDataPoints);
      } catch (error) {
        console.error('Error fetching sensors:', error);
      }
    };

    fetchSensors();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataPoints.map(d => d.label),
        datasets: [{
          label: 'Jumlah',
          data: dataPoints.map(d => d.value),
          backgroundColor: dataPoints.map(d => LATENCY_COLORS[d.label] || 'rgba(54, 162, 235, 0.8)'),
          borderColor: dataPoints.map(d => LATENCY_COLORS[d.label] || 'rgba(54, 162, 235, 1)'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            display: false, // Menonaktifkan legenda
          },
          title: {
            display: true,
            text: 'Latency Sensor Intensitymeter '
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10 // Jeda antar nilai
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dataPoints]); 

  return (
    <div className="relative sm:col-span-3 sm:row-span-3 min-h-[100px] h-full rounded-lg bg-white opacity-90">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default BarChart;