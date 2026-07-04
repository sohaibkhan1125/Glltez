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
    throw new Error('Enter a valid 6-digit HEX color (e.g. #14B8A6).');
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

function ColorConverter() {
  const [rgb, setRgb] = useState({ r: 20, g: 184, b: 166 });
  const [hexInput, setHexInput] = useState('#14B8A6');
  const [hslInput, setHslInput] = useState({ h: 174, s: 80, l: 40 });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const hex = useMemo(() => rgbToHex(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const cssColor = useMemo(() => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, [rgb]);

  const syncFromRgb = (nextRgb) => {
    setRgb(nextRgb);
    setHexInput(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b));
    setHslInput(rgbToHsl(nextRgb.r, nextRgb.g, nextRgb.b));
    setError('');
  };

  const handlePickerChange = (value) => {
    try {
      syncFromRgb(parseHex(value));
    } catch {
      setError('Invalid color selected.');
    }
  };

  const handleHexChange = (value) => {
    setHexInput(value);
    setError('');
    if (!value.trim()) return;
    try {
      syncFromRgb(parseHex(value));
    } catch {
      // Allow typing until valid
    }
  };

  const handleHexBlur = () => {
    try {
      syncFromRgb(parseHex(hexInput));
    } catch (err) {
      setError(err.message);
      setHexInput(hex);
    }
  };

  const handleRgbChange = (channel, value) => {
    const num = value === '' ? 0 : Number(value);
    if (Number.isNaN(num)) return;
    syncFromRgb({ ...rgb, [channel]: clamp(num, 0, 255) });
  };

  const handleHslChange = (channel, value) => {
    const num = value === '' ? 0 : Number(value);
    if (Number.isNaN(num)) return;
    const nextHsl = {
      ...hslInput,
      [channel]: channel === 'h' ? clamp(num, 0, 360) : clamp(num, 0, 100),
    };
    setHslInput(nextHsl);
    syncFromRgb(hslToRgb(nextHsl.h, nextHsl.s, nextHsl.l));
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

  const handleReset = () => {
    syncFromRgb({ r: 20, g: 184, b: 166 });
    setCopied('');
  };

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Color Converter (HEX ↔ RGB ↔ HSL)" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Color Converter (HEX ↔ RGB ↔ HSL)</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert colors between HEX, RGB, and HSL with a live preview — updates instantly in your browser.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div
                className="h-40 w-full rounded-2xl border border-stone-200 shadow-inner sm:h-44 sm:w-44 sm:shrink-0"
                style={{ backgroundColor: cssColor }}
              />
              <div className="w-full">
                <label htmlFor="color-picker" className="block text-sm font-bold text-stone-700">
                  Color picker
                </label>
                <input
                  id="color-picker"
                  type="color"
                  value={hex.toLowerCase()}
                  onChange={(e) => handlePickerChange(e.target.value)}
                  className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="hex-input" className="text-sm font-bold text-stone-700">HEX</label>
                  <button
                    type="button"
                    onClick={() => handleCopy('hex', hex)}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                  >
                    {copied === 'hex' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <input
                  id="hex-input"
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  onBlur={handleHexBlur}
                  placeholder="#14B8A6"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-700">RGB</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('rgb', rgbString)}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                  >
                    {copied === 'rgb' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['r', 'g', 'b'].map((channel) => (
                    <div key={channel}>
                      <label htmlFor={`rgb-${channel}`} className="mb-1 block text-xs font-semibold uppercase text-stone-400">
                        {channel}
                      </label>
                      <input
                        id={`rgb-${channel}`}
                        type="number"
                        min={0}
                        max={255}
                        value={rgb[channel]}
                        onChange={(e) => handleRgbChange(channel, e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-700">HSL</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('hsl', hslString)}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                  >
                    {copied === 'hsl' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'h', label: 'H', max: 360 },
                    { key: 's', label: 'S', max: 100 },
                    { key: 'l', label: 'L', max: 100 },
                  ].map(({ key, label, max }) => (
                    <div key={key}>
                      <label htmlFor={`hsl-${key}`} className="mb-1 block text-xs font-semibold uppercase text-stone-400">
                        {label}
                      </label>
                      <input
                        id={`hsl-${key}`}
                        type="number"
                        min={0}
                        max={max}
                        value={hslInput[key]}
                        onChange={(e) => handleHslChange(key, e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="btn-outline !py-3.5"
              >
                Reset to brand color
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ColorConverter;
