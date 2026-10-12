import { useState } from 'react';
import { X, BookOpen, Palette } from 'lucide-react';
import type { Materia } from '../types';
import DuoButton from '../../landing/components/DuoButton';

interface ModalCrearMateriaProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardarMateria: (nuevaMateria: Materia) => void;
}

const PALETA_COLORES = [
  { label: 'Verde', hex: '#22c55e' },
  { label: 'Celeste', hex: '#38bdf8' },
  { label: 'Púrpura', hex: '#a855f7' },
  { label: 'Ámbar', hex: '#f59e0b' },
  { label: 'Rosa', hex: '#ec4899' },
  { label: 'Índigo', hex: '#6366f1' },
  { label: 'Rojo', hex: '#ef4444' }
];

export default function ModalCrearMateria({
  isOpen,
  onClose,
  onGuardarMateria
}: ModalCrearMateriaProps) {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [icono] = useState('book');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevaMateria: Materia = {
      id: `mat-${Date.now()}`,
      nombre: nombre.trim(),
      icono,
      color,
      descripcion: descripcion.trim() || `Asignatura creada por el docente ${nombre}.`
    };

    onGuardarMateria(nuevaMateria);
    setNombre('');
    setDescripcion('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-amber-50 border-b-2 border-amber-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-950">
                Nueva Materia
              </h3>
              <span className="text-[10px] font-bold text-amber-700 block">
                Agrega una asignatura a tu catálogo
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre de la Materia */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Nombre de la Materia *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Robótica Educativa, Química Orgánica..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
            />
          </div>

          {/* Selector de Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-600" /> Color Temático
            </label>
            <div className="flex items-center gap-2">
              {PALETA_COLORES.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-xl transition-all cursor-pointer ${
                    color === c.hex ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Descripción Breve */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Descripción Pedagógica (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Objetivos o alcance temático de esta materia..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-b-4 border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <DuoButton variant="yellow" size="md" type="submit">
              Guardar Materia
            </DuoButton>
          </div>

        </form>
      </div>
    </div>
  );
}
