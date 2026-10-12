
export type DuoButtonVariant = 'green' | 'blue' | 'white' | 'yellow' | 'red';
export type DuoButtonSize = 'sm' | 'md' | 'lg';

interface DuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DuoButtonVariant;
  size?: DuoButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function DuoButton({
  variant = 'green',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: DuoButtonProps) {
  const variantStyles: Record<DuoButtonVariant, string> = {
    green: 'bg-[#58CC02] border-b-[4px] border-[#46A302] text-white hover:bg-[#61E002] active:border-b-[1px]',
    blue: 'bg-[#1CB0F6] border-b-[4px] border-[#1899D6] text-white hover:bg-[#2bd0ff] active:border-b-[1px]',
    white: 'bg-white border-2 border-b-[4px] border-[#E5E5E5] text-[#1CB0F6] hover:bg-[#F7F7F7] active:border-b-[2px] active:border-[#CECECE]',
    yellow: 'bg-[#FFC800] border-b-[4px] border-[#E5A500] text-white hover:bg-[#FFD21A] active:border-b-[1px]',
    red: 'bg-[#FF4B4B] border-b-[4px] border-[#EA2B2B] text-white hover:bg-[#FF5E5E] active:border-b-[1px]'
  };

  const sizeStyles: Record<DuoButtonSize, string> = {
    sm: 'py-2 px-4 text-xs font-extrabold tracking-wider rounded-xl',
    md: 'py-3 px-6 text-sm md:text-base font-extrabold tracking-wider rounded-2xl',
    lg: 'py-4 px-8 text-base md:text-lg font-black tracking-wide rounded-2xl'
  };

  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed transform-none active:transform-none border-b-[4px]' 
    : 'cursor-pointer active:translate-y-[3px] transition-all duration-75';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none uppercase font-black text-center ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
