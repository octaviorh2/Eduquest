import DuoButton from './DuoButton';
import Mascot from './Mascot';
import { Flame, Heart, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onStartClick?: () => void;
  onLoginClick?: () => void;
}

export default function HeroSection({
  onStartClick,
  onLoginClick
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-white via-emerald-50/20 to-white">
      {/* Elementos flotantes decorativos en el fondo */}
      <div className="absolute top-12 left-10 text-emerald-200/50 -rotate-12 select-none pointer-events-none hidden lg:block">
        <Zap className="w-16 h-16 fill-emerald-100" />
      </div>
      <div className="absolute top-24 right-16 text-sky-200/50 rotate-12 select-none pointer-events-none hidden lg:block">
        <Heart className="w-16 h-16 fill-rose-100 text-rose-300" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Izquierdo: Mascota Questie con globo de diálogo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative order-2 lg:order-1">
            
            {/* Globo de diálogo estilo cómic de Duolingo */}
            <div className="relative mb-6 bg-white border-2 border-slate-200 shadow-md rounded-3xl py-3 px-5 max-w-xs text-center animate-bounce-slight">
              <p className="text-sm md:text-base font-extrabold text-slate-700 leading-snug">
                ¡Aprende jugando y desafía a tus compañeros en el mapa! 🚀
              </p>
              {/* Flecha hacia abajo del globo */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
            </div>

            {/* Mascota con animación suave */}
            <div className="animate-float">
              <Mascot size="xl" expression="excited" />
            </div>

            {/* Sombra de suelo para efecto 3D */}
            <div className="w-48 h-5 bg-slate-200/60 rounded-full blur-[2px] mt-2"></div>
          </div>

          {/* Lado Derecho: Contenido de Impacto y Botones 3D */}
          <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2 space-y-6">
            
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#46A302] border border-emerald-300 text-xs md:text-sm font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" />
              ¡La educación escolar se convirtió en un juego!
            </div>

            {/* Título Principal Impactante */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.1]">
              ¡La forma divertida, gratis y efectiva de aprender materias escolares!
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-slate-600 font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Supera trivias por niveles en un mapa en zigzag, gana experiencia (XP), mantén tu racha diaria y aprende de tus errores con explicaciones formativas al instante.
            </p>

            {/* Botones de Llamado a la Acción 3D */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
              <DuoButton
                variant="green"
                size="lg"
                fullWidth
                onClick={onStartClick}
                className="group"
              >
                <span>Empezar Ahora</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </DuoButton>

              <DuoButton
                variant="white"
                size="lg"
                fullWidth
                onClick={onLoginClick}
              >
                Ya tengo una cuenta
              </DuoButton>
            </div>

            {/* Badges de Confianza / Gamificación */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs md:text-sm font-extrabold text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF4B4B] fill-[#FF4B4B]" />
                <span>5 Vidas Recargables</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF9600] fill-[#FF9600]" />
                <span>Rachas Diarias</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1CB0F6]" />
                <span>Feedback Inmediato</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
