import { useEffect, useRef, useState, type ReactNode } from "react";

interface GrainTextProps {
  children: ReactNode;
  /** CSS variable name (e.g. "--color-ivory") or a literal colour string */
  color?: string;
  /** grain texture strength, same scale as Grainient's noiseIntensity */
  noiseIntensity?: number;
  className?: string;
}

// canvas fillStyle can't read CSS custom properties on its own, this looks the value up manually.
function resolveColor(colorOrVariableName: string): string {
  if (!colorOrVariableName.startsWith("--")) {
    return colorOrVariableName;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(colorOrVariableName).trim();
}

/**
 * A solid-colour text fill textured with the same random-noise grain as Grainient,
 * but static: no drifting gradient, no rotation, just one flat colour roughed up
 * a little. Renders the colour as a plain fallback until the canvas texture is
 * ready, then swaps to a background-clip: text image of it.
 */
export function GrainText({
  children,
  color = "--color-ivory",
  noiseIntensity = 1.5,
  className,
}: GrainTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    function render() {
      const { width, height } = el!.getBoundingClientRect();
      if (!width || !height) return;

      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      ctx.fillStyle = resolveColor(color);
      ctx.fillRect(0, 0, width, height);

      // same grain generation as Grainient: a random monochrome tile, overlay-blended
      const grainTile = document.createElement("canvas");
      grainTile.width = 128;
      grainTile.height = 128;
      const grainContext = grainTile.getContext("2d")!;
      const grainData = grainContext.createImageData(128, 128);
      for (let i = 0; i < grainData.data.length; i += 4) {
        const grainValue = Math.random() * 255;
        grainData.data[i] = grainValue;
        grainData.data[i + 1] = grainValue;
        grainData.data[i + 2] = grainValue;
        grainData.data[i + 3] = 255;
      }
      grainContext.putImageData(grainData, 0, 0);
      const grainPattern = ctx.createPattern(grainTile, "repeat");

      if (grainPattern) {
        ctx.globalAlpha = Math.min(noiseIntensity / 10, 1);
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }

      setBgImage(canvas.toDataURL());
    }

    render();
    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [color, noiseIntensity]);

  return (
    <span
      ref={spanRef}
      className={`inline-block ${bgImage ? "bg-cover bg-center bg-clip-text text-transparent" : ""} ${className ?? ""}`}
      style={{
        color: bgImage ? undefined : color.startsWith("--") ? `var(${color})` : color,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      }}
    >
      {children}
    </span>
  );
}
