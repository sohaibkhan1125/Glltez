import { useState } from 'react';
import QRCode from 'qrcode';
import ToolNavbar from '../components/ToolNavbar';

const SIZES = [
  { value: 128, label: '128 × 128' },
  { value: 256, label: '256 × 256' },
  { value: 384, label: '384 × 384' },
  { value: 512, label: '512 × 512' },
];

const EC_LEVELS = [
  { value: 'L', label: 'Low (~7%)' },
  { value: 'M', label: 'Medium (~15%)' },
  { value: 'Q', label: 'Quartile (~25%)' },
  { value: 'H', label: 'High (~30%)' },
];

const PRESETS = [
  { label: 'Website URL', value: 'https://toolnexa.com' },
  { label: 'Email', value: 'mailto:hello@example.com' },
  { label: 'Phone', value: 'tel:+1234567890' },
  { label: 'Plain text', value: 'Scan me with your camera!' },
];

function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [dataUrl, setDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async () => {
    setError('');
    setSuccess('');
    setDataUrl('');

    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter text or a URL to encode.');
      return;
    }

    setLoading(true);

    try {
      const url = await QRCode.toDataURL(trimmed, {
        width: Number(size),
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: '#134e4a',
          light: '#ffffff',
        },
      });
      setDataUrl(url);
      setSuccess('QR code generated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to generate QR code. Try shorter text or lower error correction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  const handleClear = () => {
    setText('');
    setDataUrl('');
    setError('');
    setSuccess('');
  };

  const handlePreset = (value) => {
    setText(value);
    setDataUrl('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="QR Code Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">QR Code Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Create QR codes from URLs, text, emails, and more — generated locally in your browser.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <label htmlFor="qr-text" className="block text-sm font-bold text-stone-700">
                Content to encode
              </label>
              <textarea
                id="qr-text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Enter a URL, text, email, phone number..."
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <p className="mt-4 text-sm font-bold text-stone-700">Quick presets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePreset(preset.value)}
                    className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-size" className="block text-sm font-bold text-stone-700">
                    Size
                  </label>
                  <select
                    id="qr-size"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    {SIZES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="qr-ec" className="block text-sm font-bold text-stone-700">
                    Error correction
                  </label>
                  <select
                    id="qr-ec"
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    {EC_LEVELS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-outline flex-1 !py-3.5"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <p className="text-sm font-bold text-stone-700">Preview</p>
              <div className="mt-4 flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50 p-6">
                {dataUrl ? (
                  <img
                    src={dataUrl}
                    alt="Generated QR code"
                    className="max-h-72 max-w-full rounded-lg shadow-card"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 14.625a1.125 1.125 0 011.125-1.125h1.5a1.125 1.125 0 011.125 1.125v1.5a1.125 1.125 0 01-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5z" />
                    </svg>
                    <p className="mt-3 text-sm text-stone-400">Your QR code will appear here</p>
                  </div>
                )}
              </div>

              {dataUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Download PNG
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QrCodeGenerator;
