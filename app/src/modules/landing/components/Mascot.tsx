
interface MascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'excited' | 'proud';
}

export default function Mascot({ 
  className = '', 
  size = 'lg',
  expression = 'happy' 
}: MascotProps) {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-56 h-56 md:w-64 md:h-64',
    xl: 'w-72 h-72 md:w-80 md:h-80'
  };

  return (
    <div className={`relative inline-block ${sizeMap[size]} ${className}`}>
      {/* SVG del búho explorador de EduQuest estilo Duolingo */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sombras y gradientes limpios */}
          <linearGradient id="bodyGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#61E002" />
            <stop offset="100%" stopColor="#58CC02" />
          </linearGradient>
          <linearGradient id="bellyCream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F9E8" />
          </linearGradient>
          <linearGradient id="beakOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9600" />
            <stop offset="100%" stopColor="#E07700" />
          </linearGradient>
        </defs>

        {/* Pies del búho (Patitas 3D naranjas) */}
        <ellipse cx="78" cy="180" rx="18" ry="8" fill="#E07700" />
        <ellipse cx="78" cy="177" rx="16" ry="7" fill="#FF9600" />
        <ellipse cx="122" cy="180" rx="18" ry="8" fill="#E07700" />
        <ellipse cx="122" cy="177" rx="16" ry="7" fill="#FF9600" />

        {/* Cuerpo Principal Verde redondeado (Forma de pera amistosa) */}
        <path
          d="M 100 24 
             C 145 24, 168 55, 168 115 
             C 168 165, 145 178, 100 178 
             C 55 178, 32 165, 32 115 
             C 32 55, 55 24, 100 24 Z"
          fill="#46A302"
        />
        <path
          d="M 100 22 
             C 142 22, 164 52, 164 110 
             C 164 160, 142 172, 100 172 
             C 58 172, 36 160, 36 110 
             C 36 52, 58 22, 100 22 Z"
          fill="url(#bodyGreen)"
        />

        {/* Alas (Brazos interactivos) */}
        {/* Ala Izquierda */}
        <path
          d="M 38 90 C 22 105, 18 135, 42 142 C 48 130, 48 105, 38 90 Z"
          fill="#46A302"
        />
        <path
          d="M 39 88 C 24 103, 20 132, 42 138 C 47 127, 47 103, 39 88 Z"
          fill="#58CC02"
        />

        {/* Ala Derecha (Saludando alegremente) */}
        {expression === 'excited' || expression === 'happy' ? (
          <>
            <path
              d="M 160 88 C 182 72, 192 100, 172 125 C 160 115, 156 100, 160 88 Z"
              fill="#46A302"
            />
            <path
              d="M 158 86 C 179 70, 189 97, 170 122 C 158 112, 155 98, 158 86 Z"
              fill="#58CC02"
            />
          </>
        ) : (
          <>
            <path
              d="M 162 90 C 178 105, 182 135, 158 142 C 152 130, 152 105, 162 90 Z"
              fill="#46A302"
            />
            <path
              d="M 161 88 C 176 103, 180 132, 158 138 C 153 127, 153 103, 161 88 Z"
              fill="#58CC02"
            />
          </>
        )}

        {/* Barriga suave y redonda (Estilo Duolingo) */}
        <path
          d="M 100 80 C 128 80, 142 102, 142 136 C 142 162, 126 168, 100 168 C 74 168, 58 162, 58 136 C 58 102, 72 80, 100 80 Z"
          fill="url(#bellyCream)"
        />

        {/* Plumitas de textura en la barriga */}
        <path d="M 90 120 Q 100 126 110 120" stroke="#89E219" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 85 136 Q 100 144 115 136" stroke="#89E219" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Contorno de los ojos (Grandes círculos de búho) */}
        {/* Ojo Izquierdo Fondo */}
        <circle cx="74" cy="74" r="26" fill="#FFFFFF" stroke="#46A302" strokeWidth="3" />
        {/* Ojo Derecho Fondo */}
        <circle cx="126" cy="74" r="26" fill="#FFFFFF" stroke="#46A302" strokeWidth="3" />

        {/* Iris / Pupilas Grandes y Expresivas */}
        <circle cx="78" cy="75" r="14" fill="#2B3942" />
        <circle cx="122" cy="75" r="14" fill="#2B3942" />

        {/* Iris celeste brillante estilo Questie */}
        <circle cx="77" cy="74" r="11" fill="#1CB0F6" />
        <circle cx="123" cy="74" r="11" fill="#1CB0F6" />
        <circle cx="78" cy="75" r="8" fill="#183B56" />
        <circle cx="122" cy="75" r="8" fill="#183B56" />

        {/* Brillos de luz en los ojos */}
        <circle cx="74" cy="70" r="4.5" fill="#FFFFFF" />
        <circle cx="81" cy="78" r="2" fill="#FFFFFF" />
        <circle cx="118" cy="70" r="4.5" fill="#FFFFFF" />
        <circle cx="125" cy="78" r="2" fill="#FFFFFF" />

        {/* Pico Naranja en 3D */}
        <path
          d="M 90 85 Q 100 81 110 85 L 100 102 Z"
          fill="#E07700"
        />
        <path
          d="M 91 84 Q 100 80 109 84 L 100 99 Z"
          fill="url(#beakOrange)"
        />

        {/* Mechón / Plumitas de la cabeza (Antena divertida) */}
        <path
          d="M 94 22 C 90 8, 106 6, 102 22 Z"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="2"
        />
        <path
          d="M 102 22 C 104 12, 115 10, 108 22 Z"
          fill="#61E002"
        />

        {/* Mejillas sonrosadas */}
        <ellipse cx="56" cy="94" rx="7" ry="4" fill="#FF8484" opacity="0.6" />
        <ellipse cx="144" cy="94" rx="7" ry="4" fill="#FF8484" opacity="0.6" />
      </svg>
    </div>
  );
}
