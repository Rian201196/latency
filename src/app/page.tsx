"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import AccChart from "../components/chart/acc";
import IntChart from "../components/chart/int";
import GaugeChart from "../components/chart/gauge";
import SensorTable from "../components/table/SensorTable";
import SensorOn from "../components/status/on";
import SensorOff from "../components/status/off";
import { SensorProvider } from "../pages/context/SensorContext"; 

const Map = dynamic(() => import("@/components/map/latency"), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 10 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorProvider>
      <div className="min-h-screen bg-[rgb(212,218,220)] p-2 sm:p-4">
        <div className="grid h-[calc(100vh-1rem)] grid-cols-1 sm:grid-cols-12 sm:grid-rows-9 gap-2 sm:gap-4">
          <div className="relative sm:col-span-9 sm:row-span-5 rounded-lg overflow-hidden">
            <Map center={[-6.155158139563846, 105.50465998162689]} zoom={7} />
          </div>

          <div
            id="cetak"
            className="sm:col-span-3 sm:row-span-1 rounded-lg relative"
          >
            {/* <Image
              src="/cetak.png"
              alt="Cetak Image"
              className="rounded-lg absolute bottom-0 right-0 object-cover"
              width={160}
              height={50}
              priority
              style={{ width: "auto", height: "auto" }}
            /> */}
          </div>

          <div
            id="aktif"
            className="sm:col-span-3 sm:row-span-1 rounded-lg bg-[#d9fce4] opacity-70 p-2"
          >
            <div className="grid grid-cols-4 h-full items-center gap-2">
              <div className="icon col-span-1 text-center">
                <RadioButtonCheckedIcon sx={{ fontSize: 60, color: "#66ff66" }} />
              </div>
              <div className="status col-span-2 text-center">
                <h1 className="font-roboto text-xl font-bold">
                  JUMLAH SENSOR ON
                </h1>
              </div>
              <div className="font-roboto text-2xl font-bold"><SensorOn /></div>
            </div>
          </div>

          <div
            id="mati"
            className="sm:col-span-3 sm:row-span-1 rounded-lg bg-[#feeeee] opacity-70 p-2"
          >
            <div className="grid grid-cols-4 h-full items-center gap-2">
              <div className="icon col-span-1 text-center">
                <RadioButtonCheckedIcon sx={{ fontSize: 60, color: "#ff6666" }} />
              </div>
              <div className="status col-span-2 text-center">
                <h1 className="font-roboto text-xl font-bold">
                  JUMLAH SENSOR OFF
                </h1>
              </div>
              <div className="font-roboto text-2xl font-bold"><SensorOff /></div>
            </div>
          </div>

          <div
            id="acc"
            className="sm:col-span-3 sm:row-span-3 rounded-lg bg-white opacity-90 p-2"
          >
            <AccChart />
          </div>

          <div
            id="popup"
            className="sm:col-span-3 sm:row-span-4 rounded-lg bg-white opacity-90"
          >
            <h2 className="text-lg font-semibold mt-[10%] ml-[10px]">
              Status Sensor
            </h2>
            <GaugeChart />
          </div>

          < div
            id="tabel"
            className="sm:col-span-6 sm:row-span-4 rounded-lg bg-white opacity-90 p-4 max-w-full"
          >
            <SensorTable />
          </div>

          <div
            id="int"
            className="sm:col-span-3 sm:row-span-3 rounded-lg bg-white opacity-90 p-2"
          >
            <IntChart />
          </div>
        </div>
      </div>
    </SensorProvider>
  );
}