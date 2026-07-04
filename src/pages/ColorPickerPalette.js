import { useMemo, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function parseHex(hex) {
  let value = hex.trim().replace(/^#/, '');
  if (value.length === 3) {
    value = value.split('').map((char) => char + char).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error('Enter a valid HEX color (e.g. #14B8A6).');
  }
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHsl(r, g, b) {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (hn < 60) [rn, gn, bn] = [c, x, 0];
  else if (hn < 120) [rn, gn, bn] = [x, c, 0];
  else if (hn < 180) [rn, gn, bn] = [0, c, x];
  else if (hn < 240) [rn, gn, bn] = [0, x, c];
  else if (hn < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

function hexFromHsl(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

const PALETTE_TYPES = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'shades', label: 'Shades' },
  { value: 'tints', label: 'Tints' },
];

function generatePalette(h, s, l, type) {
  switch (type) {
    case 'complementary':
      return [
        { name: 'Base', hex: hexFromHsl(h, s, l) },
        { name: 'Complement', hex: hexFromHsl(h + 180, s, l) },
      ];
    case 'analogous':
      return [
        { name: 'Warm', hex: hexFromHsl(h - 30, s, l) },
        { name: 'Base', hex: hexFromHsl(h, s, l) },
        { name: 'Cool', hex: hexFromHsl(h + 30, s, l) },
      ];
    case 'triadic':
      return [
        { name: 'Primary', hex: hexFromHsl(h, s, l) },
        { name: 'Secondary', hex: hexFromHsl(h + 120, s, l) },
        { name: 'Tertiary', hex: hexFromHsl(h + 240, s, l) },
      ];
    case 'tetradic':
      return [
        { name: 'Base', hex: hexFromHsl(h, s, l) },
        { name: '+90°', hex: hexFromHsl(h + 90, s, l) },
        { name: '+180°', hex: hexFromHsl(h + 180, s, l) },
        { name: '+270°', hex: hexFromHsl(h + 270, s, l) },
      ];
    case 'monochromatic':
      return [-24, -12, 0, 12, 24].map((offset, index) => ({
        name: `Tone ${index + 1}`,
        hex: hexFromHsl(h, s, clamp(l + offset, 8, 92)),
      }));
    case 'shades':
      return [0, -10, -20, -30, -40].map((offset, index) => ({
        name: `Shade ${index + 1}`,
        hex: hexFromHsl(h, s, clamp(l + offset, 5, 95)),
      }));
    case 'tints':
      return [0, 10, 20, 30, 40].map((offset, index) => ({
        name: `Tint ${index + 1}`,
        hex: hexFromHsl(h, s, clamp(l + offset, 5, 95)),
      }));
    default:
      return [{ name: 'Base', hex: hexFromHsl(h, s, l) }];
  }
}

function randomHexColor() {
  const rgb = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function ColorPickerPalette() {
  const [hexInput, setHexInput] = useState('#14B8A6');
  const [paletteType, setPaletteType] = useState('complementary');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const baseColor = useMemo(() => {
    try {
      const rgb = parseHex(hexInput);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { rgb, hsl, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
    } catch {
      return null;
    }
  }, [hexInput]);

  const palette = useMemo(() => {
    if (!baseColor) return [];
    return generatePalette(baseColor.hsl.h, baseColor.hsl.s, baseColor.hsl.l, paletteType);
  }, [baseColor, paletteType]);

  const handlePickerChange = (value) => {
    setHexInput(value.toUpperCase());
    setError('');
  };

  const handleHexChange = (value) => {
    setHexInput(value);
    setError('');
  };

  const handleHexBlur = () => {
    try {
      const rgb = parseHex(hexInput);
      setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRandom = () => {
    setHexInput(randomHexColor());
    setError('');
  };

  const handleCopy = async (label, text) => {
    setError('');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleCopyPalette = async () => {
    const text = palette.map((color) => `${color.name}: ${color.hex}`).join('\n');
    await handleCopy('palette', text);
  };

  const pickerValue = baseColor ? baseColor.hex.toLowerCase() : '#14b8a6';

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Color Picker & Palette Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Color Picker & Palette Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Pick a base color and generate harmonious palettes for your next design — all in your browser.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 lg:grid-cols-[auto,1fr] lg:items-end">
              <div>
                <label htmlFor="palette-picker" className="block text-sm font-bold text-stone-700">
                  Pick a color
                </label>
                <input
                  id="palette-picker"
                  type="color"
                  value={pickerValue}
                  onChange={(e) => handlePickerChange(e.target.value)}
                  className="mt-2 h-16 w-full min-w-[120px] cursor-pointer rounded-xl border border-stone-200 bg-stone-50 lg:w-32"
                />
              </div>
              <div>
                <label htmlFor="palette-hex" className="block text-sm font-bold text-stone-700">
                  HEX
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="palette-hex"
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    onBlur={handleHexBlur}
                    placeholder="#14B8A6"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={handleRandom}
                    className="shrink-0 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="palette-type" className="block text-sm font-bold text-stone-700">
                Palette type
              </label>
              <select
                id="palette-type"
                value={paletteType}
                onChange={(e) => setPaletteType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:max-w-xs"
              >
                {PALETTE_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {baseColor && (
              <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-stone-700">Generated palette</p>
                  <button
                    type="button"
                    onClick={handleCopyPalette}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                  >
                    {copied === 'palette' ? 'Copied!' : 'Copy palette'}
                  </button>
                </div>
                <div className={`grid gap-3 ${palette.length <= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
                  {palette.map((color) => (
                    <button
                      key={`${color.name}-${color.hex}`}
                      type="button"
                      onClick={() => handleCopy(color.hex, color.hex)}
                      className="group overflow-hidden rounded-xl border border-stone-200 bg-white text-left transition hover:border-brand-300 hover:shadow-card"
                    >
                      <div className="h-24 w-full" style={{ backgroundColor: color.hex }} />
                      <div className="px-3 py-3">
                        <p className="text-xs font-bold text-stone-700">{color.name}</p>
                        <p className="mt-1 font-mono text-xs text-stone-500">{color.hex}</p>
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-brand-600 opacity-0 transition group-hover:opacity-100">
                          {copied === color.hex ? 'Copied!' : 'Click to copy'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ColorPickerPalette;
