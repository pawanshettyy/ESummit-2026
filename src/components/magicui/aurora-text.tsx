import { ComponentPropsWithoutRef } from "react";
import { cn } from "../ui/utils";

export interface AuroraTextProps extends ComponentPropsWithoutRef<"span"> {
  colors?: string[];
  size?: "sm" | "md" | "lg" | "xl";
}

export function AuroraText({
  children,
  className,
  colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7"],
  size = "md",
  ...props
}: AuroraTextProps) {
  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-5xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-5xl md:text-7xl",
  };

  return (
    <span
      className={cn(
        "relative inline-block font-bold",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span 
        className="relative z-10 bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${colors[4]}, ${colors[0]})`,
          backgroundSize: "200% 100%",
          animation: "aurora 8s ease-in-out infinite",
        }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 blur-xl opacity-50"
        style={{
          background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${colors[4]}, ${colors[0]})`,
          backgroundSize: "200% 100%",
          animation: "aurora-glow 8s ease-in-out infinite",
        }}
      />
    </span>
  );
}
