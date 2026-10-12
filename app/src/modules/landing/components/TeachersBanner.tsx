import DuoButton from './DuoButton';
import { GraduationCap, BookOpen, CheckCircle } from 'lucide-react';

interface TeachersBannerProps {
  onTeacherClick?: () => void;
}

export default function TeachersBanner({ onTeacherClick }: TeachersBannerProps) {
  return (
    <section id="docentes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border-4 border-indigo-950">
          
          {/* Círculos decorativos en el fondo */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-purple-300" />
                Para Docentes y Educadores
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Crea tus propias materias y desafía a tus alumnos
              </h2>
              
              <p className="text-sm sm:text-base text-purple-100 font-bold max-w-2xl leading-relaxed">
                EduQuest le da superpoderes a los profesores: diseña rutas de aprendizaje en zigzag, agrega preguntas formativas con explicaciones detalladas y observa el entusiasmo de tus estudiantes al competir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-extrabold text-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin aprobación previa de colegios</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Editor dinámico de preguntas y opciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Separación clara por etapa académica</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Métricas de aciertos e intentos de trivia</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center w-full max-w-xs space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-purple-500 border-b-2 border-purple-700 mx-auto flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Panel de Docente</h4>
                  <p className="text-xs text-purple-200 font-bold mt-1">Crea asignaturas en caliente</p>
                </div>
                <DuoButton
                  variant="yellow"
                  size="md"
                  fullWidth
                  onClick={onTeacherClick}
                >
                  Unirse como Docente
                </DuoButton>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
