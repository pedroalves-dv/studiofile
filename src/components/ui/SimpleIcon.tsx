interface SimpleIconType {
  svg: string;
  title: string;
}

interface SimpleIconProps {
  icon: SimpleIconType;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export function SimpleIcon({ 
  icon, 
  size = 18, 
  className = '',
  ariaLabel 
}: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
      className={className}
      aria-label={ariaLabel || icon.title}
    />
  );
}