import React, { useState } from 'react';
import DuoButton from './DuoButton';
import { Rocket, Atom, Code2, Sparkles, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

interface Stage {
  id: 'INFANTIL' | 'SECUNDARIA' | 'AVANZADO';
  name: string;
  badge: string;
  tagline: string;
  color: string;
  borderColor: string;
  bgLight: string;
  icon: React.ReactNode;
  subjects: string[];
  sampleLevel: string;
  xpReward: number;
}

export default function StageSelectorSection() {
  const [selectedStage, setSelectedStage] = useState<'INFANTIL' | 'SECUNDARIA' | 'AVANZADO'>('SECUNDARIA');

  const stages: Stage[] = [
    {
      id: 'INFANTIL',
      name: 'Zona Infantil',
      badge: 'Primaria / Niños',
      tagline: 'Aprende jugando con sumas, lecturas divertidas y naturaleza.',
      color: '#58CC02',
      borderColor: '#46A302',
      bgLight: 'bg-emerald-50',
      icon: <Rocket className="w-8 h-8 text-white" />,
      subjects: ['Sumas y Restas', 'Cuentos y Letras', 'El Mundo Animal'],
      sampleLevel: 'Nivel 1: Sumas Básicas y Conteo',
      xpReward: 50
    },
    {
      id: 'SECUNDARIA',
      name: 'Secundaria',
      badge: 'Bachillerato / Media',
      tagline: 'Desafía tu mente con álgebra, ciencias naturales, física e historia.',
      color: '#1CB0F6',
      borderColor: '#1899D6',
      bgLight: 'bg-sky-50',
      icon: <Atom className="w-8 h-8 text-white" />,
      subjects: ['Álgebra y Funciones', 'Leyes de Newton', 'Química Fundamental'],
      sampleLevel: 'Nivel 1: Principios de Acción y Reacción',
      xpReward: 60
    },
    {
      id: 'AVANZADO',
      name: 'Avanzado',
      badge: 'Pregrado / Universidad',
      tagline: 'Domina algoritmos, cálculo, estructuras de datos y razonamiento abstracto.',
      color: '#CE82FF',
      borderColor: '#A555EC',
      bgLight: 'bg-purple-50',
      icon: <Code2 className="w-8 h-8 text-white" />,
      subjects: ['Complejidad Big O', 'Estructuras de Datos', 'Cálculo Diferencial'],
      sampleLevel: 'Nivel 1: Análisis Asintótico y Búsqueda Binaria',
      xpReward: 80
    }
  ];

  return (
    <section id="zonas" className="py-20 bg-slate-50/70 border-y-2 border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de Sección */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1CB0F6] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Rutas de Aprendizaje
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
            Elige tu Zona Académica
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-bold">
            No importa si estás en los primeros años de colegio o en la universidad: EduQuest adapta las preguntas a tu nivel educativo.
          </p>
        </div>

        {/* Cuadrícula de las 3 Zonas Estilo Tarjetas 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`group cursor-pointer rounded-3xl p-6 sm:p-8 bg-white border-2 border-b-[6px] transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#1CB0F6] shadow-xl -translate-y-1' 
                    : 'border-slate-200 hover:border-slate-300 hover:-translate-y-1'
                }`}
              >
                {/* Badge Activo */}
                {isSelected && (
                  <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#1CB0F6] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Seleccionada
                  </div>
                )}

                <div>
                  {/* Ícono 3D con fondo de color característico */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-105"
                    style={{ 
                      backgroundColor: stage.color,
                      borderBottom: `4px solid ${stage.borderColor}`
                    }}
                  >
                    {stage.icon}
                  </div>

                  {/* Tag y Título */}
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {stage.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 mt-1 mb-2">
                    {stage.name}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6">
                    {stage.tagline}
                  </p>

                  {/* Lista de materias destacadas */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <div className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Materias Destacadas:
                    </div>
                    {stage.subjects.map((subj, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }}></div>
                        <span>{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la tarjeta con Nivel de Muestra */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase text-slate-400 block">Nivel Inicial</span>
                    <span className="text-xs font-extrabold text-slate-800 line-clamp-1">{stage.sampleLevel}</span>
                  </div>
                  <span 
                    className="text-xs font-black px-2.5 py-1 rounded-xl uppercase text-white shrink-0 ml-2 shadow-xs"
                    style={{ backgroundColor: stage.color }}
                  >
                    +{stage.xpReward} XP
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Barra interactiva de confirmación de ruta */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-b-4 border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-b-2 border-emerald-300 flex items-center justify-center text-[#58CC02] font-black text-xl">
              🎯
            </div>
            <div>
              <p className="text-base font-black text-slate-800">
                ¿Listo para comenzar en la <span className="text-[#1CB0F6]">{stages.find(s => s.id === selectedStage)?.name}</span>?
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Puedes cambiar de zona o alternar entre materias individuales y modo mixto en cualquier momento.
              </p>
            </div>
          </div>

          <DuoButton variant="green" size="md" className="shrink-0">
            <span>Explorar Ruta</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </DuoButton>
        </div>

      </div>
    </section>
  );
}
