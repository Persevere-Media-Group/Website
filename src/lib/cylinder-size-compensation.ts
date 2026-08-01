// The drum's rotating layer is scaled up by this much to counteract the size loss
// from 3D perspective, so a word renders visually wider on screen than its own plain
// layout box (e.g. scrollWidth). Callers that measure a CylinderTextRotate to fit it
// against a container (useAutoFitScale) need to inflate their measurement by this
// same factor, or the fit undershoots and the drum overflows its container.
export function getCylinderSizeCompensation(segmentAngle = 30) {
  const segmentAngleRadians = (segmentAngle * Math.PI) / 180;
  const drumRadiusEm = 0.5 / Math.tan(segmentAngleRadians / 2);
  const perspectiveEm = drumRadiusEm * 6;
  return (perspectiveEm + drumRadiusEm) / perspectiveEm;
}
