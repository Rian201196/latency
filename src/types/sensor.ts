export interface Sensor {
    sensor_id: number;
    Kode: string;
    Nama: string;
    Lat: number;
    Long: number;
    Kota: string;
    Provinsi: string;
    Tipe: string;
    Kategori: string;
    UPT: string;
    Last_latency: number | null;
    Status: string | null;
    created_at: string;
  }