interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const bubbleClasses: Record<NonNullable<TooltipProps["position"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses: Record<NonNullable<TooltipProps["position"]>, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-ink border-4 border-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-ink border-4 border-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-ink border-4 border-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-ink border-4 border-transparent",
};

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className={`absolute ${bubbleClasses[position]} px-2 py-1 bg-ink text-canvas text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none rounded-md`}>
        {content}
        <div className={`absolute ${arrowClasses[position]}`} />
      </div>
    </div>
  );
}
