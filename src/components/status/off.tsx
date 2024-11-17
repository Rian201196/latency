// components/SensorStatus.tsx
import React, { useEffect, useState } from 'react';

const SensorStatus: React.FC = () => {
    const [totalStatus, setTotalStatus] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/sensors'); // Ganti dengan URL API Anda
                const data = await response.json();

                // Hitung jumlah status yang bernilai 1
                const count = data.filter((sensor: { Status: number }) => sensor.Status === 0).length;
                setTotalStatus(count);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <h1 className="font-roboto text-2xl font-bold">{totalStatus}</h1>
    );
};

export default SensorStatus;