import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eduquest_clave_secreta_jwt_2026';

// REGISTRO
router.post('/registro', async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contrasena, rol, nombre_institucion } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados.' });
    }

    const rolFinal = rol === 'DOCENTE' ? 'DOCENTE' : 'ESTUDIANTE';
    const institucionFinal = nombre_institucion ? nombre_institucion.trim() : null;

    // Verificar si el correo ya existe
    const [usuariosExistentes]: any = await pool.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo.trim().toLowerCase()]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
    }

    // Hashear contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const nuevoId = `usr-${Date.now()}`;

    await pool.query(
      `INSERT INTO usuarios (id, nombre, correo, contrasena_hash, rol, nombre_institucion, experiencia_total, vidas, gemas)
       VALUES (?, ?, ?, ?, ?, ?, 0, 5, 0)`,
      [nuevoId, nombre.trim(), correo.trim().toLowerCase(), contrasenaHash, rolFinal, institucionFinal]
    );

    const usuario = {
      id: nuevoId,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      rol: rolFinal,
      nombre_institucion: institucionFinal,
      experiencia_total: 0,
      vidas: 5,
      gemas: 0
    };

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      mensaje: '¡Usuario registrado exitosamente!',
      usuario,
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error en el servidor al registrar el usuario.' });
  }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Ingresa tu correo y contraseña.' });
    }

    const [usuarios]: any = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo.trim().toLowerCase()]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas. Correo no encontrado.' });
    }

    const usuarioDb = usuarios[0];
    const passwordCoincide = await bcrypt.compare(contrasena, usuarioDb.contrasena_hash);

    if (!passwordCoincide) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    const usuario = {
      id: usuarioDb.id,
      nombre: usuarioDb.nombre,
      correo: usuarioDb.correo,
      rol: usuarioDb.rol,
      nombre_institucion: usuarioDb.nombre_institucion,
      experiencia_total: usuarioDb.experiencia_total,
      vidas: usuarioDb.vidas,
      gemas: usuarioDb.gemas,
      dias_racha: usuarioDb.dias_racha,
      etapa_actual: usuarioDb.etapa_actual
    };

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      mensaje: 'Inicio de sesión exitoso.',
      usuario,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
  }
});

// PERFIL (TOKEN VERIFICATION)
router.get('/perfil', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorización requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const [usuarios]: any = await pool.query(
      'SELECT id, nombre, correo, rol, nombre_institucion, experiencia_total, vidas, gemas, dias_racha, etapa_actual FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({ usuario: usuarios[0] });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
});

export default router;
