import { useEffect, useRef } from "react";
import { resolveColor } from "@/lib/grain-canvas";

interface GrainientProps {
  colors?: string[];
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export function Grainient({
  colors = ["--color-terracotta", "--color-clay-rose", "--color-deep-plum"],
  speed = 5,
  scale = 1,
  noiseIntensity = 1.5,
  rotation = 0,
  className,
}: GrainientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.parentElement!.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas.parentElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Built once per effect run and reused by every animate frame below (rather than
    // `paintGrainOverlay` from lib/grain-canvas, which regenerates a fresh random tile
    // per call) - this canvas redraws continuously via requestAnimationFrame, so a
    // fresh tile per frame would read as flickering static instead of a fixed grain
    // texture sitting still over the animated gradient.
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
    const grainPattern = context.createPattern(grainTile, "repeat");

    // resolved once per colours change, not on every animation frame
    const resolvedColors = colors.map(resolveColor);

    let animationFrameId: number;

    const draw = (timestamp: number) => {
      const { width, height } = canvas;
      const timeSeconds = (timestamp / 1000) * (speed / 10);

      context.save();
      context.translate(width / 2, height / 2);
      context.rotate((rotation * Math.PI) / 180);
      context.scale(scale, scale);
      context.translate(-width / 2, -height / 2);

      const driftAngle = timeSeconds * 0.3;
      const startX = width / 2 + Math.cos(driftAngle) * width;
      const startY = height / 2 + Math.sin(driftAngle) * height;
      const endX = width / 2 - Math.cos(driftAngle) * width;
      const endY = height / 2 - Math.sin(driftAngle) * height;

      const gradient = context.createLinearGradient(startX, startY, endX, endY);
      resolvedColors.forEach((color, index) => {
        gradient.addColorStop(index / Math.max(resolvedColors.length - 1, 1), color);
      });

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.restore();

      if (grainPattern) {
        context.globalAlpha = Math.min(noiseIntensity / 10, 1);
        context.globalCompositeOperation = "overlay";
        context.fillStyle = grainPattern;
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [colors, speed, scale, noiseIntensity, rotation]);

  return <canvas ref={canvasRef} className={className} />;
}
