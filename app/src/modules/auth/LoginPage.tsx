import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Mascot from '../landing/components/Mascot';
import DuoButton from '../landing/components/DuoButton';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const resultado = await login(correo, contrasena);
    setCargando(false);

    if (resultado.ok && resultado.usuario) {
      if (resultado.usuario.rol === 'DOCENTE') {
        navigate('/docente');
      } else {
        navigate('/estudiante');
      }
    } else {
      setError(resultado.error || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between selection:bg-[#58CC02] selection:text-white">
      {/* Barra Superior Simple */}
      <header className="px-6 py-4 flex items-center justify-between border-b-2 border-slate-200 bg-white">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-black text-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Volver al inicio</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] flex items-center justify-center text-white font-black text-xl shadow-sm">
            Q
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Edu<span className="text-[#58CC02]">Quest</span>
          </span>
        </div>
        <Link to="/registro">
          <DuoButton variant="white" size="sm">
            Registrarse
          </DuoButton>
        </Link>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Tarjeta de Inicio de Sesión */}
          <div className="bg-white rounded-3xl border-2 border-b-[6px] border-slate-200 p-8 shadow-xl relative overflow-hidden">
            
            {/* Cabecera con Mascota */}
            <div className="text-center mb-6">
              <div className="flex justify-center -mb-2">
                <Mascot size="sm" expression="happy" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Ingresar a EduQuest
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
                Aprende, responde trivias y sube de nivel
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-4 bg-rose-50 border-2 border-rose-200 text-rose-700 rounded-2xl p-3 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <DuoButton
                  type="submit"
                  variant="green"
                  size="lg"
                  className="w-full"
                  disabled={cargando}
                >
                  {cargando ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                </DuoButton>
              </div>
            </form>

            {/* Pie de Enlace */}
            <div className="mt-6 text-center text-xs font-bold text-slate-500">
              ¿No tienes una cuenta aún?{' '}
              <Link to="/registro" className="text-[#1CB0F6] hover:underline font-black">
                Crea una aquí gratis
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
