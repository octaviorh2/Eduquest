import { Router, type Request, type Response } from 'express';
import { pool } from '../db.js';

const router = Router();

// ==========================================
// 1. MATERIAS
// ==========================================

// Obtener todas las materias
router.get('/materias', async (_req: Request, res: Response) => {
  try {
    const [materias]: any = await pool.query('SELECT * FROM materias WHERE esta_activa = TRUE ORDER BY nombre ASC');
    res.json(materias);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ error: 'Error al consultar las materias en la base de datos.' });
  }
});

// Crear nueva materia con sus niveles base automáticos
router.post('/materias', async (req: Request, res: Response) => {
  try {
    const { id: reqId, nombre, descripcion, icono, color, creador_docente_id } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre de la materia es obligatorio.' });
    }

    const materiaId = reqId || `mat-${Date.now()}`;
    const nombreLimpio = nombre.trim();
    const colorFinal = color || '#22c55e';
    const descFinal = descripcion ? descripcion.trim() : `Asignatura creada: ${nombreLimpio}`;

    await pool.query(
      `INSERT INTO materias (id, nombre, descripcion, icono, color, creador_docente_id)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), color = VALUES(color), descripcion = VALUES(descripcion)`,
      [
        materiaId,
        nombreLimpio,
        descFinal,
        icono || 'book',
        colorFinal,
        creador_docente_id || null
      ]
    );

    // Crear niveles base en MySQL para Infantil, Secundaria y Avanzado si no existen
    const etapas = ['INFANTIL', 'SECUNDARIA', 'AVANZADO'] as const;
    for (const etapa of etapas) {
      const [nivelesExistentes]: any = await pool.query(
        'SELECT id FROM niveles WHERE materia_id = ? AND etapa_academica = ?',
        [materiaId, etapa]
      );

      if (nivelesExistentes.length === 0) {
        const nivelId = `niv-${materiaId.slice(0, 15)}-${etapa.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`;
        await pool.query(
          `INSERT INTO niveles (id, materia_id, etapa_academica, numero_orden, numero_nivel, titulo, descripcion, xp_recompensa, recompensa_experiencia)
           VALUES (?, ?, ?, 1, 1, ?, ?, 25, 25)`,
          [
            nivelId,
            materiaId,
            etapa,
            `Nivel 1 de ${nombreLimpio}`,
            `Trivias de ${nombreLimpio} para etapa ${etapa}.`
          ]
        );
      }
    }

    const [nuevaMateria]: any = await pool.query('SELECT * FROM materias WHERE id = ?', [materiaId]);
    res.status(201).json(nuevaMateria[0]);
  } catch (error: any) {
    console.error('Error al crear materia:', error);
    res.status(500).json({ error: 'Error al registrar la materia en la base de datos.', detalle: error?.message });
  }
});

// ==========================================
// 2. NIVELES
// ==========================================

router.get('/niveles', async (req: Request, res: Response) => {
  try {
    const { materia_id, etapa_academica } = req.query;
    let query = 'SELECT * FROM niveles WHERE 1=1';
    const params: any[] = [];

    if (materia_id && materia_id !== 'TODAS') {
      query += ' AND materia_id = ?';
      params.push(materia_id);
    }
    if (etapa_academica && etapa_academica !== 'TODAS') {
      query += ' AND etapa_academica = ?';
      params.push(etapa_academica);
    }

    query += ' ORDER BY numero_orden ASC';
    const [niveles]: any = await pool.query(query, params);
    res.json(niveles);
  } catch (error) {
    console.error('Error al obtener niveles:', error);
    res.status(500).json({ error: 'Error al consultar los niveles en la base de datos.' });
  }
});

// ==========================================
// 3. PREGUNTAS (CRUD Completo de Trivia)
// ==========================================

// Obtener todas las preguntas con sus opciones (con LEFT JOIN para máxima robustez)
router.get('/preguntas', async (req: Request, res: Response) => {
  try {
    const { materia_id, etapa_academica } = req.query;
    let sql = `
      SELECT 
        p.*,
        COALESCE(m.nombre, 'General') AS materia_nombre,
        COALESCE(m.color, '#22c55e') AS materia_color,
        COALESCE(n.titulo, 'Nivel 1') AS nivel_titulo
      FROM preguntas p
      LEFT JOIN materias m ON p.materia_id = m.id
      LEFT JOIN niveles n ON p.nivel_id = n.id
      WHERE p.esta_activa = TRUE
    `;
    const params: any[] = [];

    if (materia_id && materia_id !== 'TODAS') {
      sql += ' AND p.materia_id = ?';
      params.push(materia_id);
    }
    if (etapa_academica && etapa_academica !== 'TODAS') {
      sql += ' AND p.etapa_academica = ?';
      params.push(etapa_academica);
    }

    sql += ' ORDER BY p.fecha_creacion DESC';
    const [preguntas]: any = await pool.query(sql, params);

    // Adjuntar opciones a cada pregunta
    const preguntasConOpciones = await Promise.all(
      preguntas.map(async (p: any) => {
        const [opciones]: any = await pool.query(
          'SELECT id, texto, es_correcta, numero_orden FROM opciones WHERE pregunta_id = ? ORDER BY numero_orden ASC',
          [p.id]
        );
        return {
          ...p,
          opciones: opciones.map((op: any) => ({
            id: op.id,
            texto: op.texto,
            es_correcta: Boolean(op.es_correcta),
            orden: op.numero_orden
          }))
        };
      })
    );

    res.json(preguntasConOpciones);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ error: 'Error al consultar las preguntas en la base de datos.' });
  }
});

// Crear una pregunta con 4 opciones (Blindada contra errores de clave foránea)
router.post('/preguntas', async (req: Request, res: Response) => {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    let {
      id,
      nivel_id,
      materia_id,
      etapa_academica,
      enunciado,
      puntos,
      explicacion_formativa,
      pista,
      docente_autor_id,
      opciones
    } = req.body;

    if (!enunciado || !enunciado.trim() || !opciones || !Array.isArray(opciones) || opciones.length === 0) {
      await conexion.rollback();
      return res.status(400).json({ error: 'El enunciado y las opciones de respuesta son obligatorios.' });
    }

    const etapaFinal = etapa_academica || 'SECUNDARIA';

    // 1. Validar y asegurar que materia_id exista en la tabla materias
    let materiaFinalId = materia_id;
    if (!materiaFinalId) {
      const [matDefault]: any = await conexion.query('SELECT id FROM materias LIMIT 1');
      if (matDefault.length > 0) {
        materiaFinalId = matDefault[0].id;
      } else {
        materiaFinalId = `mat-general-${Date.now()}`;
        await conexion.query(
          `INSERT INTO materias (id, nombre, descripcion, icono, color)
           VALUES (?, 'General', 'Materia general de trivia', 'book', '#22c55e')`,
          [materiaFinalId]
        );
      }
    } else {
      const [matExiste]: any = await conexion.query('SELECT id FROM materias WHERE id = ?', [materiaFinalId]);
      if (matExiste.length === 0) {
        // La materia fue creada en el cliente con un ID personalizado: la persistimos
        await conexion.query(
          `INSERT INTO materias (id, nombre, descripcion, icono, color)
           VALUES (?, ?, 'Asignatura creada por docente', 'book', '#22c55e')
           ON DUPLICATE KEY UPDATE id=id`,
          [materiaFinalId, `Materia ${materiaFinalId}`]
        );
      }
    }

    // 2. Validar y asegurar que nivel_id exista en la tabla niveles
    let nivelFinalId = nivel_id;
    if (nivelFinalId) {
      const [nivExiste]: any = await conexion.query('SELECT id FROM niveles WHERE id = ?', [nivelFinalId]);
      if (nivExiste.length === 0) {
        nivelFinalId = null;
      }
    }

    if (!nivelFinalId) {
      // Buscar si la materia ya tiene un nivel para esta etapa
      const [nivMateria]: any = await conexion.query(
        'SELECT id FROM niveles WHERE materia_id = ? AND etapa_academica = ? LIMIT 1',
        [materiaFinalId, etapaFinal]
      );

      if (nivMateria.length > 0) {
        nivelFinalId = nivMateria[0].id;
      } else {
        // Crear nivel automáticamente para garantizar la integridad referencial
        nivelFinalId = `niv-${materiaFinalId.slice(0, 15)}-${etapaFinal.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`;
        await conexion.query(
          `INSERT INTO niveles (id, materia_id, etapa_academica, numero_orden, numero_nivel, titulo, descripcion, xp_recompensa, recompensa_experiencia)
           VALUES (?, ?, ?, 1, 1, ?, 'Nivel de trivia', 20, 20)`,
          [nivelFinalId, materiaFinalId, etapaFinal, `Nivel 1 de trivia`]
        );
      }
    }

    const preguntaId = id || `prg-${Date.now()}`;

    // 3. Insertar o actualizar la pregunta
    await conexion.query(
      `INSERT INTO preguntas (id, nivel_id, materia_id, etapa_academica, enunciado, puntos, explicacion_formativa, pista, docente_autor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         nivel_id = VALUES(nivel_id),
         materia_id = VALUES(materia_id),
         etapa_academica = VALUES(etapa_academica),
         enunciado = VALUES(enunciado),
         puntos = VALUES(puntos),
         explicacion_formativa = VALUES(explicacion_formativa),
         pista = VALUES(pista)`,
      [
        preguntaId,
        nivelFinalId,
        materiaFinalId,
        etapaFinal,
        enunciado.trim(),
        Number(puntos) || 10,
        explicacion_formativa?.trim() || '',
        pista?.trim() || null,
        docente_autor_id || null
      ]
    );

    // 4. Limpiar e insertar las 4 opciones de respuesta
    await conexion.query('DELETE FROM opciones WHERE pregunta_id = ?', [preguntaId]);

    for (let i = 0; i < opciones.length; i++) {
      const op = opciones[i];
      const opcionId = op.id || `op-${Date.now()}-${i}`;
      await conexion.query(
        `INSERT INTO opciones (id, pregunta_id, texto, es_correcta, numero_orden, orden)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [opcionId, preguntaId, op.texto.trim(), Boolean(op.es_correcta), i + 1, i + 1]
      );
    }

    await conexion.commit();

    // 5. Retornar la pregunta completa recién guardada
    const [nuevaPregunta]: any = await pool.query(
      `SELECT 
         p.*, 
         COALESCE(m.nombre, 'General') AS materia_nombre, 
         COALESCE(m.color, '#22c55e') AS materia_color, 
         COALESCE(n.titulo, 'Nivel 1') AS nivel_titulo 
       FROM preguntas p
       LEFT JOIN materias m ON p.materia_id = m.id
       LEFT JOIN niveles n ON p.nivel_id = n.id
       WHERE p.id = ?`,
      [preguntaId]
    );

    const [opcionesGuardadas]: any = await pool.query(
      'SELECT id, texto, es_correcta, numero_orden FROM opciones WHERE pregunta_id = ? ORDER BY numero_orden ASC',
      [preguntaId]
    );

    res.status(201).json({
      ...nuevaPregunta[0],
      opciones: opcionesGuardadas.map((op: any) => ({
        id: op.id,
        texto: op.texto,
        es_correcta: Boolean(op.es_correcta),
        orden: op.numero_orden
      }))
    });
  } catch (error: any) {
    await conexion.rollback();
    console.error('Error detallado al crear pregunta:', error);
    res.status(500).json({ error: 'Error al guardar la pregunta en la base de datos.', detalle: error?.message });
  } finally {
    conexion.release();
  }
});

// Modificar una pregunta existente
router.put('/preguntas/:id', async (req: Request, res: Response) => {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const { id } = req.params;
    let {
      nivel_id,
      materia_id,
      etapa_academica,
      enunciado,
      puntos,
      explicacion_formativa,
      pista,
      opciones
    } = req.body;

    const etapaFinal = etapa_academica || 'SECUNDARIA';

    // 1. Asegurar materia válida
    let materiaFinalId = materia_id;
    if (materiaFinalId) {
      const [matExiste]: any = await conexion.query('SELECT id FROM materias WHERE id = ?', [materiaFinalId]);
      if (matExiste.length === 0) {
        await conexion.query(
          `INSERT INTO materias (id, nombre, descripcion, icono, color)
           VALUES (?, ?, 'Asignatura creada', 'book', '#22c55e')
           ON DUPLICATE KEY UPDATE id=id`,
          [materiaFinalId, `Materia ${materiaFinalId}`]
        );
      }
    } else {
      const [matDefault]: any = await conexion.query('SELECT id FROM materias LIMIT 1');
      materiaFinalId = matDefault[0]?.id;
    }

    // 2. Asegurar nivel válido
    let nivelFinalId = nivel_id;
    if (nivelFinalId) {
      const [nivExiste]: any = await conexion.query('SELECT id FROM niveles WHERE id = ?', [nivelFinalId]);
      if (nivExiste.length === 0) nivelFinalId = null;
    }

    if (!nivelFinalId && materiaFinalId) {
      const [nivMateria]: any = await conexion.query(
        'SELECT id FROM niveles WHERE materia_id = ? AND etapa_academica = ? LIMIT 1',
        [materiaFinalId, etapaFinal]
      );
      if (nivMateria.length > 0) {
        nivelFinalId = nivMateria[0].id;
      } else {
        nivelFinalId = `niv-${materiaFinalId.slice(0, 15)}-${etapaFinal.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`;
        await conexion.query(
          `INSERT INTO niveles (id, materia_id, etapa_academica, numero_orden, numero_nivel, titulo, descripcion, xp_recompensa, recompensa_experiencia)
           VALUES (?, ?, ?, 1, 1, ?, 'Nivel de trivia', 20, 20)`,
          [nivelFinalId, materiaFinalId, etapaFinal, `Nivel 1 de trivia`]
        );
      }
    }

    await conexion.query(
      `UPDATE preguntas 
       SET nivel_id = ?, materia_id = ?, etapa_academica = ?, enunciado = ?, puntos = ?, explicacion_formativa = ?, pista = ?
       WHERE id = ?`,
      [
        nivelFinalId,
        materiaFinalId,
        etapaFinal,
        enunciado.trim(),
        Number(puntos) || 10,
        explicacion_formativa?.trim() || '',
        pista?.trim() || null,
        id
      ]
    );

    if (opciones && Array.isArray(opciones)) {
      await conexion.query('DELETE FROM opciones WHERE pregunta_id = ?', [id]);
      for (let i = 0; i < opciones.length; i++) {
        const op = opciones[i];
        const opcionId = op.id || `op-${Date.now()}-${i}`;
        await conexion.query(
          `INSERT INTO opciones (id, pregunta_id, texto, es_correcta, numero_orden, orden)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [opcionId, id, op.texto.trim(), Boolean(op.es_correcta), i + 1, i + 1]
        );
      }
    }

    await conexion.commit();

    const [preguntaActualizada]: any = await pool.query(
      `SELECT 
         p.*, 
         COALESCE(m.nombre, 'General') AS materia_nombre, 
         COALESCE(m.color, '#22c55e') AS materia_color, 
         COALESCE(n.titulo, 'Nivel 1') AS nivel_titulo 
       FROM preguntas p
       LEFT JOIN materias m ON p.materia_id = m.id
       LEFT JOIN niveles n ON p.nivel_id = n.id
       WHERE p.id = ?`,
      [id]
    );

    const [opcionesActualizadas]: any = await pool.query(
      'SELECT id, texto, es_correcta, numero_orden FROM opciones WHERE pregunta_id = ? ORDER BY numero_orden ASC',
      [id]
    );

    if (preguntaActualizada.length === 0) {
      return res.status(404).json({ error: 'Pregunta no encontrada tras actualizar.' });
    }

    res.json({
      ...preguntaActualizada[0],
      opciones: opcionesActualizadas.map((op: any) => ({
        id: op.id,
        texto: op.texto,
        es_correcta: Boolean(op.es_correcta),
        orden: op.numero_orden
      }))
    });
  } catch (error: any) {
    await conexion.rollback();
    console.error('Error al modificar pregunta:', error);
    res.status(500).json({ error: 'Error al actualizar la pregunta en la base de datos.', detalle: error?.message });
  } finally {
    conexion.release();
  }
});

// Eliminar pregunta
router.delete('/preguntas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM preguntas WHERE id = ?', [id]);
    res.json({ mensaje: 'Pregunta eliminada exitosamente del banco de trivia.' });
  } catch (error) {
    console.error('Error al eliminar pregunta:', error);
    res.status(500).json({ error: 'Error al eliminar la pregunta en la base de datos.' });
  }
});

// ==========================================
// 4. MÉTRICAS DEL DASHBOARD DOCENTE
// ==========================================
router.get('/docente/metricas', async (_req: Request, res: Response) => {
  try {
    const [totPreguntas]: any = await pool.query('SELECT COUNT(*) as total FROM preguntas WHERE esta_activa = TRUE');
    const [totMaterias]: any = await pool.query('SELECT COUNT(*) as total FROM materias WHERE esta_activa = TRUE');
    const [totNiveles]: any = await pool.query('SELECT COUNT(*) as total FROM niveles');
    const [totXp]: any = await pool.query('SELECT COALESCE(SUM(puntos), 0) as total FROM preguntas WHERE esta_activa = TRUE');

    const [distribucionEtapa]: any = await pool.query(`
      SELECT etapa_academica, COUNT(*) as cantidad 
      FROM preguntas 
      WHERE esta_activa = TRUE 
      GROUP BY etapa_academica
    `);

    res.json({
      totalPreguntas: totPreguntas[0].total,
      totalMaterias: totMaterias[0].total,
      totalNiveles: totNiveles[0].total,
      totalXp: totXp[0].total,
      distribucionEtapa: distribucionEtapa.reduce((acc: any, row: any) => {
        acc[row.etapa_academica] = row.cantidad;
        return acc;
      }, { INFANTIL: 0, SECUNDARIA: 0, AVANZADO: 0 })
    });
  } catch (error) {
    console.error('Error al consultar métricas del docente:', error);
    res.status(500).json({ error: 'Error al generar las métricas del dashboard.' });
  }
});

export default router;
