import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t-4 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Columna Marca */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#58CC02] border-b-2 border-[#46A302] flex items-center justify-center text-white">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Nunito']">
                Edu<span className="text-[#1CB0F6]">Quest</span>
              </span>
            </div>
            
            <p className="text-sm font-bold text-slate-400 max-w-sm leading-relaxed">
              Plataforma web de aprendizaje gamificado inspirada en Duolingo. Diseñada para hacer del refuerzo escolar una aventura interactiva, motivadora y libre de estrés.
            </p>

            <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
              <span>Hecho con</span>
              <Heart className="w-3.5 h-3.5 text-[#FF4B4B] fill-[#FF4B4B]" />
              <span>para estudiantes y docentes</span>
            </div>
          </div>

          {/* Columna Zonas */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Zonas Educativas</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="#zonas" className="hover:text-[#58CC02] transition-colors">Zona Infantil</a></li>
              <li><a href="#zonas" className="hover:text-[#1CB0F6] transition-colors">Secundaria / Bachillerato</a></li>
              <li><a href="#zonas" className="hover:text-purple-400 transition-colors">Avanzado / Universidad</a></li>
            </ul>
          </div>

          {/* Columna Características */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Mecánicas de Juego</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="#caracteristicas" className="hover:text-white transition-colors">Vidas Recargables (❤️)</a></li>
              <li><a href="#caracteristicas" className="hover:text-white transition-colors">Racha Diaria (🔥)</a></li>
              <li><a href="#caracteristicas" className="hover:text-white transition-colors">Feedback Inmediato</a></li>
              <li><a href="#caracteristicas" className="hover:text-white transition-colors">Mapa en Zigzag</a></li>
            </ul>
          </div>

          {/* Columna Proyecto */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Proyecto</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="#docentes" className="hover:text-white transition-colors">Para Profesores</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Simulador de Trivia</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">UsiSalamanca - Corte I</span></li>
            </ul>
          </div>

        </div>

        {/* Fila Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <p>© 2026 EduQuest. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>MySQL 8.0+</span>
            <span>•</span>
            <span>React & Vite</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
