import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StageSelectorSection from '../components/StageSelectorSection';
import InteractiveDemoSection from '../components/InteractiveDemoSection';
import FeaturesSection from '../components/FeaturesSection';
import TeachersBanner from '../components/TeachersBanner';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

interface LandingPageProps {
  onIrADocente?: () => void;
}

export default function LandingPage({ onIrADocente }: LandingPageProps) {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode] = useState<'login' | 'register'>('register');

  const handleOpenRegister = () => {
    navigate('/registro');
  };

  const handleOpenLogin = () => {
    navigate('/login');
  };

  const handleIrDocente = () => {
    if (onIrADocente) {
      onIrADocente();
    } else {
      navigate('/docente');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-['Nunito']">
      {/* Barra de Navegación */}
      <Navbar 
        onLoginClick={handleOpenLogin} 
        onRegisterClick={handleOpenRegister} 
        onDocenteClick={handleIrDocente}
      />

      {/* Contenido Principal */}
      <main className="grow">
        {/* Hero Section con Mascota Questie y Botones 3D */}
        <HeroSection 
          onStartClick={handleOpenRegister} 
          onLoginClick={handleOpenLogin} 
        />

        {/* Selector de las 3 Zonas Académicas */}
        <StageSelectorSection />

        {/* Trivia Demo Interactiva Jugable */}
        <InteractiveDemoSection />

        {/* Beneficios y Mecánicas de Gamificación */}
        <FeaturesSection />

        {/* Banner para Docentes y Escuelas */}
        <TeachersBanner onTeacherClick={handleIrDocente} />
      </main>

      {/* Pie de Página */}
      <Footer />

      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={isAuthOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
}
