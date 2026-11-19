/**
 * Samples a 32x32 downscale of a frame and returns a vibrant accent colour.
 * Near-black pixels (luma < 25) are ignored. Dark mode lifts luminance so the
 * cursor glows; Day mode deepens it so the cursor stays visible on light paper.
 */
export function sampleAccent(
  source: CanvasImageSource,
  theme: 'dark' | 'day',
  ctx: CanvasRenderingContext2D,
): string | null {
  ctx.drawImage(source, 0, 0, 32, 32);
  const { data } = ctx.getImageData(0, 0, 32, 32);
  let r = 0, g = 0, b = 0, weight = 0;
  for (let i = 0; i < data.length; i += 4) {
    const R = data[i], G = data[i + 1], B = data[i + 2];
    const luma = 0.299 * R + 0.587 * G + 0.114 * B;
    if (luma < 25) continue;
    const max = Math.max(R, G, B), min = Math.min(R, G, B);
    const sat = max === 0 ? 0 : (max - min) / max;
    const w = 0.3 + sat; // favour vibrant pixels over grey ones
    r += R * w; g += G * w; b += B * w; weight += w;
  }
  if (weight === 0) return null;
  const [h, s, l] = rgbToHsl(r / weight, g / weight, b / weight);
  const sat = Math.min(1, s * 1.35 + 0.1);
  const light = theme === 'dark' ? Math.max(l, 0.62) : Math.min(l, 0.42);
  const [R2, G2, B2] = hslToRgb(h, sat, light);
  return `rgb(${R2}, ${G2}, ${B2})`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}
