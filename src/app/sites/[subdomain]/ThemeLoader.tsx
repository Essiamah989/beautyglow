'use client';

import { useEffect, useState } from 'react';

interface ThemeLoaderProps {
  theme: string;
  children: React.ReactNode;
}

/**
 * Dynamically loads only the active theme's CSS.
 * Each theme CSS is imported via dynamic import().
 * This prevents all 4 themes from conflicting.
 */
export default function ThemeLoader({ theme, children }: ThemeLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      switch (theme) {
        case 'blanc':
          await import('./blanc.css');
          break;
        case 'eclat':
          await import('./eclat.css');
          break;
        case 'azur':
          await import('./azur.css');
          break;
        case 'lumiere':
        default:
          await import('./lumiere.css');
          break;
      }
      setLoaded(true);
    };
    loadTheme();
  }, [theme]);

  // Render children immediately - CSS will apply once loaded
  return <>{children}</>;
}
