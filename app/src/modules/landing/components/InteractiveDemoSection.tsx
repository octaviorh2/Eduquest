import { useState } from 'react';
import DuoButton from './DuoButton';
import { Heart, CheckCircle2, XCircle, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';

interface QuestionDemo {
  id: string;
  stageBadge: string;
  subject: string;
  prompt: string;
  options: { id: string; label: string; text: string; isCorrect: boolean }[];
  explanation: string;
  hint: string;
}

export default function InteractiveDemoSection() {
  const sampleQuestion: QuestionDemo = {
    id: 'demo-01',
    stageBadge: 'Secundaria',
    subject: 'Ciencias / Física',
    prompt: '¿Cuál ley física establece que "a toda acción corresponde una reacción de igual magnitud pero en sentido opuesto"?',
    hint: 'Piensa en el retroceso al disparar una flecha o el empuje de un cohete al despegar.',
    options: [
      { id: 'opt-a', label: 'A', text: 'Primera Ley (Principio de Inercia)', isCorrect: false },
      { id: 'opt-b', label: 'B', text: 'Segunda Ley (Fuerza = Masa × Aceleración)', isCorrect: false },
      { id: 'opt-c', label: 'C', text: 'Tercera Ley (Acción y Reacción)', isCorrect: true },
      { id: 'opt-d', label: 'D', text: 'Ley de Gravitación Universal', isCorrect: false }
    ],
    explanation: '¡Exacto! La Tercera Ley de Newton explica que cuando un cuerpo ejerce una fuerza sobre otro, el segundo responde con una fuerza idéntica y en dirección contraria.'
  };

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [showHint, setShowHint] = useState(false);

  const selectedOption = sampleQuestion.options.find(o => o.id === selectedOptionId);
  const isAnswerCorrect = selectedOption?.isCorrect ?? false;

  const handleCheck = () => {
    if (!selectedOptionId) return;
    setHasChecked(true);
    if (!isAnswerCorrect) {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setHasChecked(false);
    setShowHint(false);
  };

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Cabecera */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#FF9600] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Pruébalo en Vivo
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Así se siente jugar en EduQuest
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-bold max-w-xl mx-auto">
            Interactúa con esta pregunta de muestra. Selecciona una opción y experimenta la retroalimentación formativa inmediata estilo Duolingo.
          </p>
        </div>

        {/* Simulador de Pantalla de Trivia */}
        <div className="bg-slate-50 border-2 border-b-[6px] border-slate-200 rounded-3xl overflow-hidden shadow-lg relative">
          
          {/* Barra Superior de Estado del Juego */}
          <div className="bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-sky-100 text-[#1CB0F6] uppercase">
                {sampleQuestion.stageBadge}
              </span>
              <span className="text-xs font-extrabold text-slate-500 uppercase">
                {sampleQuestion.subject}
              </span>
            </div>

            {/* Contador de Vidas */}
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs font-black text-[#FF4B4B]">
              <Heart className="w-4 h-4 fill-[#FF4B4B]" />
              <span>{hearts} / 5</span>
            </div>
          </div>

          {/* Barra de Progreso del Nivel */}
          <div className="w-full bg-slate-200 h-3">
            <div className="bg-[#58CC02] h-full w-2/3 rounded-r-full transition-all duration-300"></div>
          </div>

          {/* Cuerpo de la Pregunta */}
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Pregunta 2 de 3
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-2 leading-snug">
                {sampleQuestion.prompt}
              </h3>
            </div>

            {/* Pista Opcional */}
            {showHint ? (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-amber-800">
                  <span className="font-black">Pista:</span> {sampleQuestion.hint}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1.5 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <Lightbulb className="w-4 h-4" /> ¿Necesitas una pista?
              </button>
            )}

            {/* Opciones de Respuesta en 3D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                let buttonStyle = 'bg-white border-2 border-b-4 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
                let labelStyle = 'bg-slate-100 text-slate-600';

                if (isSelected && !hasChecked) {
                  buttonStyle = 'bg-sky-50/70 border-2 border-b-4 border-[#1CB0F6] text-[#1899D6] shadow-sm -translate-y-0.5';
                  labelStyle = 'bg-[#1CB0F6] text-white';
                }

                if (hasChecked) {
                  if (option.isCorrect) {
                    buttonStyle = 'bg-emerald-50 border-2 border-b-4 border-[#58CC02] text-[#46A302] font-black';
                    labelStyle = 'bg-[#58CC02] text-white';
                  } else if (isSelected && !option.isCorrect) {
                    buttonStyle = 'bg-rose-50 border-2 border-b-4 border-[#FF4B4B] text-[#EA2B2B] font-black';
                    labelStyle = 'bg-[#FF4B4B] text-white';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasChecked}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`p-4 rounded-2xl flex items-center gap-3.5 text-left font-extrabold text-sm sm:text-base transition-all select-none cursor-pointer ${buttonStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${labelStyle}`}>
                      {option.label}
                    </span>
                    <span className="leading-snug">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Inferior de Retroalimentación Deslizante (Estilo Duolingo) */}
          {hasChecked ? (
            <div 
              className={`p-6 sm:p-8 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
                isAnswerCorrect 
                  ? 'bg-[#D7FFB8] border-[#58CC02] text-[#46A302]' 
                  : 'bg-[#FFDFE0] border-[#FF4B4B] text-[#EA2B2B]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm ${
                    isAnswerCorrect ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'
                  }`}
                >
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                  ) : (
                    <XCircle className="w-8 h-8 stroke-[3]" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-black">
                    {isAnswerCorrect ? '¡Excelente respuesta!' : 'Respuesta Incorrecta'}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold mt-1 text-slate-700 max-w-lg">
                    {sampleQuestion.explanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-2xl bg-white border-2 border-b-4 border-slate-200 text-slate-600 font-extrabold text-xs uppercase flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reintentar
                </button>
                <DuoButton
                  variant={isAnswerCorrect ? 'green' : 'red'}
                  size="md"
                  onClick={handleReset}
                  className="grow sm:grow-0"
                >
                  Continuar
                </DuoButton>
              </div>
            </div>
          ) : (
            /* Barra de Acción cuando no ha comprobado */
            <div className="bg-white border-t-2 border-slate-200 p-6 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400 hidden sm:inline">
                {selectedOptionId ? '¡Opción elegida! Ahora haz clic en Comprobar' : 'Selecciona una respuesta'}
              </span>
              <div className="w-full sm:w-auto flex justify-end">
                <DuoButton
                  variant="green"
                  size="md"
                  disabled={!selectedOptionId}
                  onClick={handleCheck}
                  className="w-full sm:w-48"
                >
                  Comprobar
                </DuoButton>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
