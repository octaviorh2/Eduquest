import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'eduquest_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function inicializarBaseDeDatos() {
  try {
    const conexion = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL en contenedor Docker (eduquest_db)');

    // 1. Tabla usuarios
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(36) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        contrasena_hash VARCHAR(255) NOT NULL,
        rol ENUM('ESTUDIANTE', 'DOCENTE') NOT NULL DEFAULT 'ESTUDIANTE',
        nombre_institucion VARCHAR(150) NULL,
        experiencia_total INT NOT NULL DEFAULT 0,
        vidas INT NOT NULL DEFAULT 5,
        ultima_recarga_vidas DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        dias_racha INT NOT NULL DEFAULT 0,
        fecha_ultima_racha DATE NULL,
        gemas INT NOT NULL DEFAULT 0,
        etapa_actual ENUM('INFANTIL', 'SECUNDARIA', 'AVANZADO') NULL,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_usuarios_rol (rol)
      ) ENGINE=InnoDB;
    `);

    // 2. Tabla materias
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS materias (
        id VARCHAR(36) NOT NULL,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT NULL,
        icono VARCHAR(50) NOT NULL DEFAULT 'book',
        color VARCHAR(20) NOT NULL DEFAULT '#22c55e',
        creador_docente_id VARCHAR(36) NULL,
        esta_activa BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB;
    `);

    // 3. Tabla niveles
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS niveles (
        id VARCHAR(36) NOT NULL,
        materia_id VARCHAR(36) NOT NULL,
        etapa_academica ENUM('INFANTIL', 'SECUNDARIA', 'AVANZADO') NOT NULL,
        numero_orden INT NOT NULL,
        titulo VARCHAR(120) NOT NULL,
        descripcion VARCHAR(255) NULL,
        xp_recompensa INT NOT NULL DEFAULT 20,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 4. Tabla preguntas
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS preguntas (
        id VARCHAR(36) NOT NULL,
        nivel_id VARCHAR(36) NOT NULL,
        materia_id VARCHAR(36) NOT NULL,
        etapa_academica ENUM('INFANTIL', 'SECUNDARIA', 'AVANZADO') NOT NULL,
        enunciado TEXT NOT NULL,
        puntos INT NOT NULL DEFAULT 10,
        explicacion_formativa TEXT NOT NULL,
        pista VARCHAR(255) NULL,
        docente_autor_id VARCHAR(36) NULL,
        esta_activa BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE,
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 5. Tabla opciones
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS opciones (
        id VARCHAR(36) NOT NULL,
        pregunta_id VARCHAR(36) NOT NULL,
        texto VARCHAR(255) NOT NULL,
        es_correcta BOOLEAN NOT NULL DEFAULT FALSE,
        numero_orden INT NOT NULL DEFAULT 1,
        PRIMARY KEY (id),
        FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 6. Tabla progreso_estudiantes
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS progreso_estudiantes (
        id VARCHAR(36) NOT NULL,
        estudiante_id VARCHAR(36) NOT NULL,
        nivel_id VARCHAR(36) NOT NULL,
        ha_completado BOOLEAN NOT NULL DEFAULT FALSE,
        estrellas_obtenidas INT NOT NULL DEFAULT 0,
        intentos_realizados INT NOT NULL DEFAULT 0,
        mejor_puntaje INT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY uq_estudiante_nivel (estudiante_id, nivel_id),
        FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 7. Tabla intentos_trivia
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS intentos_trivia (
        id VARCHAR(36) NOT NULL,
        estudiante_id VARCHAR(36) NOT NULL,
        nivel_id VARCHAR(36) NOT NULL,
        preguntas_correctas INT NOT NULL DEFAULT 0,
        preguntas_totales INT NOT NULL DEFAULT 0,
        xp_ganada INT NOT NULL DEFAULT 0,
        tiempo_segundos INT NOT NULL DEFAULT 0,
        aprobado BOOLEAN NOT NULL DEFAULT FALSE,
        fecha_intento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);


    // Sincronización de columnas para compatibilidad hacia atrás
    try { await conexion.query('ALTER TABLE materias ADD COLUMN esta_activa BOOLEAN NOT NULL DEFAULT TRUE'); } catch (_) {}
    try { await conexion.query('ALTER TABLE materias ADD COLUMN creador_docente_id VARCHAR(36) NULL'); } catch (_) {}
    try { await conexion.query('ALTER TABLE niveles ADD COLUMN numero_orden INT NOT NULL DEFAULT 1'); } catch (_) {}
    try { await conexion.query('ALTER TABLE niveles ADD COLUMN xp_recompensa INT NOT NULL DEFAULT 25'); } catch (_) {}
    try { await conexion.query('ALTER TABLE preguntas ADD COLUMN materia_id VARCHAR(36) NULL'); } catch (_) {}
    try { await conexion.query("ALTER TABLE preguntas ADD COLUMN etapa_academica ENUM('INFANTIL', 'SECUNDARIA', 'AVANZADO') NOT NULL DEFAULT 'SECUNDARIA'"); } catch (_) {}
    try { await conexion.query('ALTER TABLE preguntas ADD COLUMN esta_activa BOOLEAN NOT NULL DEFAULT TRUE'); } catch (_) {}
    try { await conexion.query('ALTER TABLE preguntas ADD COLUMN docente_autor_id VARCHAR(36) NULL'); } catch (_) {}
    try { await conexion.query('ALTER TABLE opciones ADD COLUMN numero_orden INT NOT NULL DEFAULT 1'); } catch (_) {}

    // Garantizar que las preguntas tengan su materia_id y etapa_academica correctos
    try {
      await conexion.query(`
        UPDATE preguntas p 
        JOIN niveles n ON p.nivel_id = n.id 
        SET p.materia_id = n.materia_id, p.etapa_academica = n.etapa_academica 
        WHERE p.materia_id IS NULL OR p.materia_id = ''
      `);
    } catch (_) {}

    // 9. Sembrar materias si la tabla está vacía
    const [materiasRows]: any = await conexion.query('SELECT COUNT(*) as total FROM materias');
    if (materiasRows[0].total === 0) {
      console.log('🌱 Sembrando materias iniciales...');
      await conexion.query(`
        INSERT INTO materias (id, nombre, descripcion, icono, color)
        VALUES 
          ('mat-matematicas', 'Matemáticas', 'Aritmética, álgebra, cálculo y razonamiento numérico.', 'calculator', '#22c55e'),
          ('mat-ciencias', 'Ciencias Naturales', 'Biología, física, química y el cosmos.', 'microscope', '#38bdf8'),
          ('mat-programacion', 'Programación y Lógica', 'Algoritmos, estructuras y pensamiento computacional.', 'code', '#a855f7'),
          ('mat-historia', 'Historia Universal', 'Civilizaciones, sucesos clave y cultura.', 'landmark', '#f59e0b');
      `);

      // Sembrar niveles
      await conexion.query(`
        INSERT INTO niveles (id, materia_id, etapa_academica, numero_orden, titulo, descripcion, xp_recompensa)
        VALUES 
          ('niv-mat-01', 'mat-matematicas', 'SECUNDARIA', 1, 'Operaciones Básicas y Aritmética', 'Dominio de suma, resta y propiedades de los números.', 20),
          ('niv-mat-02', 'mat-matematicas', 'SECUNDARIA', 2, 'Fracciones y Porcentajes', 'Cálculo de razones y proporciones aplicadas.', 25),
          ('niv-cie-01', 'mat-ciencias', 'SECUNDARIA', 1, 'La Célula y su Estructura', 'Organelos celulares y funciones vitales.', 20),
          ('niv-prog-01', 'mat-programacion', 'AVANZADO', 1, 'Fundamentos de Algoritmos', 'Lógica secuencial, condicionales y ciclos.', 30);
      `);

      // Sembrar preguntas iniciales
      await conexion.query(`
        INSERT INTO preguntas (id, nivel_id, materia_id, etapa_academica, enunciado, puntos, explicacion_formativa, pista)
        VALUES 
          ('prg-01', 'niv-mat-01', 'mat-matematicas', 'SECUNDARIA', '¿Cuál es el resultado de resolver (8 × 4) - (15 ÷ 3)?', 15, 'Siguiendo la jerarquía de operaciones: primero se resuelve la multiplicación (8 × 4 = 32) y la división (15 ÷ 3 = 5), y luego restamos 32 - 5 = 27.', 'Recuerda que la multiplicación y división se realizan antes que la resta.'),
          ('prg-02', 'niv-cie-01', 'mat-ciencias', 'SECUNDARIA', '¿Qué organelo celular es conocido como la central de energía celular porque produce ATP?', 10, 'Las mitocondrias son los organelos encargados de la respiración celular y la generación de ATP.', 'Inicia con la letra M y tiene doble membrana.'),
          ('prg-03', 'niv-prog-01', 'mat-programacion', 'AVANZADO', 'En programación y estructuras de datos, ¿qué estructura sigue el principio LIFO (Last In, First Out)?', 20, 'Una pila (Stack) es una estructura LIFO donde el último elemento apilado es el primero en desapilarse.', 'Imagina una torre de platos limpios: el último que colocas arriba es el primero que tomas.');
      `);

      // Sembrar opciones
      await conexion.query(`
        INSERT INTO opciones (id, pregunta_id, texto, es_correcta, numero_orden)
        VALUES 
          ('op-01', 'prg-01', '27', TRUE, 1),
          ('op-02', 'prg-01', '25', FALSE, 2),
          ('op-03', 'prg-01', '30', FALSE, 3),
          ('op-04', 'prg-01', '17', FALSE, 4),
          ('op-05', 'prg-02', 'Mitocondria', TRUE, 1),
          ('op-06', 'prg-02', 'Ribosoma', FALSE, 2),
          ('op-07', 'prg-02', 'Aparato de Golgi', FALSE, 3),
          ('op-08', 'prg-02', 'Núcleo celular', FALSE, 4),
          ('op-09', 'prg-03', 'Pila (Stack)', TRUE, 1),
          ('op-10', 'prg-03', 'Cola (Queue)', FALSE, 2),
          ('op-11', 'prg-03', 'Lista Enlazada', FALSE, 3),
          ('op-12', 'prg-03', 'Árbol Binario', FALSE, 4);
      `);
      console.log('✅ Datos semilla insertados en MySQL correctamente.');
    }

    conexion.release();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos MySQL:', error);
  }
}
