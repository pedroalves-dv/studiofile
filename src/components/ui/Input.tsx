'use client';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-mono uppercase letter-spacing-display mb-2 text-ink">
          {label}
        </label>
      )}
      <div className="flex items-center border-b border-border focus-within:border-accent transition-colors">
        {prefix && <span className="text-muted text-sm mr-2">{prefix}</span>}
        <input
          id={inputId}
          className={`w-full px-0 py-2 bg-transparent text-ink placeholder-muted focus:outline-none ${error ? 'text-error' : ''} ${className || ''}`}
          {...props}
        />
        {suffix && <span className="text-muted text-sm ml-2">{suffix}</span>}
      </div>
      {error && <p className="text-error text-xs font-mono mt-1 uppercase letter-spacing-display">{error}</p>}
      {hint && !error && <p className="text-muted text-xs font-mono mt-1">{hint}</p>}
    </div>
  );
}
