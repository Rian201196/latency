'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { useSensorContext } from '../../pages/context/SensorContext'; // Import the context hook

interface DataPoint {
  label: string;
  value: number;
}

// Define colors for each category
const LATENCY_COLORS: { [key: string]: string } = {
  't < 2s': '#00A651',     
  't < 5s': '#FFF200',     
  't < 15s': '#F7941D',   
  't < 1m': '#ED1C24',     
  't < 15m': '#662D91',   
  'OFF': '#231F20'         
};

// Define the order of labels
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
  const { sensors } = useSensorContext(); // Get sensors from context
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (sensors) {
      // Filter only for Accelerograph category
      const accelerographSensors = sensors.filter((sensor: any) => 
        sensor.Kategori === 'Accelerograph'
      );

      // Categorize last_latency for Accelerograph
      const categorizedData: { [key: string]: number } = {};
      
      accelerographSensors.forEach((sensor: any) => {
        const category = categorizeLatency(sensor.Last_latency);
        categorizedData[category] = (categorizedData[category] || 0) + 1;
      });

      // Convert to DataPoint array according to desired order
      const formattedDataPoints: DataPoint[] = LABEL_ORDER.map(label => ({
        label,
        value: categorizedData[label] || 0, // Set value to 0 if no data
      }));

      setDataPoints(formattedDataPoints);
    }
  }, [sensors]); // Run effect when sensors change

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
            display: false, // Disable legend
          },
          title: {
            display: true,
            text: 'Latency Sensor Accelerograph'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10 // Step size for ticks
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