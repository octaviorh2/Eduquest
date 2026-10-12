import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DuoButton from './DuoButton';
import { X, GraduationCap, Sparkles, School, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'register',
  onClose
}: AuthModalProps) {
  const navigate = useNavigate();
  const { login, registro } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'ESTUDIANTE' | 'DOCENTE'>('ESTUDIANTE');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setCargando(false);
      if (res.ok && res.usuario) {
        onClose();
        if (res.usuario.rol === 'DOCENTE') {
          navigate('/docente');
        } else {
          navigate('/estudiante');
        }
      } else {
        setError(res.error || 'Credenciales inválidas');
      }
    } else {
      const res = await registro({
        nombre: name,
        correo: email,
        contrasena: password,
        rol: role,
        nombre_institucion: role === 'ESTUDIANTE' ? institutionName : undefined
      });
      setCargando(false);
      if (res.ok && res.usuario) {
        onClose();
        if (res.usuario.rol === 'DOCENTE') {
          navigate('/docente');
        } else {
          navigate('/estudiante');
        }
      } else {
        setError(res.error || 'Error al registrar usuario');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Cabecera del Modal con pestañas */}
        <div className="pt-8 px-8 pb-4 text-center">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === 'register' ? 'Crea tu perfil' : 'Iniciar sesión'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
            {mode === 'register' 
              ? 'Únete gratis a las trivias y compite en el mapa' 
              : 'Bienvenido de vuelta a tu racha de aprendizaje'}
          </p>

          {/* Selector de modo Login / Register */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#58CC02] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1CB0F6] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ingresar
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mb-2 p-3 bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          
          {/* Selector de Rol (Estudiante o Docente) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                ¿Cuál es tu rol?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('ESTUDIANTE')}
                  className={`p-3 rounded-2xl border-2 border-b-4 flex items-center justify-center gap-2 text-xs font-black uppercase cursor-pointer transition-all ${
                    role === 'ESTUDIANTE'
                      ? 'border-[#58CC02] bg-emerald-50 text-[#46A302]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DOCENTE')}
                  className={`p-3 rounded-2xl border-2 border-b-4 flex items-center justify-center gap-2 text-xs font-black uppercase cursor-pointer transition-all ${
                    role === 'DOCENTE'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Docente
                </button>
              </div>
            </div>
          )}

          {/* Campo Nombre (solo en registro) */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Ramírez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Campo Institución Educativa (texto libre, solo estudiantes en registro) */}
          {mode === 'register' && role === 'ESTUDIANTE' && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Colegio o Universidad <span className="text-[10px] text-slate-400 font-bold lowercase">(opcional)</span>
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ej. Colegio San José / U. de Salamanca"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Campo Correo */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Botón de Enviar 3D */}
          <div className="pt-2">
            <DuoButton
              variant={mode === 'register' ? 'green' : 'blue'}
              size="lg"
              className="w-full"
              type="submit"
              disabled={cargando}
            >
              {cargando ? 'PROCESANDO...' : mode === 'register' ? 'Crear Cuenta' : 'Entrar a Jugar'}
            </DuoButton>
          </div>

          <p className="text-[11px] text-center font-bold text-slate-400 pt-2">
            Al registrarte aceptas las políticas pedagógicas de EduQuest.
          </p>
        </form>
      </div>
    </div>
  );
}
