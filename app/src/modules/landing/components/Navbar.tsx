import DuoButton from './DuoButton';
import { Sparkles, Compass, Flame, Heart } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onDocenteClick?: () => void;
}

export default function Navbar({ 
  onLoginClick, 
  onRegisterClick,
  onDocenteClick 
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Logo de EduQuest estilo Duolingo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-b-[3px] border-[#46A302] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#58CC02] font-['Nunito']">
            Edu<span className="text-[#1CB0F6]">Quest</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-[#58CC02] border border-emerald-200 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Gamificado
          </span>
        </div>

        {/* Links rápidos para navegación */}
        <nav className="hidden md:flex items-center gap-6 font-extrabold text-sm text-slate-500 uppercase tracking-wider">
          <a href="#zonas" className="hover:text-[#58CC02] transition-colors flex items-center gap-1.5">
            Zonas
          </a>
          <a href="#caracteristicas" className="hover:text-[#1CB0F6] transition-colors flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#FF4B4B] fill-[#FF4B4B]" /> Beneficios
          </a>
          <a href="#demo" className="hover:text-[#FF9600] transition-colors flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" /> Probar Trivia
          </a>
          <button 
            type="button"
            onClick={onDocenteClick}
            className="text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
          >
            Área Docentes
          </button>
        </nav>

        {/* Botones de acción 3D */}
        <div className="flex items-center gap-3">
          <DuoButton 
            variant="white" 
            size="sm" 
            onClick={onLoginClick}
            className="hidden sm:inline-flex"
          >
            Ingresar
          </DuoButton>
          <DuoButton 
            variant="green" 
            size="sm" 
            onClick={onRegisterClick}
          >
            Empezar Gratis
          </DuoButton>
        </div>

      </div>
    </header>
  );
}
