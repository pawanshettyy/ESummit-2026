"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "../ui/utils";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  isDark?: boolean;
  toggleTheme?: () => void;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  isDark: externalIsDark,
  toggleTheme: externalToggleTheme,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [internalIsDark, setInternalIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use external isDark if provided, otherwise use internal state
  const isDark = externalIsDark !== undefined ? externalIsDark : internalIsDark;

  useEffect(() => {
    // Only set up observer if not using external state
    if (externalIsDark === undefined) {
      const updateTheme = () => {
        setInternalIsDark(document.documentElement.classList.contains("dark"));
      };

      updateTheme();

      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, [externalIsDark]);

  const toggleThemeInternal = useCallback(async () => {
    if (!buttonRef.current) return;

    // Check if View Transition API is supported
    if (!(document as any).startViewTransition) {
      // Fallback for browsers without View Transition API
      if (externalToggleTheme) {
        externalToggleTheme();
      } else {
        flushSync(() => {
          const newTheme = !isDark;
          setInternalIsDark(newTheme);
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        });
      }
      return;
    }

    await (document as any).startViewTransition(() => {
      flushSync(() => {
        if (externalToggleTheme) {
          externalToggleTheme();
        } else {
          const newTheme = !isDark;
          setInternalIsDark(newTheme);
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        }
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, duration, externalToggleTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleThemeInternal}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-primary/10",
        className
      )}
      {...props}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
