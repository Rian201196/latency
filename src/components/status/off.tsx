// components/SensorStatus.tsx
import React, { useEffect, useState } from 'react';
import { useSensorContext } from '../../pages/context/SensorContext';

interface Sensor {
    Status: number | null; 
}

const SensorStatus: React.FC = () => {
    const { sensors } = useSensorContext();     const [totalStatus, setTotalStatus] = useState<number>(0);

    useEffect(() => {
        if (sensors) {
            const count = sensors.filter((sensor: Sensor) => sensor.Status === 0).length;
            setTotalStatus(count);
        }
    }, [sensors]);
    return (
        <h1 className="font-roboto text-2xl font-bold">{totalStatus}</h1>
    );
};

export default SensorStatus;