import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DocenteSidebar from '../components/DocenteSidebar';
import DocenteHeader from '../components/DocenteHeader';
import MetricasDashboard from '../components/MetricasDashboard';
import ListaPreguntas from '../components/ListaPreguntas';
import ModalCrearPregunta from '../components/ModalCrearPregunta';
import ModalCrearMateria from '../components/ModalCrearMateria';
import type { Materia, Nivel, Pregunta } from '../types';
import { materiasIniciales, nivelesIniciales, preguntasIniciales } from '../datosIniciales';

const API_BASE = 'http://localhost:5000/api';

export default function DocentePage({ onVolverALanding }: { onVolverALanding?: () => void }) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Estado de Navegación por Pestañas (Dashboard vs Gestión de Preguntas)
  const [tabActiva, setTabActiva] = useState<'dashboard' | 'preguntas'>('dashboard');

  // Estado de Colapso del Sidebar (Minimalista)
  const [sidebarColapsado, setSidebarColapsado] = useState<boolean>(false);

  // Estado de Datos en Memoria y Backend MySQL
  const [materias, setMaterias] = useState<Materia[]>(materiasIniciales);
  const [niveles, setNiveles] = useState<Nivel[]>(nivelesIniciales);
  const [preguntas, setPreguntas] = useState<Pregunta[]>(preguntasIniciales);

  // Estados de Modales
  const [modalPreguntaAbierto, setModalPreguntaAbierto] = useState(false);
  const [preguntaAEditar, setPreguntaAEditar] = useState<Pregunta | null>(null);
  const [modalMateriaAbierto, setModalMateriaAbierto] = useState(false);

  // Cargar datos reales desde el Backend MySQL
  useEffect(() => {
    async function cargarDatosBackend() {
      try {
        const [resMaterias, resNiveles, resPreguntas] = await Promise.all([
          fetch(`${API_BASE}/materias`),
          fetch(`${API_BASE}/niveles`),
          fetch(`${API_BASE}/preguntas`)
        ]);

        if (resMaterias.ok) {
          const dataMaterias = await resMaterias.json();
          if (Array.isArray(dataMaterias) && dataMaterias.length > 0) {
            setMaterias(dataMaterias);
          }
        }

        if (resNiveles.ok) {
          const dataNiveles = await resNiveles.json();
          if (Array.isArray(dataNiveles) && dataNiveles.length > 0) {
            setNiveles(
              dataNiveles.map((n: any) => ({
                id: n.id,
                materia_id: n.materia_id,
                etapa_academica: n.etapa_academica,
                numero_nivel: n.numero_orden || n.numero_nivel || 1,
                titulo: n.titulo,
                descripcion: n.descripcion,
                recompensa_experiencia: n.xp_recompensa || n.recompensa_experiencia || 50
              }))
            );
          }
        }

        if (resPreguntas.ok) {
          const dataPreguntas = await resPreguntas.json();
          if (Array.isArray(dataPreguntas)) {
            setPreguntas(dataPreguntas);
          }
        }
      } catch (err) {
        console.warn('Backend no disponible, usando semillas en memoria:', err);
      }
    }

    cargarDatosBackend();
  }, []);

  const handleCerrarSesion = () => {
    logout();
    if (onVolverALanding) {
      onVolverALanding();
    } else {
      navigate('/');
    }
  };

  // Manejador para abrir modal de crear pregunta
  const handleAbrirCrearPregunta = () => {
    setPreguntaAEditar(null);
    setModalPreguntaAbierto(true);
  };

  // Manejador para abrir modal de editar pregunta
  const handleAbrirEditarPregunta = (pregunta: Pregunta) => {
    setPreguntaAEditar(pregunta);
    setModalPreguntaAbierto(true);
  };

  // Guardar o Actualizar Pregunta en MySQL
  const handleGuardarPregunta = async (preguntaGuardada: Pregunta) => {
    const existe = preguntas.some((p) => p.id === preguntaGuardada.id);

    // Enviar a MySQL
    try {
      let res;
      if (existe) {
        res = await fetch(`${API_BASE}/preguntas/${preguntaGuardada.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preguntaGuardada)
        });
      } else {
        res = await fetch(`${API_BASE}/preguntas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preguntaGuardada)
        });
      }

      if (res.ok) {
        const guardadaServidor = await res.json();
        setPreguntas((prev) => {
          if (existe) {
            return prev.map((p) => (p.id === guardadaServidor.id ? guardadaServidor : p));
          } else {
            return [guardadaServidor, ...prev.filter((p) => p.id !== guardadaServidor.id)];
          }
        });

        // Sincronizar niveles por si se autogeneró un nuevo nivel para la materia
        const resNiveles = await fetch(`${API_BASE}/niveles`);
        if (resNiveles.ok) {
          const dataNiveles = await resNiveles.json();
          if (Array.isArray(dataNiveles)) {
            setNiveles(
              dataNiveles.map((n: any) => ({
                id: n.id,
                materia_id: n.materia_id,
                etapa_academica: n.etapa_academica,
                numero_nivel: n.numero_orden || n.numero_nivel || 1,
                titulo: n.titulo,
                descripcion: n.descripcion,
                recompensa_experiencia: n.xp_recompensa || n.recompensa_experiencia || 50
              }))
            );
          }
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error al guardar en MySQL: ${errorData.detalle || errorData.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('Error al persistir pregunta en MySQL:', err);
      alert('Error de conexión al guardar la pregunta en MySQL.');
    }
  };

  // Eliminar Pregunta en MySQL
  const handleEliminarPregunta = async (id: string) => {
    setPreguntas((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_BASE}/preguntas/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error al eliminar pregunta en MySQL:', err);
    }
  };

  // Guardar Materia Nueva en MySQL
  const handleGuardarMateria = async (nuevaMateria: Materia): Promise<Materia | null> => {
    try {
      const res = await fetch(`${API_BASE}/materias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaMateria)
      });

      if (res.ok) {
        const mat = await res.json();
        setMaterias((prev) => [...prev.filter((m) => m.id !== mat.id), mat]);

        // Cargar los 3 niveles automáticos generados en MySQL
        const resNiveles = await fetch(`${API_BASE}/niveles`);
        if (resNiveles.ok) {
          const dataNiveles = await resNiveles.json();
          if (Array.isArray(dataNiveles)) {
            setNiveles(
              dataNiveles.map((n: any) => ({
                id: n.id,
                materia_id: n.materia_id,
                etapa_academica: n.etapa_academica,
                numero_nivel: n.numero_orden || n.numero_nivel || 1,
                titulo: n.titulo,
                descripcion: n.descripcion,
                recompensa_experiencia: n.xp_recompensa || n.recompensa_experiencia || 50
              }))
            );
          }
        }
        return mat;
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Error al crear la materia: ${err.detalle || err.error || 'Error en servidor'}`);
        return null;
      }
    } catch (err) {
      console.error('Error al persistir materia en MySQL:', err);
      alert('Error de conexión al persistir la materia en MySQL.');
      return null;
    }
  };

  // Crear Materia en Caliente en MySQL
  const handleCrearNuevaMateriaRapida = async (nombre: string, color: string): Promise<Materia> => {
    const nueva: Materia = {
      id: `mat-${Date.now().toString(36)}`,
      nombre,
      icono: 'book',
      color,
      descripcion: `Materia creada por el docente: ${nombre}`
    };
    const guardada = await handleGuardarMateria(nueva);
    return guardada || nueva;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-['Nunito'] flex w-full">
      
      {/* Sidebar Lateral Colapsable Minimalista */}
      <DocenteSidebar
        tabActiva={tabActiva}
        onCambiarTab={setTabActiva}
        onCrearPreguntaClick={handleAbrirCrearPregunta}
        onCrearMateriaClick={() => setModalMateriaAbierto(true)}
        onVolverALanding={handleCerrarSesion}
        colapsado={sidebarColapsado}
        onToggleColapsar={() => setSidebarColapsado((prev) => !prev)}
        usuario={usuario}
      />

      {/* Contenedor Principal a Ancho Completo */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Header Superior Minimalista */}
        <DocenteHeader
          tabActiva={tabActiva}
          colapsado={sidebarColapsado}
          onToggleColapsar={() => setSidebarColapsado((prev) => !prev)}
          usuario={usuario}
        />

        {/* Contenido que ocupa TODO el ancho de la pantalla sin límites rígidos de 7xl */}
        <main className="w-full px-4 sm:px-8 lg:px-12 py-8 grow overflow-x-hidden">
          {tabActiva === 'dashboard' ? (
            <MetricasDashboard
              materias={materias}
              niveles={niveles}
              preguntas={preguntas}
              nombreDocente={usuario?.nombre}
              onIrAPreguntas={() => setTabActiva('preguntas')}
              onCrearPregunta={handleAbrirCrearPregunta}
              onCrearMateria={() => setModalMateriaAbierto(true)}
            />
          ) : (
            <ListaPreguntas
              preguntas={preguntas}
              materias={materias}
              niveles={niveles}
              onCrearPregunta={handleAbrirCrearPregunta}
              onCrearMateria={() => setModalMateriaAbierto(true)}
              onEditarPregunta={handleAbrirEditarPregunta}
              onEliminarPregunta={handleEliminarPregunta}
            />
          )}
        </main>
      </div>

      {/* Modal para Crear y Modificar Preguntas */}
      <ModalCrearPregunta
        isOpen={modalPreguntaAbierto}
        preguntaAEditar={preguntaAEditar}
        materias={materias}
        niveles={niveles}
        onClose={() => setModalPreguntaAbierto(false)}
        onGuardarPregunta={handleGuardarPregunta}
        onCrearNuevaMateriaRapida={handleCrearNuevaMateriaRapida}
      />

      {/* Modal para Crear Materia */}
      <ModalCrearMateria
        isOpen={modalMateriaAbierto}
        onClose={() => setModalMateriaAbierto(false)}
        onGuardarMateria={handleGuardarMateria}
      />

    </div>
  );
}
