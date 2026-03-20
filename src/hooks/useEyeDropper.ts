import { useState, useCallback } from 'react';

// Color conversion utilities
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
}

export const useEyeDropper = () => {
  const [isSupported] = useState(() => typeof window !== 'undefined' && 'EyeDropper' in window);
  const [isActive, setIsActive] = useState(false);
  const [color, setColor] = useState<ColorFormats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openEyeDropper = useCallback(async () => {
    if (!isSupported) {
      setError("EyeDropper API is not supported in this browser.");
      return null;
    }

    setIsActive(true);
    setError(null);

    try {
      // @ts-expect-error - EyeDropper might not be in standard TypeScript lib yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      
      const hexColor = result.sRGBHex;
      setColor({
        hex: hexColor,
        rgb: hexToRgb(hexColor),
        hsl: hexToHsl(hexColor)
      });
      return hexColor;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Color selection was cancelled.');
      } else {
        setError('Failed to sample color or permission denied.');
      }
      return null;
    } finally {
      setIsActive(false);
    }
  }, [isSupported]);

  return { isSupported, isActive, color, error, openEyeDropper };
};
