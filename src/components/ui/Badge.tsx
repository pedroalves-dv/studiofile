interface BadgeProps {
  variant?: 'default' | 'sale' | 'soldOut' | 'new' | 'featured';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-ink text-canvas',
    sale: 'bg-success text-canvas',
    soldOut: 'bg-muted text-ink',
    new: 'bg-accent text-ink',
    featured: 'border border-accent text-accent bg-transparent',
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-mono uppercase letter-spacing-display ${variants[variant]}`}>
      {children}
    </span>
  );
}
