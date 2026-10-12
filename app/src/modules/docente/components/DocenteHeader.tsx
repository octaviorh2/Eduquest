import { Menu } from 'lucide-react';
import type { Usuario } from '../../../context/AuthContext';

interface DocenteHeaderProps {
  tabActiva: 'dashboard' | 'preguntas';
  colapsado: boolean;
  onToggleColapsar: () => void;
  usuario?: Usuario | null;
}

export default function DocenteHeader({
  tabActiva,
  colapsado,
  onToggleColapsar,
  usuario
}: DocenteHeaderProps) {
  const nombreCompleto = usuario?.nombre || 'Docente';
  const nombreCorto = usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Docente';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      
      {/* Lado Izquierdo: El único botón hamburguesa para alternar el Sidebar + Título */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleColapsar}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
          title={colapsado ? 'Expandir barra lateral' : 'Contraer barra lateral'}
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Migas de Pan / Título de Sección Minimalista */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl hidden sm:inline-block border border-purple-200">
            Panel Docente
          </span>
          <span className="text-slate-300 hidden sm:inline-block">/</span>
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
            {tabActiva === 'dashboard' ? 'Dashboard Pedagógico' : 'Banco de Preguntas'}
          </h2>
        </div>
      </div>

      {/* Lado Derecho: Estado del Docente y Conexión (Sin botones invasivos de preguntas) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="hidden sm:inline font-bold text-slate-500">Sesión activa:</span>
          <span className="truncate max-w-[160px]" title={nombreCompleto}>{nombreCorto}</span>
        </div>
      </div>

    </header>
  );
}
