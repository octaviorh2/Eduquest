import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type RolUsuario = 'ESTUDIANTE' | 'DOCENTE';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  nombre_institucion?: string | null;
  experiencia_total: number;
  vidas: number;
  gemas: number;
  dias_racha?: number;
  etapa_actual?: string | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<{ ok: boolean; error?: string; usuario?: Usuario }>;
  registro: (datos: {
    nombre: string;
    correo: string;
    contrasena: string;
    rol: RolUsuario;
    nombre_institucion?: string;
  }) => Promise<{ ok: boolean; error?: string; usuario?: Usuario }>;
  logout: () => void;
  actualizarUsuarioLocal: (actualizaciones: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/auth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('eduquest_usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('eduquest_token');
  });
  const [cargando, setCargando] = useState<boolean>(true);

  // Verificar sesión activa contra el backend
  useEffect(() => {
    async function verificarSesion() {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsuario(data.usuario);
          localStorage.setItem('eduquest_usuario', JSON.stringify(data.usuario));
        } else {
          // Token expirado o inválido
          logout();
        }
      } catch (err) {
        console.warn('Backend no accesible temporalmente, manteniendo sesión local:', err);
      } finally {
        setCargando(false);
      }
    }

    verificarSesion();
  }, [token]);

  const login = async (correo: string, contrasena: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.error || 'Error al iniciar sesión' };
      }

      setUsuario(data.usuario);
      setToken(data.token);
      localStorage.setItem('eduquest_usuario', JSON.stringify(data.usuario));
      localStorage.setItem('eduquest_token', data.token);

      return { ok: true, usuario: data.usuario };
    } catch (err) {
      console.error('Error de red en login:', err);
      return { ok: false, error: 'No se pudo conectar con el servidor backend.' };
    }
  };

  const registro = async (datos: {
    nombre: string;
    correo: string;
    contrasena: string;
    rol: RolUsuario;
    nombre_institucion?: string;
  }) => {
    try {
      const res = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.error || 'Error al registrar la cuenta' };
      }

      setUsuario(data.usuario);
      setToken(data.token);
      localStorage.setItem('eduquest_usuario', JSON.stringify(data.usuario));
      localStorage.setItem('eduquest_token', data.token);

      return { ok: true, usuario: data.usuario };
    } catch (err) {
      console.error('Error de red en registro:', err);
      return { ok: false, error: 'No se pudo conectar con el servidor backend.' };
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('eduquest_usuario');
    localStorage.removeItem('eduquest_token');
  };

  const actualizarUsuarioLocal = (actualizaciones: Partial<Usuario>) => {
    setUsuario((prev) => {
      if (!prev) return null;
      const nuevo = { ...prev, ...actualizaciones };
      localStorage.setItem('eduquest_usuario', JSON.stringify(nuevo));
      return nuevo;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        login,
        registro,
        logout,
        actualizarUsuarioLocal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
