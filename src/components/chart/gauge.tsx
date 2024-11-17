import React, { useEffect, useRef, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSensorContext } from '../../pages/context/SensorContext'; // Import the context hook

Chart.register(ArcElement, Tooltip, Legend);

const LATENCY_COLORS: { [key: string]: string } = {
    't < 2s': '#00A651',     // Hijau (tercepat)
    't < 5s': '#FFF200',     // Kuning
    't < 15s': '#F7941D',    // Oranye
    't < 1m': '#ED1C24',     // Merah
    't < 15m': '#662D91',    // Ungu
    'OFF': '#231F20'         // Hitam
};

const GaugeChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { sensors } = useSensorContext(); // Get sensors from context
    const [latencyData, setLatencyData] = useState<number[]>([]);

    useEffect(() => {
        if (sensors) {
            // Ambil Last_latency dari setiap sensor
            const latencies = sensors.map((sensor: { Last_latency: number | null }) => sensor.Last_latency)
                .filter((latency): latency is number => latency !== null); // Filter out null values
            setLatencyData(latencies);
            console.log('Latencies:', latencies); // Debugging: tampilkan nilai latencies
        }
    }, [sensors]);

    // Menghitung persentase untuk setiap kategori
    const calculatePercentages = (latencies: number[]) => {
        const total = latencies.length;
        const counts = {
            't < 2s': 0,
            't < 5s': 0,
            't < 15s': 0,
            't < 1m': 0,
            't < 15m': 0,
            'OFF': 0
        };

        latencies.forEach(latency => {
            if (latency === null) {
                counts['OFF']++;
            } else if (latency < 2) {
                counts['t < 2s']++;
            } else if (latency < 5) {
                counts['t < 5s']++;
            } else if (latency < 15) {
                counts['t < 15s']++;
            } else if (latency < 60) {
                counts['t < 1m']++;
            } else if (latency < 900) {
                counts['t < 15m']++;
            } else {
                counts['OFF']++;
            }
        });

        // Menghitung persentase
        const percentages = segments.map(segment => (counts[segment as keyof typeof counts] / total) * 100 || 0);
        return percentages;
    };

    const segments = Object.keys(LATENCY_COLORS);
    const percentages = calculatePercentages(latencyData);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const gaugeChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: segments,
                        datasets: [
                            {
                                data: percentages,
                                backgroundColor: segments.map(segment => LATENCY_COLORS[segment]),
                                borderWidth: 3,
                                borderRadius: 20,
                            },
                        ],
                    },
                    options: {
                        cutout: '90%',
                        rotation: 189 * Math.PI,
                        circumference: 80 * Math.PI,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const index = tooltipItem.dataIndex;
                                        return `${percentages[index].toFixed(2)}%`;
                                    },
                                },
                            },
                        },
                    },
                });

                return () => {
                    gaugeChart.destroy();
                };
            }
        }
    }, [percentages]); 

    return (
        <div style={{ 
            position: 'relative', 
            top : '10%',
            width: '90%', 
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
        }}>
            <canvas ref={canvasRef} />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 10
            }}>
                <div style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: '#000'
                }}>
                    {latencyData.length} {/* Display total number of sensors */}
                </div>
                <div style={{
                    fontSize: '20px',
                    color: '#666'
                }}>
                    TOTAL SENSOR
                </div>
            </div>
        </div>
    );
};

export default GaugeChart;