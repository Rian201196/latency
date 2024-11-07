'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  label: string;
  value: number;
}

// Sample data - replace with your actual data
const sampleData: DataPoint[] = [
  { label: 'January', value: 65 },
  { label: 'February', value: 59 },
  { label: 'March', value: 80 },
  { label: 'April', value: 81 },
  { label: 'May', value: 56 },
];

const BarChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

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
        labels: sampleData.map(d => d.label),
        datasets: [{
          label: 'Monthly Data',
          data: sampleData.map(d => d.value),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Statistics'
          }
        },
        scales: {
          y: {
            beginAtZero: true
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
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div id="acc" className="sm:col-span-3 sm:row-span-3 min-h-[100px] rounded-lg bg-white opacity-90">
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart;