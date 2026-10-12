import {
  LayoutDashboard,
  HelpCircle,
  GraduationCap,
  Plus,
  LogOut,
  BookOpen
} from 'lucide-react';
import type { Usuario } from '../../../context/AuthContext';

interface DocenteSidebarProps {
  tabActiva: 'dashboard' | 'preguntas';
  onCambiarTab: (tab: 'dashboard' | 'preguntas') => void;
  onCrearPreguntaClick: () => void;
  onCrearMateriaClick: () => void;
  onVolverALanding: () => void;
  colapsado: boolean;
  onToggleColapsar: () => void;
  usuario?: Usuario | null;
}

export default function DocenteSidebar({
  tabActiva,
  onCambiarTab,
  onCrearPreguntaClick,
  onCrearMateriaClick,
  onVolverALanding,
  colapsado,
  onToggleColapsar,
  usuario
}: DocenteSidebarProps) {
  // Obtener iniciales reales del usuario autenticado
  const obtenerIniciales = (nombre?: string) => {
    if (!nombre || !nombre.trim()) return 'DO';
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  };

  const iniciales = obtenerIniciales(usuario?.nombre);
  const nombreMostrado = usuario?.nombre || 'Docente';
  const institucionMostrada = usuario?.nombre_institucion || 'Docente Creador';

  return (
    <>
      {/* Overlay para pantallas móviles cuando el sidebar está expandido */}
      {!colapsado && (
        <div
          onClick={onToggleColapsar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r-2 border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none shadow-xs ${
          colapsado
            ? '-translate-x-full md:translate-x-0 md:w-20'
            : 'translate-x-0 w-64'
        }`}
      >
        {/* PARTE SUPERIOR: Único logo limpio (sin segundo botón redundante) */}
        <div className="p-4 border-b-2 border-slate-100 flex items-center justify-center">
          {!colapsado ? (
            <div className="w-full flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 border-b-[3px] border-purple-800 flex items-center justify-center text-white shadow-sm shrink-0">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="truncate">
                <span className="text-xl font-black tracking-tight text-slate-800 font-['Nunito'] block leading-none">
                  Edu<span className="text-[#1CB0F6]">Quest</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 mt-1 block">
                  Panel Docente
                </span>
              </div>
            </div>
          ) : (
            <div 
              onClick={onToggleColapsar}
              className="w-10 h-10 rounded-2xl bg-purple-600 border-b-[3px] border-purple-800 flex items-center justify-center text-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title="Expandir barra lateral"
            >
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* PARTE CENTRAL: Navegación y Acciones con TAMAÑOS EXACTAMENTE IGUALES */}
        <div className="p-3 flex-1 overflow-y-auto space-y-6">
          
          {/* Sección 1: Navegación Principal */}
          <div className="space-y-2">
            {!colapsado && (
              <span className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Navegación
              </span>
            )}

            {/* Opción 1: Dashboard */}
            <button
              type="button"
              onClick={() => onCambiarTab('dashboard')}
              className={`w-full h-11 px-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
                tabActiva === 'dashboard'
                  ? 'bg-purple-100 text-purple-800 border-2 border-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-2 border-transparent'
              } ${colapsado ? 'justify-center px-0' : ''}`}
              title="Dashboard Pedagógico"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!colapsado && <span>Dashboard</span>}
            </button>

            {/* Opción 2: Gestión de Preguntas */}
            <button
              type="button"
              onClick={() => onCambiarTab('preguntas')}
              className={`w-full h-11 px-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
                tabActiva === 'preguntas'
                  ? 'bg-purple-100 text-purple-800 border-2 border-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-2 border-transparent'
              } ${colapsado ? 'justify-center px-0' : ''}`}
              title="Banco de Preguntas"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              {!colapsado && <span>Banco de Preguntas</span>}
            </button>
          </div>

          {/* Sección 2: Acciones Rápidas con Botones de IDÉNTICO TAMAÑO */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {!colapsado && (
              <span className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Acciones
              </span>
            )}

            {!colapsado ? (
              <div className="space-y-2">
                {/* Botón 1: Nueva Pregunta (mismo tamaño h-11) */}
                <button
                  type="button"
                  onClick={onCrearPreguntaClick}
                  className="w-full h-11 px-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-2 border-b-4 border-[#3a8202] text-white flex items-center justify-center font-black text-xs uppercase tracking-wider shadow-xs transition-all active:translate-y-0.5 active:border-b-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                  <span>Nueva Pregunta</span>
                </button>

                {/* Botón 2: Nueva Materia (EXACTAMENTE el mismo tamaño h-11) */}
                <button
                  type="button"
                  onClick={onCrearMateriaClick}
                  className="w-full h-11 px-4 rounded-2xl bg-[#FF9600] hover:bg-[#E08500] border-2 border-b-4 border-[#B86E00] text-white flex items-center justify-center font-black text-xs uppercase tracking-wider shadow-xs transition-all active:translate-y-0.5 active:border-b-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 mr-2 stroke-[2.5]" />
                  <span>Nueva Materia</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {/* Botones icono colapsados (idéntico tamaño w-11 h-11) */}
                <button
                  type="button"
                  onClick={onCrearPreguntaClick}
                  className="w-11 h-11 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-2 border-b-4 border-[#3a8202] text-white flex items-center justify-center active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer shadow-xs"
                  title="Nueva Pregunta"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                </button>
                <button
                  type="button"
                  onClick={onCrearMateriaClick}
                  className="w-11 h-11 rounded-2xl bg-[#FF9600] hover:bg-[#E08500] border-2 border-b-4 border-[#B86E00] text-white flex items-center justify-center active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer shadow-xs"
                  title="Nueva Materia"
                >
                  <BookOpen className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* PARTE INFERIOR: Perfil Real del Docente y Cerrar Sesión */}
        <div className="p-3 border-t-2 border-slate-100 bg-slate-50/70 space-y-2">
          {!colapsado ? (
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border-2 border-[#58CC02] flex items-center justify-center text-xs font-black text-[#46A302] shrink-0">
                {iniciales}
              </div>
              <div className="truncate">
                <span className="text-xs font-black text-slate-800 block truncate" title={nombreMostrado}>
                  {nombreMostrado}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block truncate" title={institucionMostrada}>
                  {institucionMostrada}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`${nombreMostrado} (${institucionMostrada})`}>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border-2 border-[#58CC02] flex items-center justify-center text-xs font-black text-[#46A302]">
                {iniciales}
              </div>
            </div>
          )}

          {/* Botón Cerrar Sesión */}
          <button
            type="button"
            onClick={onVolverALanding}
            className={`w-full h-10 flex items-center gap-2.5 px-3 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              colapsado ? 'justify-center px-0' : ''
            }`}
            title="Cerrar Sesión y Salir"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!colapsado && <span>Cerrar Sesión</span>}
          </button>
        </div>

      </aside>
    </>
  );
}
