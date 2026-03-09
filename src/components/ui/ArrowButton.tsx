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
      <span className="relative inline-flex items-center">
  <span className="absolute -left-5 opacity-0 -translate-x-3 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-3">
    →
  </span>
  <span className="transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2">
    {label}
  </span>
</span>
    </button>
  );
}