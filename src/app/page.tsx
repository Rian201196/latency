import dynamic from "next/dynamic";
import Image from "next/image";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';



const Map = dynamic(() => import("@/components/map/latency"), { ssr: false });

export default function HomePage() {
  return (
    <div className="bg-[rgb(212,218,220)] py-10 sm:py-3">
      <div className="m-4 grid grid-cols-1 sm:grid-cols-12 sm:grid-rows-9 gap-4 h-[50rem]">
        <div className="relative sm:col-span-9 sm:row-span-5 min-h-[100px] rounded-lg overflow-hidden">
          <Map center={[-6.155158139563846, 105.50465998162689]} zoom={7} />
        </div>
        <div
          id="cetak"
          className="sm:col-span-3 sm:row-span-1 h-[5rem] rounded-lg relative"
        >
          <Image
            src="/cetak.png"
            alt="Cetak Image"
            className="rounded-lg absolute bottom-0 right-0 object-cover"
            width={160}
            height={50}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div
          id="aktif"
          className="sm:col-span-3 sm:row-span-1 h-[5rem] rounded-lg bg-[#d9fce4] opacity-70 p-2"
        >
          <div className="grid grid-cols-4 h-full items-center gap-2">
            <div className="icon col-span-1 text-center">
            <RadioButtonCheckedIcon sx={{ fontSize: 60, color: '#66ff66' }} />
            </div>
            <div className="status col-span-2 text-center">
            <h1 className="font-roboto text-xl font-bold">JUMLAH SENSOR ON</h1>
            </div>
            <h1 className="font-roboto text-2xl font-bold">150</h1>
          </div>
        </div>

        <div
          id="mati"
          className="sm:col-span-3 sm:row-span-1 h-[5rem] rounded-lg bg-[#feeeee] opacity-70 p-2"
        >
          <div className="grid grid-cols-4 h-full items-center gap-2">
            <div className="icon col-span-1 text-center">
            <RadioButtonCheckedIcon sx={{ fontSize: 60, color: '#ff6666' }} />
            </div>
            <div className="status col-span-2 text-center">
            <h1 className="font-roboto text-xl font-bold">JUMLAH SENSOR OFF</h1>
            </div>
            <h1 className="font-roboto text-2xl font-bold">150</h1>
          </div>
        </div>
        <div
          id="popup"
          className="sm:col-span-3 sm:row-span-3 min-h-[100px] rounded-lg bg-white opacity-90"
        ></div>
        <div
          id="acc"
          className="sm:col-span-3 sm:row-span-2 min-h-[100px] rounded-lg bg-white opacity-90"
        ></div>
        <div
          id="tabel"
          className="sm:col-span-6 sm:row-span-4 min-h-[100px] rounded-lg bg-white opacity-90"
        ></div>
        <div
          id="status"
          className="sm:col-span-3 sm:row-span-3 min-h-[100px] rounded-lg bg-white opacity-90"
        ></div>
        <div
          id="int"
          className="sm:col-span-3 sm:row-span-2 min-h-[100px] rounded-lg bg-white opacity-90"
        ></div>
      </div>
    </div>
  );
}
