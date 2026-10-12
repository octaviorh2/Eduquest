import React from 'react';
import { Heart, Flame, MapPin, Zap, Trophy, Users } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  tag: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <MapPin className="w-7 h-7 text-white" />,
      title: 'Mapa de Aprendizaje en Zigzag',
      description: 'Avanza nodo a nodo en una ruta visual clara. Desbloquea niveles temáticos a medida que dominas los conceptos clave.',
      color: '#58CC02',
      borderColor: '#46A302',
      tag: 'Gamificación'
    },
    {
      icon: <Heart className="w-7 h-7 text-white fill-white" />,
      title: 'Sistema de Vidas Recargables',
      description: 'Comienzas con 5 vidas. Cada error consume una vida, que se regenera pasivamente cada 30 minutos para un aprendizaje saludable.',
      color: '#FF4B4B',
      borderColor: '#EA2B2B',
      tag: 'Ritmo Saludable'
    },
    {
      icon: <Flame className="w-7 h-7 text-white fill-white" />,
      title: 'Racha Diaria de Estudio',
      description: 'Completa al menos una lección diaria para encender tu fuego de racha. Desarrolla constancia académica sin aburrirte.',
      color: '#FF9600',
      borderColor: '#E07700',
      tag: 'Hábito'
    },
    {
      icon: <Zap className="w-7 h-7 text-white" />,
      title: 'Feedback Formativo al Instante',
      description: 'Sin esperas ni misterios: al contestar recibes una explicación pedagógica completa que convierte el error en aprendizaje.',
      color: '#1CB0F6',
      borderColor: '#1899D6',
      tag: 'Pedagogía'
    },
    {
      icon: <Trophy className="w-7 h-7 text-white" />,
      title: 'Ligas y Tablas de Clasificación',
      description: 'Acumula puntos de experiencia (XP) por cada acierto y compite de forma sana en el leaderboard de tu institución.',
      color: '#FFC800',
      borderColor: '#E5A500',
      tag: 'Competencia Sana'
    },
    {
      icon: <Users className="w-7 h-7 text-white" />,
      title: 'Docentes Creadores Dinámicos',
      description: 'Profesores independientes crean y actualizan preguntas y asignaturas en caliente para toda la comunidad estudiantil.',
      color: '#CE82FF',
      borderColor: '#A555EC',
      tag: 'Contenido Vivo'
    }
  ];

  return (
    <section id="caracteristicas" className="py-20 bg-slate-50 border-t-2 border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-emerald-100 px-3.5 py-1 rounded-full">
            ¿Por qué EduQuest funciona?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
            Diseñado para que aprender no sea una obligación
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-bold">
            Tomamos las mecánicas de juego más adictivas y motivadoras del mundo para transformar el refuerzo académico diario.
          </p>
        </div>

        {/* Rejilla de Características en 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 border-2 border-b-[5px] border-slate-200 hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                  style={{
                    backgroundColor: feat.color,
                    borderBottom: `3px solid ${feat.borderColor}`
                  }}
                >
                  {feat.icon}
                </div>
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
                  {feat.tag}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 pt-2">
                {feat.title}
              </h3>
              
              <p className="text-sm font-bold text-slate-500 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
