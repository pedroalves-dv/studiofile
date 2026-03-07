interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-ink text-canvas text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
        {content}
      </div>
    </div>
  );
}
