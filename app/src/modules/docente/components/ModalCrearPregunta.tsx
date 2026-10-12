import { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, MapPin, Zap, CheckCircle2, Lightbulb, Plus } from 'lucide-react';
import type { Materia, Nivel, Pregunta, EtapaAcademica } from '../types';
import DuoButton from '../../landing/components/DuoButton';

interface ModalCrearPreguntaProps {
  isOpen: boolean;
  preguntaAEditar?: Pregunta | null;
  materias: Materia[];
  niveles: Nivel[];
  onClose: () => void;
  onGuardarPregunta: (pregunta: Pregunta) => void;
  onCrearNuevaMateriaRapida: (nombre: string, color: string) => Promise<Materia> | Materia;
}

export default function ModalCrearPregunta({
  isOpen,
  preguntaAEditar,
  materias,
  niveles,
  onClose,
  onGuardarPregunta,
  onCrearNuevaMateriaRapida
}: ModalCrearPreguntaProps) {
  // Estados del Formulario
  const [materiaId, setMateriaId] = useState<string>('');
  const [etapaAcademica, setEtapaAcademica] = useState<EtapaAcademica>('SECUNDARIA');
  const [nivelId, setNivelId] = useState<string>('');
  const [enunciado, setEnunciado] = useState('');
  const [puntos, setPuntos] = useState<number>(10);
  const [explicacion, setExplicacion] = useState('');
  const [pista, setPista] = useState('');

  // 4 Opciones
  const [opciones, setOpciones] = useState([
    { id: '1', texto: '', es_correcta: true },
    { id: '2', texto: '', es_correcta: false },
    { id: '3', texto: '', es_correcta: false },
    { id: '4', texto: '', es_correcta: false }
  ]);

  // Modo creación de materia en caliente
  const [modoCrearMateria, setModoCrearMateria] = useState(false);
  const [nuevoNombreMateria, setNuevoNombreMateria] = useState('');
  const [nuevoColorMateria, setNuevoColorMateria] = useState('#22c55e');

  // Sincronizar al abrir o editar
  useEffect(() => {
    if (preguntaAEditar) {
      setMateriaId(preguntaAEditar.materia_id);
      setEtapaAcademica(preguntaAEditar.etapa_academica);
      setNivelId(preguntaAEditar.nivel_id);
      setEnunciado(preguntaAEditar.enunciado);
      setPuntos(preguntaAEditar.puntos);
      setExplicacion(preguntaAEditar.explicacion_formativa);
      setPista(preguntaAEditar.pista || '');
      setOpciones(
        preguntaAEditar.opciones.map((op, idx) => ({
          id: op.id || String(idx + 1),
          texto: op.texto,
          es_correcta: op.es_correcta
        }))
      );
      setModoCrearMateria(false);
    } else {
      // Valores por defecto al crear nueva
      const primerMateria = materias[0]?.id || '';
      setMateriaId(primerMateria);
      setEtapaAcademica('SECUNDARIA');
      setNivelId(niveles[0]?.id || '');
      setEnunciado('');
      setPuntos(10);
      setExplicacion('');
      setPista('');
      setOpciones([
        { id: '1', texto: '', es_correcta: true },
        { id: '2', texto: '', es_correcta: false },
        { id: '3', texto: '', es_correcta: false },
        { id: '4', texto: '', es_correcta: false }
      ]);
      setModoCrearMateria(false);
    }
  }, [preguntaAEditar, isOpen, materias, niveles]);

  // Sincronizar nivel automáticamente cuando cambie la materia o la etapa
  useEffect(() => {
    if (!preguntaAEditar && materiaId) {
      const nivelesMateria = niveles.filter((n) => n.materia_id === materiaId);
      const coincidentes = nivelesMateria.filter((n) => n.etapa_academica === etapaAcademica);
      if (coincidentes.length > 0) {
        if (!coincidentes.some((n) => n.id === nivelId)) {
          setNivelId(coincidentes[0].id);
        }
      } else if (nivelesMateria.length > 0) {
        if (!nivelesMateria.some((n) => n.id === nivelId)) {
          setNivelId(nivelesMateria[0].id);
        }
      }
    }
  }, [materiaId, etapaAcademica, niveles, preguntaAEditar]);

  if (!isOpen) return null;

  // Filtrar niveles de la materia y etapa seleccionada
  const nivelesFiltrados = niveles.filter(
    (n) => n.materia_id === materiaId && n.etapa_academica === etapaAcademica
  );

  const handleSeleccionarCorrecta = (index: number) => {
    setOpciones((prev) =>
      prev.map((op, idx) => ({
        ...op,
        es_correcta: idx === index
      }))
    );
  };

  const handleCambiarTextoOpcion = (index: number, texto: string) => {
    setOpciones((prev) =>
      prev.map((op, idx) => (idx === index ? { ...op, texto } : op))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar opciones
    const opcionesCompletas = opciones.every((op) => op.texto.trim() !== '');
    if (!opcionesCompletas) {
      alert('Por favor completa el texto de las 4 opciones de respuesta.');
      return;
    }

    let finalMateriaId = materiaId;
    let finalNivelId = nivelId;

    // Si creó materia en caliente
    if (modoCrearMateria && nuevoNombreMateria.trim()) {
      const nuevaMat = await onCrearNuevaMateriaRapida(nuevoNombreMateria.trim(), nuevoColorMateria);
      finalMateriaId = nuevaMat.id;
      finalNivelId = ''; // Será asignado o creado automáticamente por el backend
    }

    const nuevaPregunta: Pregunta = {
      id: preguntaAEditar ? preguntaAEditar.id : `prg-${Date.now()}`,
      materia_id: finalMateriaId,
      etapa_academica: etapaAcademica,
      nivel_id: finalNivelId || (nivelesFiltrados[0]?.id || niveles[0]?.id || ''),
      enunciado: enunciado.trim(),
      explicacion_formativa: explicacion.trim(),
      pista: pista.trim(),
      puntos: Number(puntos),
      orden: preguntaAEditar ? preguntaAEditar.orden : 1,
      opciones: opciones.map((op, idx) => ({
        id: op.id.startsWith('opc-') || op.id.startsWith('op-') ? op.id : `opc-${Date.now()}-${idx}`,
        texto: op.texto.trim(),
        es_correcta: op.es_correcta,
        orden: idx + 1
      }))
    };

    onGuardarPregunta(nuevaPregunta);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 w-full max-w-3xl my-8 overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-slate-50 border-b-2 border-slate-200 px-6 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-lg">
              {preguntaAEditar ? 'Edición Pedagógica' : 'Nueva Pregunta'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {preguntaAEditar ? 'Modificar Pregunta' : 'Crear Pregunta para Trivia'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Fila 1: Materia y Etapa Académica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Selector de Materia */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Materia Asignada
                </label>
                <button
                  type="button"
                  onClick={() => setModoCrearMateria(!modoCrearMateria)}
                  className="text-[11px] font-black text-[#1CB0F6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  {modoCrearMateria ? 'Elegir existente' : '¿No existe? Crear nueva'}
                </button>
              </div>

              {modoCrearMateria ? (
                <div className="bg-sky-50 border-2 border-[#1CB0F6] rounded-2xl p-3 space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#1899D6] block">
                    Nueva Materia en Caliente:
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Nombre (ej. Robótica, Literatura)"
                    value={nuevoNombreMateria}
                    onChange={(e) => setNuevoNombreMateria(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span>Color:</span>
                    <input
                      type="color"
                      value={nuevoColorMateria}
                      onChange={(e) => setNuevoColorMateria(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                  </div>
                </div>
              ) : (
                <select
                  value={materiaId}
                  onChange={(e) => setMateriaId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all cursor-pointer"
                >
                  {materias.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selector de Etapa Académica */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Etapa Académica
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['INFANTIL', 'SECUNDARIA', 'AVANZADO'] as EtapaAcademica[]).map((etapa) => (
                  <button
                    key={etapa}
                    type="button"
                    onClick={() => setEtapaAcademica(etapa)}
                    className={`py-2 px-1 rounded-2xl text-[11px] font-black uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer ${
                      etapaAcademica === etapa
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {etapa === 'INFANTIL' ? 'Infantil' : etapa === 'SECUNDARIA' ? 'Secundaria' : 'Avanzado'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Fila 2: Nivel y Puntos (XP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nivel */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Nivel Asociado
              </label>
              <select
                value={nivelId}
                onChange={(e) => setNivelId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all cursor-pointer"
              >
                {(nivelesFiltrados.length > 0 ? nivelesFiltrados : niveles).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.titulo} ({n.etapa_academica})
                  </option>
                ))}
              </select>
            </div>

            {/* Puntos / XP Asignados */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FF9600]" /> Puntos Otorgados (XP)
              </label>
              <div className="flex items-center gap-2">
                {[10, 15, 20, 25, 50].map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPuntos(pt)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-black border-2 border-b-4 transition-all cursor-pointer ${
                      puntos === pt
                        ? 'border-[#FF9600] bg-amber-50 text-[#FF9600]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    +{pt}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Enunciado de la Pregunta */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Enunciado de la Pregunta *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Escribe la pregunta que leerá el estudiante (ej. ¿Cuál es el resultado de 12 × 8?)"
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* 4 Opciones de Respuesta con Radio para la Correcta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Alternativas de Respuesta (Marca la casilla de la Opción Correcta) *
              </label>
              <span className="text-[11px] font-bold text-[#58CC02] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 1 Correcta obligatoria
              </span>
            </div>

            <div className="space-y-2.5">
              {opciones.map((op, idx) => (
                <div
                  key={op.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                    op.es_correcta
                      ? 'border-[#58CC02] bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  {/* Letra A, B, C, D */}
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    op.es_correcta ? 'bg-[#58CC02] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>

                  {/* Input texto opción */}
                  <input
                    type="text"
                    required
                    placeholder={`Texto de la Opción ${String.fromCharCode(65 + idx)}`}
                    value={op.texto}
                    onChange={(e) => handleCambiarTextoOpcion(idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6]"
                  />

                  {/* Botón Seleccionar Correcta */}
                  <button
                    type="button"
                    onClick={() => handleSeleccionarCorrecta(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      op.es_correcta
                        ? 'bg-[#58CC02] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {op.es_correcta ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" /> Correcta
                      </>
                    ) : (
                      'Marcar'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Explicación Formativa (Feedback en Duolingo) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#46A302] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Explicación Formativa (Feedback pedagógico al responder) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Explica por qué la respuesta correcta es esa y aclara posibles confusiones (ej. La suma de 7 + 8 da 15 porque primero completamos la decena con 3 y luego sumamos los 5 restantes)."
              value={explicacion}
              onChange={(e) => setExplicacion(e.target.value)}
              className="w-full bg-emerald-50/30 border-2 border-emerald-200 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Pista Conceptual (Opcional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Pista Conceptual (Opcional)
            </label>
            <input
              type="text"
              placeholder="Pista breve que el alumno puede solicitar durante la trivia"
              value={pista}
              onChange={(e) => setPista(e.target.value)}
              className="w-full bg-amber-50/30 border-2 border-amber-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>

          {/* Botones del Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-b-4 border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <DuoButton variant="green" size="md" type="submit">
              {preguntaAEditar ? 'Guardar Cambios' : 'Crear Pregunta'}
            </DuoButton>
          </div>

        </form>
      </div>
    </div>
  );
}
