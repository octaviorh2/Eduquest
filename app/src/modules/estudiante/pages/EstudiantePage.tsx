import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DuoButton from '../../landing/components/DuoButton';
import Mascot from '../../landing/components/Mascot';
import { 
  Heart, 
  Sparkles, 
  Flame, 
  Zap, 
  LogOut, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface Materia {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
}

interface Nivel {
  id: string;
  materia_id: string;
  etapa_academica: string;
  numero_orden: number;
  titulo: string;
  descripcion: string;
  xp_recompensa: number;
}

interface PreguntaJuego {
  id: string;
  enunciado: string;
  puntos: number;
  explicacion_formativa: string;
  pista?: string;
  opciones: {
    id: string;
    texto: string;
    es_correcta: boolean;
  }[];
}

const API_BASE = 'http://localhost:5000/api';

export default function EstudiantePage() {
  const navigate = useNavigate();
  const { usuario, logout, actualizarUsuarioLocal } = useAuth();

  const [etapaSeleccionada, setEtapaSeleccionada] = useState<'INFANTIL' | 'SECUNDARIA' | 'AVANZADO'>('SECUNDARIA');
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [cargandoRuta, setCargandoRuta] = useState(true);

  // Estados del Modo Juego de Trivia
  const [nivelEnJuego, setNivelEnJuego] = useState<Nivel | null>(null);
  const [preguntasJuego, setPreguntasJuego] = useState<PreguntaJuego[]>([]);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [respuestaComprobada, setRespuestaComprobada] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [xpAcumuladaJuego, setXpAcumuladaJuego] = useState(0);
  const [vidasJuego, setVidasJuego] = useState(usuario?.vidas ?? 5);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // Cargar ruta académica del backend
  useEffect(() => {
    async function cargarRuta() {
      setCargandoRuta(true);
      try {
        const res = await fetch(`${API_BASE}/estudiante/ruta/${etapaSeleccionada}`);
        if (res.ok) {
          const data = await res.json();
          setMaterias(data.materias || []);
          setNiveles(data.niveles || []);
        }
      } catch (err) {
        console.error('Error al cargar materias y niveles:', err);
      } finally {
        setCargandoRuta(false);
      }
    }

    cargarRuta();
  }, [etapaSeleccionada]);

  const handleCerrarSesion = () => {
    logout();
    navigate('/');
  };

  // Iniciar Trivia
  const handleIniciarNivel = async (nivel: Nivel) => {
    try {
      const res = await fetch(`${API_BASE}/estudiante/trivia-juego/${nivel.id}`);
      if (res.ok) {
        const preguntas: PreguntaJuego[] = await res.json();
        if (preguntas.length > 0) {
          setNivelEnJuego(nivel);
          setPreguntasJuego(preguntas);
          setIndicePregunta(0);
          setOpcionSeleccionada(null);
          setRespuestaComprobada(false);
          setEsCorrecta(false);
          setMostrarPista(false);
          setXpAcumuladaJuego(0);
          setVidasJuego(usuario?.vidas ?? 5);
          setJuegoTerminado(false);
        } else {
          alert('Este nivel aún no tiene preguntas activas creadas por docentes.');
        }
      }
    } catch (err) {
      console.error('Error al iniciar trivia:', err);
    }
  };

  // Comprobar respuesta
  const handleComprobarRespuesta = () => {
    if (!opcionSeleccionada) return;
    const preguntaActual = preguntasJuego[indicePregunta];
    const op = preguntaActual.opciones.find((o) => o.id === opcionSeleccionada);
    const correcta = Boolean(op?.es_correcta);

    setEsCorrecta(correcta);
    setRespuestaComprobada(true);

    if (correcta) {
      setXpAcumuladaJuego((prev) => prev + preguntaActual.puntos);
    } else {
      setVidasJuego((prev) => Math.max(0, prev - 1));
    }
  };

  // Siguiente pregunta o finalizar trivia
  const handleSiguientePregunta = async () => {
    if (indicePregunta + 1 < preguntasJuego.length && vidasJuego > 0) {
      setIndicePregunta((prev) => prev + 1);
      setOpcionSeleccionada(null);
      setRespuestaComprobada(false);
      setEsCorrecta(false);
      setMostrarPista(false);
    } else {
      // Finalizar trivia y guardar en MySQL
      setJuegoTerminado(true);
      if (usuario && nivelEnJuego) {
        try {
          const res = await fetch(`${API_BASE}/estudiante/completar-trivia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              estudianteId: usuario.id,
              nivelId: nivelEnJuego.id,
              xpGanada: xpAcumuladaJuego,
              aprobada: vidasJuego > 0,
              preguntasCorrectas: Math.round(xpAcumuladaJuego / 10),
              preguntasTotales: preguntasJuego.length
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.usuario) {
              actualizarUsuarioLocal({
                experiencia_total: data.usuario.experiencia_total,
                gemas: data.usuario.gemas,
                dias_racha: data.usuario.dias_racha
              });
            }
          }
        } catch (err) {
          console.error('Error al registrar trivia completada en backend:', err);
        }
      }
    }
  };

  const preguntaActual = preguntasJuego[indicePregunta];

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col selection:bg-[#58CC02] selection:text-white">
      
      {/* 1. Header con Gamificación Duolingo */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] flex items-center justify-center text-white font-black text-2xl shadow-sm">
            Q
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              Edu<span className="text-[#58CC02]">Quest</span>
            </span>
            <span className="block text-[11px] font-bold text-slate-500">
              {usuario?.nombre || 'Estudiante'} {usuario?.nombre_institucion ? `• ${usuario.nombre_institucion}` : ''}
            </span>
          </div>
        </div>

        {/* Marcadores de Gamificación */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Vidas */}
          <div className="flex items-center gap-1.5 bg-rose-50 border-2 border-rose-200 px-3 py-1.5 rounded-2xl">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-black text-sm text-rose-600">{usuario?.vidas ?? 5}</span>
          </div>

          {/* Racha */}
          <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-2xl">
            <Flame className="w-5 h-5 text-[#FF9600] fill-[#FF9600]" />
            <span className="font-black text-sm text-[#FF9600]">{usuario?.dias_racha ?? 1}</span>
          </div>

          {/* Gemas */}
          <div className="flex items-center gap-1.5 bg-sky-50 border-2 border-sky-200 px-3 py-1.5 rounded-2xl">
            <Sparkles className="w-5 h-5 text-[#1CB0F6]" />
            <span className="font-black text-sm text-[#1899D6]">{usuario?.gemas ?? 50}</span>
          </div>

          {/* XP Total */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-200 px-3 py-1.5 rounded-2xl">
            <Zap className="w-5 h-5 text-[#58CC02] fill-[#58CC02]" />
            <span className="font-black text-sm text-[#46A302]">{usuario?.experiencia_total ?? 0} XP</span>
          </div>

          {/* Salir */}
          <button
            onClick={handleCerrarSesion}
            title="Cerrar sesión"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Contenido Principal: Mapa de Ruta o Modal de Trivia en Vivo */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        
        {/* Selector de Etapa Académica */}
        <div className="bg-white rounded-3xl border-2 border-b-4 border-slate-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">Zona de Aprendizaje</h2>
            <p className="text-xs font-bold text-slate-400">Selecciona el nivel escolar para explorar trivias</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {(['INFANTIL', 'SECUNDARIA', 'AVANZADO'] as const).map((etapa) => (
              <button
                key={etapa}
                onClick={() => setEtapaSeleccionada(etapa)}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  etapaSeleccionada === etapa
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {etapa === 'INFANTIL' ? 'Infantil' : etapa === 'SECUNDARIA' ? 'Secundaria' : 'Avanzado'}
              </button>
            ))}
          </div>
        </div>

        {/* Mapa de Materias y Niveles */}
        {cargandoRuta ? (
          <div className="py-20 text-center font-black text-slate-400 animate-pulse">
            Cargando niveles y materias desde MySQL...
          </div>
        ) : (
          <div className="space-y-8">
            {materias.map((materia) => {
              const nivelesDeMateria = niveles.filter((n) => n.materia_id === materia.id);

              return (
                <div 
                  key={materia.id}
                  className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 p-6 sm:p-8 overflow-hidden relative shadow-sm"
                >
                  {/* Encabezado de Materia */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm"
                      style={{ backgroundColor: materia.color }}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">{materia.nombre}</h3>
                      <p className="text-xs font-bold text-slate-500">{materia.descripcion}</p>
                    </div>
                  </div>

                  {/* Niveles en Ruta */}
                  {nivelesDeMateria.length === 0 ? (
                    <div className="py-6 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      Aún no hay niveles para {etapaSeleccionada} en esta materia. Los docentes pueden crearlos en el portal docente.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {nivelesDeMateria.map((nivel) => (
                        <div
                          key={nivel.id}
                          className="bg-slate-50 hover:bg-white border-2 border-b-4 border-slate-200 hover:border-[#58CC02] rounded-2xl p-5 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                                Nivel {nivel.numero_orden}
                              </span>
                              <span className="text-xs font-black text-[#FF9600] flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 fill-[#FF9600]" /> +{nivel.xp_recompensa} XP
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 group-hover:text-[#58CC02] transition-colors">
                              {nivel.titulo}
                            </h4>
                            <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-2">
                              {nivel.descripcion}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/60">
                            <DuoButton
                              variant="green"
                              size="sm"
                              className="w-full flex items-center justify-center gap-2"
                              onClick={() => handleIniciarNivel(nivel)}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              JUGAR TRIVIA
                            </DuoButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. MODAL DE JUEGO DE TRIVIA EN PANTALLA COMPLETA */}
      {nivelEnJuego && preguntaActual && !juegoTerminado && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between selection:bg-[#58CC02] selection:text-white animate-fade-in">
          
          {/* Barra Superior del Juego */}
          <header className="px-6 py-4 border-b-2 border-slate-200 flex items-center justify-between max-w-4xl w-full mx-auto">
            <button
              onClick={() => setNivelEnJuego(null)}
              className="text-slate-400 hover:text-slate-700 font-black text-sm cursor-pointer"
            >
              ✕ Salir
            </button>

            {/* Barra de Progreso */}
            <div className="flex-1 max-w-md mx-6 h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
              <div 
                className="h-full bg-[#58CC02] transition-all duration-300 rounded-full"
                style={{ width: `${((indicePregunta + 1) / preguntasJuego.length) * 100}%` }}
              />
            </div>

            {/* Vidas en Juego */}
            <div className="flex items-center gap-1 text-rose-500 font-black">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span>{vidasJuego}</span>
            </div>
          </header>

          {/* Área de la Pregunta */}
          <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 flex flex-col justify-center">
            
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Pregunta {indicePregunta + 1} de {preguntasJuego.length}
              </span>
              <span className="text-xs font-black text-[#FF9600] flex items-center gap-1">
                <Zap className="w-4 h-4 fill-[#FF9600]" /> +{preguntaActual.puntos} XP
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug mb-6">
              {preguntaActual.enunciado}
            </h3>

            {/* Pista Conceptual */}
            {preguntaActual.pista && (
              <div className="mb-6">
                {!mostrarPista ? (
                  <button
                    type="button"
                    onClick={() => setMostrarPista(true)}
                    className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> ¿Necesitas una pista?
                  </button>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-xs font-bold text-amber-900 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span><strong>Pista:</strong> {preguntaActual.pista}</span>
                  </div>
                )}
              </div>
            )}

            {/* 4 Opciones de Respuesta */}
            <div className="space-y-3">
              {preguntaActual.opciones.map((op) => {
                const seleccionada = opcionSeleccionada === op.id;
                let estiloBorde = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                if (seleccionada && !respuestaComprobada) {
                  estiloBorde = 'border-[#1CB0F6] bg-sky-50 text-[#1899D6]';
                }

                if (respuestaComprobada) {
                  if (op.es_correcta) {
                    estiloBorde = 'border-[#58CC02] bg-emerald-50 text-[#46A302]';
                  } else if (seleccionada && !op.es_correcta) {
                    estiloBorde = 'border-rose-500 bg-rose-50 text-rose-700';
                  }
                }

                return (
                  <button
                    key={op.id}
                    disabled={respuestaComprobada}
                    onClick={() => setOpcionSeleccionada(op.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 font-bold text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer active:translate-y-0.5 ${estiloBorde}`}
                  >
                    <span>{op.texto}</span>
                    {respuestaComprobada && op.es_correcta && (
                      <CheckCircle2 className="w-5 h-5 text-[#58CC02] shrink-0" />
                    )}
                    {respuestaComprobada && seleccionada && !op.es_correcta && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra de Retroalimentación Inferior (Estilo Duolingo) */}
          <footer className={`border-t-2 p-6 transition-all ${
            !respuestaComprobada 
              ? 'border-slate-200 bg-white' 
              : esCorrecta 
                ? 'border-[#58CC02] bg-emerald-100/70 text-[#46A302]' 
                : 'border-rose-400 bg-rose-100/70 text-rose-800'
          }`}>
            <div className="max-w-2xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {!respuestaComprobada ? (
                <>
                  <div className="text-xs font-bold text-slate-400">
                    Selecciona una opción para comprobar
                  </div>
                  <DuoButton
                    variant="green"
                    size="lg"
                    disabled={!opcionSeleccionada}
                    onClick={handleComprobarRespuesta}
                  >
                    COMPROBAR
                  </DuoButton>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-black text-lg">
                      {esCorrecta ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-[#58CC02]" />
                          <span>¡Excelente! +{preguntaActual.puntos} XP</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-rose-600" />
                          <span>Respuesta incorrecta</span>
                        </>
                      )}
                    </div>
                    {/* Explicación Formativa */}
                    <p className="text-xs font-bold max-w-md text-slate-700">
                      <strong>Feedback pedagógico:</strong> {preguntaActual.explicacion_formativa}
                    </p>
                  </div>

                  <DuoButton
                    variant={esCorrecta ? 'green' : 'red'}
                    size="lg"
                    onClick={handleSiguientePregunta}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <span>CONTINUAR</span>
                    <ArrowRight className="w-5 h-5" />
                  </DuoButton>
                </>
              )}
            </div>
          </footer>
        </div>
      )}

      {/* 4. MODAL DE RESUMEN FINAL AL TERMINAR LA TRIVIA */}
      {juegoTerminado && nivelEnJuego && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 p-8 max-w-md w-full text-center shadow-2xl animate-scale-up">
            <div className="flex justify-center mb-3">
              <Mascot size="md" expression={vidasJuego > 0 ? 'excited' : 'happy'} />
            </div>

            <h3 className="text-2xl font-black text-slate-800">
              {vidasJuego > 0 ? '¡Lección Completada!' : '¡Sigue Intentándolo!'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              {vidasJuego > 0 
                ? 'Has dominado este nivel y sumado puntos de experiencia a tu cuenta.' 
                : 'Se acabaron las vidas, pero cada error es una oportunidad para aprender.'}
            </p>

            <div className="my-6 grid grid-cols-2 gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">XP Ganada</span>
                <span className="text-xl font-black text-[#58CC02] flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5 fill-[#58CC02]" /> +{xpAcumuladaJuego}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Vidas Finales</span>
                <span className="text-xl font-black text-rose-500 flex items-center justify-center gap-1">
                  <Heart className="w-5 h-5 fill-rose-500" /> {vidasJuego}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DuoButton
                variant="white"
                size="md"
                className="flex-1 flex items-center justify-center gap-1.5"
                onClick={() => handleIniciarNivel(nivelEnJuego)}
              >
                <RotateCcw className="w-4 h-4" /> Repetir
              </DuoButton>

              <DuoButton
                variant="green"
                size="md"
                className="flex-1"
                onClick={() => {
                  setNivelEnJuego(null);
                  setJuegoTerminado(false);
                }}
              >
                Continuar
              </DuoButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
