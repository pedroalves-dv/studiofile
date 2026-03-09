'use client';

interface ArrowButtonProps {
  label: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
  className?: string;
}

export function ArrowButton({ label, type = 'button', onClick, className }: ArrowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative ${className}`}
    >
      <span className="flex items-center justify-center gap-1">
        {/* Arrow — slides in from left, fades in */}
        <span className="absolute -left-4  opacity-0 -translate-x-3 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-1">
          →
        </span>

        {/* Label — nudges right */}
        <span className="transition-transform duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2">
          {label.toUpperCase()}
        </span>
      </span>
    </button>
  );
}