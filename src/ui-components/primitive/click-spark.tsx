import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// canvas strokeStyle can't read CSS custom properties on its own, this looks the value up manually.
// pass a CSS variable name (e.g. "--color-ivory") or a literal colour string, both work.
function resolveSparkColor(colorOrVariableName: string): string {
  if (!colorOrVariableName.startsWith("--")) {
    return colorOrVariableName;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(colorOrVariableName).trim();
}

export function ClickSpark({
  sparkColor = "--color-ivory",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  className,
  style,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

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

  const applyEasing = useCallback(
    (progress: number) => {
      switch (easing) {
        case "linear":
          return progress;
        case "ease-in":
          return progress * progress;
        case "ease-in-out":
          return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        default:
          return progress * (2 - progress);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // resolved fresh whenever sparkColor changes, so it always reflects the current CSS variable value
    const resolvedSparkColor = resolveSparkColor(sparkColor);

    let animationFrameId: number;

    const draw = (timestamp: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = applyEasing(elapsed / duration);
        const travelDistance = progress * sparkRadius * extraScale;
        const remainingLength = sparkSize * (1 - progress);

        const startX = spark.x + travelDistance * Math.cos(spark.angle);
        const startY = spark.y + travelDistance * Math.sin(spark.angle);
        const endX = spark.x + (travelDistance + remainingLength) * Math.cos(spark.angle);
        const endY = spark.y + (travelDistance + remainingLength) * Math.sin(spark.angle);

        context.strokeStyle = resolvedSparkColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();

        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [sparkColor, sparkSize, sparkRadius, duration, extraScale, applyEasing]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    const clickY = event.clientY - bounds.top;
    const now = performance.now();

    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, index) => ({
      x: clickX,
      y: clickY,
      angle: (2 * Math.PI * index) / sparkCount,
      startTime: now,
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <div className={className} style={style} onClick={handleClick}>
      {/* z-10 so the spark strokes paint above any background layer (e.g. Grainient)
          also placed inside this wrapper without an explicit z-index of its own */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />
      {children}
    </div>
  );
}
