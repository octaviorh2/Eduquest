import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { inicializarBaseDeDatos } from './db.js';
import authRoutes from './routes/auth.routes.js';
import docenteRoutes from './routes/docente.routes.js';
import estudianteRoutes from './routes/estudiante.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api', docenteRoutes);
app.use('/api', estudianteRoutes);

app.get('/api/saludo', (_req: Request, res: Response) => {
  res.json({ mensaje: '¡Hola desde el backend en Node + TS conectado a MySQL en Docker!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  await inicializarBaseDeDatos();
});