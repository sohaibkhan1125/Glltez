import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertGifToJpg, downloadFile } from '../services/mergePdfApi';

const QUALITIES = [
  { value: 100, label: 'Maximum (100)' },
  { value: 90, label: 'High (90)' },
  { value: 75, label: 'Balanced (75)' },
  { value: 60, label: 'Smaller file (60)' },
];

const ALPHA_COLORS = [
  { value: 'white', label: 'White background' },
  { value: 'black', label: 'Black background' },
  { value: '#ffffff', label: 'Transparent → white (#ffffff)' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FormatConverter() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(90);
  const [alphaColor, setAlphaColor] = useState('white');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const resetOutput = () => {
    setSuccess('');
    setResult(null);
  };

  const selectFile = (selected) => {
    const gif = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return f.type === 'image/gif' || name.endsWith('.gif');
    });

    if (!gif) {
      setError('Please select a valid .gif file.');
      return;
    }

    setFile(gif);
    setError('');
    resetOutput();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      selectFile(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      selectFile(e.dataTransfer.files);
    }
  };

  const handleClear = () => {
    setFile(null);
    setQuality(90);
    setAlphaColor('white');
    setError('');
    resetOutput();
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a GIF image to convert.');
      return;
    }

    setLoading(true);

    try {
      const conversion = await convertGifToJpg(file, { quality, alphaColor });
      setResult(conversion);
      setSuccess(
        conversion.type === 'zip'
          ? `${conversion.images.length} frames converted! Download the ZIP file below.`
          : 'GIF converted to JPG successfully!'
      );
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadUrl) return;
    setError('');
    try {
      await downloadFile(result.downloadUrl, result.downloadFileName);
    } catch (err) {
      setError(err.message || 'Failed to download file.');
    }
  };

  const handleDownloadImage = async (url, fileName) => {
    setError('');
    try {
      await downloadFile(url, fileName);
    } catch (err) {
      setError(err.message || 'Failed to download image.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Format Converter" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Image Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Format Converter</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert GIF images to JPG — animated GIFs export as multiple frames in a ZIP when needed.
            </p>
          </div>

          <form onSubmit={handleConvert} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quality" className="block text-sm font-bold text-stone-700">
                  JPG Quality
                </label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  {QUALITIES.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="alphaColor" className="block text-sm font-bold text-stone-700">
                  Transparency Background
                </label>
                <select
                  id="alphaColor"
                  value={alphaColor}
                  onChange={(e) => {
                    setAlphaColor(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  {ALPHA_COLORS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mt-5 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-6 py-10 text-center transition hover:border-orange-300"
            >
              <svg className="mx-auto h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop a GIF image here</p>
              <p className="mt-1 text-sm text-stone-500">.gif</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Select GIF File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/gif,.gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-bold text-stone-700">Selected file</p>
                <p className="mt-1 truncate text-sm text-stone-800">{file.name}</p>
                <p className="text-xs text-stone-400">Size: {formatFileSize(file.size)}</p>
              </div>
            )}

            {result?.type === 'zip' && result.images?.length > 1 && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-bold text-stone-700">
                  {result.images.length} frames converted
                </p>
                <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto">
                  {result.images.map((image) => (
                    <li key={image.url} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-stone-700">{image.fileName}</span>
                      <button
                        type="button"
                        onClick={() => handleDownloadImage(image.url, image.fileName)}
                        className="shrink-0 text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                type="submit"
                disabled={loading || !file}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Converting...
                  </>
                ) : (
                  'Convert to JPG'
                )}
              </button>
              {result?.downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  {result.type === 'zip' ? 'Download ZIP' : 'Download JPG'}
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="btn-outline flex-1 !py-3.5"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default FormatConverter;
