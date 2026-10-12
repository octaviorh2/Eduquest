import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Lightbulb, Zap, BookOpen, MapPin } from 'lucide-react';
import type { Materia, Nivel, Pregunta } from '../types';
import DuoButton from '../../landing/components/DuoButton';

interface ListaPreguntasProps {
  preguntas: Pregunta[];
  materias: Materia[];
  niveles: Nivel[];
  onCrearPregunta: () => void;
  onCrearMateria: () => void;
  onEditarPregunta: (pregunta: Pregunta) => void;
  onEliminarPregunta: (id: string) => void;
}

export default function ListaPreguntas({
  preguntas,
  materias,
  niveles,
  onCrearPregunta,
  onCrearMateria,
  onEditarPregunta,
  onEliminarPregunta
}: ListaPreguntasProps) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroMateria, setFiltroMateria] = useState<string>('TODAS');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('TODAS');

  // Filtrado de preguntas
  const preguntasFiltradas = preguntas.filter((p) => {
    const coincideTexto = p.enunciado.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.explicacion_formativa.toLowerCase().includes(busqueda.toLowerCase());
    const coincideMateria = filtroMateria === 'TODAS' || p.materia_id === filtroMateria;
    const coincideEtapa = filtroEtapa === 'TODAS' || p.etapa_academica === filtroEtapa;

    return coincideTexto && coincideMateria && coincideEtapa;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Barra Superior: Título y Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl">
            Gestión de Contenido
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            Banco Pedagógico de Preguntas
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
            Crea, edita o elimina reactivos formativos, asigna puntaje de XP y vincula cada pregunta a su materia y nivel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
          <DuoButton variant="yellow" size="sm" onClick={onCrearMateria} className="grow sm:grow-0">
            <Plus className="w-4 h-4 mr-1 stroke-[3]" />
            Nueva Materia
          </DuoButton>
          <DuoButton variant="green" size="md" onClick={onCrearPregunta} className="grow sm:grow-0">
            <Plus className="w-4 h-4 mr-1 stroke-[3]" />
            Nueva Pregunta
          </DuoButton>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-xs">
        
        {/* Input de Búsqueda */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por enunciado o explicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
          />
        </div>

        {/* Filtro por Materia */}
        <div className="sm:col-span-3">
          <select
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all cursor-pointer"
          >
            <option value="TODAS">Todas las Materias</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Etapa Académica */}
        <div className="sm:col-span-3">
          <select
            value={filtroEtapa}
            onChange={(e) => setFiltroEtapa(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all cursor-pointer"
          >
            <option value="TODAS">Todas las Etapas</option>
            <option value="INFANTIL">Zona Infantil</option>
            <option value="SECUNDARIA">Secundaria</option>
            <option value="AVANZADO">Avanzado</option>
          </select>
        </div>

      </div>

      {/* Lista de Preguntas */}
      <div className="space-y-4">
        {preguntasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-700">No se encontraron preguntas</h3>
              <p className="text-xs sm:text-sm font-bold text-slate-400 max-w-sm mx-auto mt-1">
                No hay preguntas que coincidan con los criterios seleccionados. Prueba cambiando los filtros o crea una nueva pregunta.
              </p>
            </div>
            <DuoButton variant="green" size="sm" onClick={onCrearPregunta}>
              <Plus className="w-4 h-4 mr-1 stroke-[3]" /> Crear Pregunta
            </DuoButton>
          </div>
        ) : (
          preguntasFiltradas.map((pregunta, index) => {
            const materia = materias.find((m) => m.id === pregunta.materia_id);
            const nivel = niveles.find((n) => n.id === pregunta.nivel_id);

            return (
              <div
                key={pregunta.id}
                className="bg-white rounded-3xl p-6 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 transition-all shadow-xs space-y-4"
              >
                {/* Header de la Pregunta: Metadatos y Botones */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
                      #{index + 1}
                    </span>

                    {/* Badge Materia */}
                    <span 
                      className="px-2.5 py-1 rounded-xl text-xs font-black text-white flex items-center gap-1 shadow-xs"
                      style={{ backgroundColor: materia?.color || (pregunta as any).materia_color || '#58CC02' }}
                    >
                      <BookOpen className="w-3 h-3" />
                      {materia?.nombre || (pregunta as any).materia_nombre || 'Materia'}
                    </span>

                    {/* Badge Nivel */}
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {nivel?.titulo || (pregunta as any).nivel_titulo || 'Nivel General'}
                    </span>

                    {/* Badge Etapa */}
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                      {pregunta.etapa_academica}
                    </span>
                  </div>

                  {/* Puntaje y Acciones */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-[#FF9600] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-[#FF9600]" />
                      +{pregunta.puntos} XP
                    </span>

                    {/* Botón Editar */}
                    <button
                      onClick={() => onEditarPregunta(pregunta)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-[#1CB0F6] border border-slate-200 transition-colors cursor-pointer"
                      title="Editar Pregunta"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar la pregunta: "${pregunta.enunciado}"?`)) {
                          onEliminarPregunta(pregunta.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-[#FF4B4B] border border-slate-200 transition-colors cursor-pointer"
                      title="Eliminar Pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Enunciado */}
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                    {pregunta.enunciado}
                  </h4>
                </div>

                {/* Grid de las 4 Opciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {(pregunta.opciones || []).map((opcion, i) => (
                    <div
                      key={opcion.id}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                        opcion.es_correcta
                          ? 'bg-emerald-50/80 border-[#58CC02] text-[#46A302]'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          opcion.es_correcta ? 'bg-[#58CC02] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opcion.texto}</span>
                      </div>

                      {opcion.es_correcta ? (
                        <CheckCircle2 className="w-4 h-4 text-[#58CC02] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Explicación Formativa y Pista */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3 text-xs">
                  <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 flex-1">
                    <span className="font-black text-[#46A302] block mb-0.5">
                      💡 Explicación Formativa (Feedback para el alumno):
                    </span>
                    <p className="text-slate-600 font-bold leading-relaxed">
                      {pregunta.explicacion_formativa}
                    </p>
                  </div>

                  {pregunta.pista && (
                    <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100 flex-1">
                      <span className="font-black text-amber-700 block mb-0.5 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Pista Conceptual:
                      </span>
                      <p className="text-slate-600 font-bold leading-relaxed">
                        {pregunta.pista}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
