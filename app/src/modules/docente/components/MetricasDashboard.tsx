import { HelpCircle, BookOpen, MapPin, Zap, Plus, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';
import type { Materia, Nivel, Pregunta } from '../types';
import DuoButton from '../../landing/components/DuoButton';

interface MetricasDashboardProps {
  materias: Materia[];
  niveles: Nivel[];
  preguntas: Pregunta[];
  nombreDocente?: string;
  onIrAPreguntas: () => void;
  onCrearPregunta: () => void;
  onCrearMateria: () => void;
}

export default function MetricasDashboard({
  materias,
  niveles,
  preguntas,
  nombreDocente,
  onIrAPreguntas,
  onCrearPregunta,
  onCrearMateria
}: MetricasDashboardProps) {
  const totalPuntos = preguntas.reduce((sum, p) => sum + p.puntos, 0);

  // Conteo por etapa académica
  const porEtapa = {
    INFANTIL: preguntas.filter(p => p.etapa_academica === 'INFANTIL').length,
    SECUNDARIA: preguntas.filter(p => p.etapa_academica === 'SECUNDARIA').length,
    AVANZADO: preguntas.filter(p => p.etapa_academica === 'AVANZADO').length
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner de Bienvenida del Docente */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border-2 border-purple-950">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 inline-block">
              Centro de Gestión Pedagógica
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              ¡Bienvenido{nombreDocente ? `, ${nombreDocente}` : ''}!
            </h1>
            <p className="text-sm sm:text-base text-purple-100 font-bold leading-relaxed">
              Administra tus materias, elabora preguntas de trivia con explicaciones formativas y estimula el aprendizaje de tus alumnos.
            </p>
          </div>

          {/* Botones de Acción Rápida en 3D */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <DuoButton variant="green" size="md" onClick={onCrearPregunta}>
              <Plus className="w-4 h-4 mr-1 stroke-[3]" />
              Crear Pregunta
            </DuoButton>
            <DuoButton variant="yellow" size="md" onClick={onCrearMateria}>
              <Plus className="w-4 h-4 mr-1 stroke-[3]" />
              Nueva Materia
            </DuoButton>
          </div>
        </div>

        {/* Círculo decorativo */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Tarjetas de Métricas Principales (Estilo 3D Duolingo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Métrica 1: Preguntas Creadas */}
        <div className="bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-b-2 border-emerald-300 flex items-center justify-center text-[#58CC02]">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
              Activas
            </span>
          </div>
          <span className="text-3xl font-black text-slate-800">{preguntas.length}</span>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
            Preguntas en el Banco
          </p>
        </div>

        {/* Métrica 2: Materias Disponibles */}
        <div className="bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-b-2 border-sky-300 flex items-center justify-center text-[#1CB0F6]">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl">
              Asignaturas
            </span>
          </div>
          <span className="text-3xl font-black text-slate-800">{materias.length}</span>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
            Materias Registradas
          </p>
        </div>

        {/* Métrica 3: Niveles en el Mapa */}
        <div className="bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border-b-2 border-purple-300 flex items-center justify-center text-purple-600">
              <MapPin className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl">
              Estaciones
            </span>
          </div>
          <span className="text-3xl font-black text-slate-800">{niveles.length}</span>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
            Niveles en el Zigzag
          </p>
        </div>

        {/* Métrica 4: Puntos XP Asignables */}
        <div className="bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-b-2 border-amber-300 flex items-center justify-center text-[#FF9600]">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">
              XP Total
            </span>
          </div>
          <span className="text-3xl font-black text-slate-800">{totalPuntos} pts</span>
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
            Puntaje Acumulado
          </p>
        </div>

      </div>

      {/* Bloque de Dos Columnas: Distribución por Etapa y Consejo Pedagógico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna 1 y 2: Distribución de Preguntas por Etapa */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border-2 border-b-[5px] border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Cobertura por Etapa Académica
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Preguntas disponibles según la edad de los estudiantes
              </p>
            </div>
            <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              3 Etapas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Etapa Infantil */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border-2 border-emerald-200">
              <span className="text-xs font-black uppercase text-[#46A302] block mb-1">
                Zona Infantil
              </span>
              <span className="text-2xl font-black text-slate-800">{porEtapa.INFANTIL}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Primaria y Básica</p>
            </div>

            {/* Etapa Secundaria */}
            <div className="bg-sky-50/50 rounded-2xl p-5 border-2 border-sky-200">
              <span className="text-xs font-black uppercase text-[#1899D6] block mb-1">
                Secundaria
              </span>
              <span className="text-2xl font-black text-slate-800">{porEtapa.SECUNDARIA}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Bachillerato y Media</p>
            </div>

            {/* Etapa Avanzado */}
            <div className="bg-purple-50/50 rounded-2xl p-5 border-2 border-purple-200">
              <span className="text-xs font-black uppercase text-purple-700 block mb-1">
                Avanzado
              </span>
              <span className="text-2xl font-black text-slate-800">{porEtapa.AVANZADO}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Universidad y Pregrado</p>
            </div>

          </div>

          {/* Acceso a Consultar Preguntas */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-500">
              ¿Quieres modificar enunciados, opciones o puntajes?
            </span>
            <button
              onClick={onIrAPreguntas}
              className="text-xs font-black uppercase text-[#1CB0F6] hover:text-[#1899D6] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver Listado Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Columna 3: Tip Pedagógico Formativo */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-2 border-b-[5px] border-amber-200 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-b-2 border-amber-600 flex items-center justify-center text-white shadow-sm">
              <Lightbulb className="w-6 h-6 stroke-[2.5]" />
            </div>
            
            <h3 className="text-xl font-black text-amber-900 leading-tight">
              El poder del Feedback Inmediato
            </h3>
            
            <p className="text-xs sm:text-sm font-bold text-amber-800 leading-relaxed">
              En EduQuest, cada pregunta que creas incluye una <span className="underline decoration-amber-400">explicación formativa</span>. Cuando el estudiante se equivoca, la plataforma le enseña el concepto exacto antes de que pierda motivación.
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-amber-200 text-xs font-extrabold text-amber-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF9600] shrink-0" />
            <span>+40% de retención en el próximo intento</span>
          </div>
        </div>

      </div>

    </div>
  );
}
