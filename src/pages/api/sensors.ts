// pages/api/sensors.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prismaClient'; // Pastikan path ini sesuai dengan lokasi prismaClient.ts
import Cors from 'cors';

// Inisialisasi middleware CORS
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'], // Metode yang diizinkan
  origin: 'http://172.19.3.129:3000', // Ganti dengan asal yang diizinkan
});

// Middleware untuk menjalankan CORS
const runCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runCors(req, res); // Jalankan middleware CORS

  if (req.method === 'GET') {
    try {
      const sensors = await prisma.sensor.findMany();
      res.status(200).json(sensors); // Mengembalikan data dalam format JSON
    } catch (error) {
      console.error("Error fetching sensors:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect(); // Menutup koneksi Prisma
    }
  } else {
    // Jika metode tidak diizinkan
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}