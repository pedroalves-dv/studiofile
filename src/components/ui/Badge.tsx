interface BadgeProps {
  variant?: 'default' | 'sale' | 'soldOut' | 'new' | 'featured';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-ink/10 text-ink',
    sale: 'bg-error text-canvas',
    soldOut: 'bg-muted/20 text-muted',
    new: 'bg-accent text-ink',
    featured: 'border border-ink text-ink',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs uppercase tracking-display ${variants[variant]} ${className || ''}`}>
      {children}
    </span>
  );
}
