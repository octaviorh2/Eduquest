# 🎓 EduQuest - Plataforma Web Gamificada de Aprendizaje y Trivias Escolares

> **Transformando el refuerzo académico en una experiencia interactiva, táctil y motivadora inspirada en Duolingo.**

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 📖 Tabla de Contenidos

1. [Acerca del Proyecto](#-acerca-del-proyecto)
2. [Propuesta Pedagógica y Mecánicas Gamificadas](#-propuesta-pedagógica-y-mecánicas-gamificadas)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Requisitos Previos](#-requisitos-previos)
5. [Instrucciones de Instalación y Ejecución](#-instrucciones-de-instalación-y-ejecución)
   - [Paso 1: Clonar el Repositorio](#paso-1-clonar-el-repositorio)
   - [Paso 2: Instalar Dependencias](#paso-2-instalar-dependencias)
   - [Paso 3: ¡Ejecutar Todo el Proyecto con un Solo Comando! 🚀](#paso-3-ejecutar-todo-el-proyecto-con-un-solo-comando-)
6. [Equipo de Desarrollo y Créditos](#-equipo-de-desarrollo-y-créditos)

---

## 💡 Acerca del Proyecto

**EduQuest** es una plataforma educativa diseñada para superar las limitaciones del estudio tradicional basado en talleres densos, guías en fotocopias y cuestionarios estáticos. En el modelo clásico, la retroalimentación llega semanas después del examen y los estudiantes sufren de altos niveles de desinterés.

EduQuest transforma el estudio en una **experiencia de micro-aprendizaje diario** dividida en tres etapas formativas:
1. 🧸 **Zona Infantil:** Aprendizaje básico, interactivo y lúdico para niños y primaria.
2. 🎒 **High School:** Refuerzo curricular y preparatorio para educación secundaria y bachillerato.
3. 🏛️ **Avanzado:** Retos formativos para educación superior, pregrado y nivel universitario.

---

## 🎮 Propuesta Pedagógica y Mecánicas Gamificadas

* **Camino de Niveles en Zigzag:** Mapa ondulado con nodos circulares interactivos que reflejan el estado del estudiante (*Superado con estrellas*, *Activo palpitante* o *Bloqueado*).
* **Modalidad Flexible de Estudio:** El estudiante puede elegir practicar una **Materia específica** o activar el modo **"Todas las materias" (Modo Mixto)** con preguntas interdisciplinarias.
* **Sistema de Vidas (❤️ 5):** Cada fallo descuenta 1 vida. El servidor regenera pasivamente 1 vida cada 30 minutos, previniendo el ensayo y error indiscriminado.
* **Rachas Diarias (🔥) y Experiencia (XP ⚡):** Completar al menos una trivia al día mantiene viva la racha y suma puntos para los rankings.
* **Feedback Formativo Inmediato:** Al contestar, se despliega un panel inferior animado (*verde de felicitación* o *rojo correctivo*) con una justificación teórica que enseña en el instante del error.
* **Docentes Creadores Independientes:** Los profesores no están aislados en una sola institución; crean preguntas y materias en caliente que pueden ser resueltas por cualquier estudiante de la comunidad.
* **Registro Escolar Simplificado:** Los estudiantes ingresan directamente el nombre de su institución educativa como texto libre (`institutionName`), sin depender de paneles complejos de precarga de colegios.

---

## 🛠️ Stack Tecnológico

### Backend (`/api`)
* **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (v20+) con ES Modules nativos (`"type": "module"`).
* **Framework Web:** [Express](https://expressjs.com/) (v5.x).
* **Base de Datos:** [MySQL](https://www.mysql.com/) 8.x en Docker / local mediante cliente optimizado con Connection Pool (`mysql2/promise`).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) con tipado estricto.
* **Ejecución en Desarrollo:** [tsx](https://github.com/privatenumber/tsx) para transpilación y recarga en caliente instantánea.

### Frontend (`/app`)
* **Biblioteca Principal:** [React](https://react.dev/) (v19+).
* **Empaquetador y Servidor Local:** [Vite](https://vitejs.dev/) (compilación ultrarrápida mediante HMR).
* **Estilos y Diseño Táctil:** [Tailwind CSS](https://tailwindcss.com/) configurado con utilidades para botones 3D estilo Duolingo (`active:translate-y-1` y sombras sólidas inferiores).
* **Efectos de Sonido:** Sintetizados en tiempo real mediante **Web Audio API** nativa (sin archivos pesados `.mp3` o errores de red 404).

---

## 💻 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema operativo:

* **[Node.js](https://nodejs.org/)** versión `20.x` o superior.
* **[npm](https://www.npmjs.com/)** versión `10.x` o superior.
* **[Git](https://git-scm.com/)**.
* **[MySQL](https://www.mysql.com/) 8.x** (Instalado de forma local o corriendo en un contenedor de [Docker](https://www.docker.com/)).

---

## 🚀 Instrucciones de Instalación y Configuración Técnica

Sigue estos sencillos pasos para levantar el entorno completo de desarrollo local:

### Paso 1: Clonar el Repositorio

Abre una terminal y clona el proyecto:

```bash
git clone https://github.com/octaviorh2/Eduquest.git
cd Eduquest
```

---

### Paso 2: Configurar la Base de Datos MySQL

1. Asegúrate de tener una instancia de MySQL en ejecución en el puerto `3306`. Si utilizas Docker, puedes levantarla fácilmente:
   ```bash
   docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=123 -p 3306:3306 -d mysql:8.4
   ```

2. **Crear la base de datos** (requisito previo para que el backend pueda conectarse):
   Accede a tu cliente de MySQL o Workbench y ejecuta:
   ```sql
   CREATE DATABASE IF NOT EXISTS eduquest_db;
   ```

> 💡 **Autogeneración del Esquema y Semillas:**  
> **No necesitas importar scripts SQL manuales.** Al encender el servidor backend, el código ejecuta automáticamente `inicializarBaseDeDatos()`, creando todas las tablas relacionales (`usuarios`, `materias`, `niveles`, `preguntas`, `opciones`, `progreso_estudiantes`, `intentos_trivia`) con integridad referencial, actualizando columnas y sembrando las materias y preguntas formativas iniciales de manera limpia.

---

### Paso 3: Configurar Variables de Entorno del Backend

Crea un archivo llamado `.env` dentro de la carpeta `api/` (puedes tomar como referencia `api/.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasena_aqui
DB_NAME=eduquest_db
JWT_SECRET=eduquest_clave_secreta_jwt_2026
```

---

### Paso 4: Instalar Dependencias

Desde la raíz del repositorio, instala las dependencias de la raíz, del backend y del frontend:

```bash
# 1. Dependencias de la raíz (concurrently)
npm install

# 2. Dependencias del Backend
npm install --prefix api

# 3. Dependencias del Frontend
npm install --prefix app
```

---

### Paso 5: ¡Ejecutar Todo el Proyecto con un Solo Comando! 🚀

Gracias a la configuración de `concurrently`, desde la **raíz del proyecto**, simplemente ejecuta:

```bash
npm run dev
```

Este comando levantará en simultáneo:
* 🟦 **API (Backend):** `http://localhost:5000` (con `tsx watch` y conexión activa a MySQL)
* 🟩 **APP (Frontend):** `http://localhost:5173` (con `vite`)

Ambos servicios correrán en la misma terminal con logs diferenciados por colores (`[API]` en azul y `[APP]` en verde). Si detienes el proceso (`Ctrl + C`), ambos se apagarán limpiamente.

---

## 👥 Equipo de Desarrollo y Créditos

* **Proyecto:** EduQuest - Plataforma Web Gamificada
* **Asignatura:** Proyecto Cuatrimestral - Corte I
* **Institución:** Universidad de Salamanca

---
*Desarrollado con dedicación para transformar la educación mediante el juego.* 🚀
