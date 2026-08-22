// Canvas helpers for GrainHeading's grain-texture effect, kept identical to
// Grainient's own noise-generation algorithm.

// canvas fillStyle can't read CSS custom properties on its own, this looks the value up manually.
export function resolveColor(colorOrVariableName: string): string {
  if (!colorOrVariableName.startsWith("--")) {
    return colorOrVariableName;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(colorOrVariableName).trim();
}

// Same noise generation as Grainient: a random monochrome tile, overlay-blended
// onto whatever is already painted on the context within (0, 0, width, height).
export function paintGrainOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  noiseIntensity: number
) {
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
  if (!grainPattern) return;

  ctx.globalAlpha = Math.min(noiseIntensity / 10, 1);
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = grainPattern;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}
