import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = "", alt = "E-Summit 2026" }: LogoProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <img
      src={isDark ? "/assets/esummit-logo-white.png" : "/assets/esummit-logo.png"}
      alt={alt}
      className={className}
    />
  );
}
