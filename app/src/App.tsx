import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
import LandingPage from './modules/landing/pages/LandingPage';
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import DocentePage from './modules/docente/pages/DocentePage';
import EstudiantePage from './modules/estudiante/pages/EstudiantePage';

// Componente para proteger rutas según autenticación y rol
function RutaProtegida({
  children,
  rolRequerido
}: {
  children: React.ReactNode;
  rolRequerido?: 'DOCENTE' | 'ESTUDIANTE';
}) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-400 bg-slate-50 font-['Nunito']">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-500">Cargando sesión...</span>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    // Si intenta ingresar a un rol distinto, redirige a su panel correspondiente
    return <Navigate to={usuario.rol === 'DOCENTE' ? '/docente' : '/estudiante'} replace />;
  }

  return <>{children}</>;
}

// Componente para rutas públicas (evita login si ya tiene sesión)
function RutaPublica({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;

  if (usuario) {
    return <Navigate to={usuario.rol === 'DOCENTE' ? '/docente' : '/estudiante'} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta 1: Landing Page pública */}
          <Route path="/" element={<LandingPage />} />

          {/* Ruta 2: Inicio de Sesión */}
          <Route
            path="/login"
            element={
              <RutaPublica>
                <LoginPage />
              </RutaPublica>
            }
          />

          {/* Ruta 3: Registro de Usuario */}
          <Route
            path="/registro"
            element={
              <RutaPublica>
                <RegisterPage />
              </RutaPublica>
            }
          />

          {/* Ruta 4: Portal del Docente (Protegido para DOCENTE) */}
          <Route
            path="/docente"
            element={
              <RutaProtegida rolRequerido="DOCENTE">
                <DocentePage />
              </RutaProtegida>
            }
          />

          {/* Ruta 5: Portal del Estudiante (Protegido para ESTUDIANTE) */}
          <Route
            path="/estudiante"
            element={
              <RutaProtegida rolRequerido="ESTUDIANTE">
                <EstudiantePage />
              </RutaProtegida>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
