"use client";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "suffix"
> {
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
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="px-1 block text-base mb-1 text-light"
        >
          {label}
        </label>
      )}
      <div className="flex items-center rounded-lg border border-stroke focus-within:border-ink transition-colors bg-white overflow-hidden">
        {prefix && <span className="text-muted text-base mr-2">{prefix}</span>}
        <input
          id={inputId}
          className={`w-full px-4 py-2 bg-transparent text-ink placeholder-light text-base focus:outline-none ${error ? "text-error" : ""} ${className || ""}`}
          {...props}
        />
        {suffix && <span className="text-muted text-base ml-2">{suffix}</span>}
      </div>
      {error && <p className="text-error text-base mt-1">{error}</p>}
      {hint && !error && <p className="text-muted text-base mt-1">{hint}</p>}
    </div>
  );
}
