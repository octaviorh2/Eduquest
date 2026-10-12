import { Router, type Request, type Response } from 'express';
import { pool } from '../db.js';

const router = Router();

// Obtener datos del estudiante y progreso de gamificación
router.get('/estudiante/progreso/:estudianteId', async (req: Request, res: Response) => {
  try {
    const { estudianteId } = req.params;
    const [usuarios]: any = await pool.query(
      'SELECT id, nombre, correo, rol, nombre_institucion, experiencia_total, vidas, gemas, dias_racha, etapa_actual FROM usuarios WHERE id = ?',
      [estudianteId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    const [progreso]: any = await pool.query(
      'SELECT * FROM progreso_estudiantes WHERE estudiante_id = ?',
      [estudianteId]
    );

    res.json({
      perfil: usuarios[0],
      progreso
    });
  } catch (error) {
    console.error('Error al obtener progreso de estudiante:', error);
    res.status(500).json({ error: 'Error al consultar el progreso del estudiante.' });
  }
});

// Obtener mapa de trivias y materias para una etapa académica
router.get('/estudiante/ruta/:etapa', async (req: Request, res: Response) => {
  try {
    const { etapa } = req.params;
    const [materias]: any = await pool.query(
      'SELECT * FROM materias WHERE esta_activa = TRUE ORDER BY nombre ASC'
    );

    const [niveles]: any = await pool.query(
      'SELECT * FROM niveles WHERE etapa_academica = ? ORDER BY numero_orden ASC',
      [String(etapa).toUpperCase()]
    );

    res.json({
      materias,
      niveles
    });
  } catch (error) {
    console.error('Error al obtener ruta académica:', error);
    res.status(500).json({ error: 'Error al obtener la ruta de trivia del estudiante.' });
  }
});

// Obtener preguntas para jugar un nivel
router.get('/estudiante/trivia-juego/:nivelId', async (req: Request, res: Response) => {
  try {
    const { nivelId } = req.params;

    const [preguntas]: any = await pool.query(
      'SELECT id, nivel_id, materia_id, enunciado, puntos, explicacion_formativa, pista FROM preguntas WHERE nivel_id = ? AND esta_activa = TRUE',
      [nivelId]
    );

    const preguntasConOpciones = await Promise.all(
      preguntas.map(async (p: any) => {
        const [opciones]: any = await pool.query(
          'SELECT id, texto, es_correcta FROM opciones WHERE pregunta_id = ? ORDER BY RAND()',
          [p.id]
        );
        return {
          ...p,
          opciones: opciones.map((op: any) => ({
            id: op.id,
            texto: op.texto,
            es_correcta: Boolean(op.es_correcta)
          }))
        };
      })
    );

    res.json(preguntasConOpciones);
  } catch (error) {
    console.error('Error al cargar trivia para jugar:', error);
    res.status(500).json({ error: 'Error al cargar las preguntas de la trivia.' });
  }
});

// Guardar resultado de trivia completada
router.post('/estudiante/completar-trivia', async (req: Request, res: Response) => {
  try {
    const { estudianteId, nivelId, xpGanada, aprobada, preguntasCorrectas, preguntasTotales } = req.body;

    if (!estudianteId || !nivelId) {
      return res.status(400).json({ error: 'Datos incompletos para registrar el resultado.' });
    }

    // 1. Guardar intento
    const intentoId = `int-${Date.now()}`;
    await pool.query(
      `INSERT INTO intentos_trivia (id, estudiante_id, nivel_id, preguntas_correctas, preguntas_totales, xp_ganada, aprobado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [intentoId, estudianteId, nivelId, preguntasCorrectas || 0, preguntasTotales || 0, xpGanada || 0, Boolean(aprobada)]
    );

    // 2. Actualizar XP y racha del usuario
    await pool.query(
      `UPDATE usuarios 
       SET experiencia_total = experiencia_total + ?,
           gemas = gemas + ?
       WHERE id = ?`,
      [Number(xpGanada) || 0, aprobada ? 15 : 5, estudianteId]
    );

    // 3. Actualizar progreso del nivel
    await pool.query(
      `INSERT INTO progreso_estudiantes (id, estudiante_id, nivel_id, ha_completado, intentos_realizados)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE 
         ha_completado = IF(VALUES(ha_completado) = TRUE, TRUE, ha_completado),
         intentos_realizados = intentos_realizados + 1`,
      [`prg-usr-${Date.now()}`, estudianteId, nivelId, Boolean(aprobada)]
    );

    const [usuarioActualizado]: any = await pool.query(
      'SELECT id, experiencia_total, vidas, gemas, dias_racha FROM usuarios WHERE id = ?',
      [estudianteId]
    );

    res.json({
      mensaje: '¡Resultado guardado con éxito!',
      usuario: usuarioActualizado[0]
    });
  } catch (error) {
    console.error('Error al registrar resultado de trivia:', error);
    res.status(500).json({ error: 'Error al registrar el resultado en la base de datos.' });
  }
});

export default router;
