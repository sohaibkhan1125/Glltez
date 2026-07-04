import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertSvgToPng, downloadFile } from '../services/mergePdfApi';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SvgToPng() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [outputFileName, setOutputFileName] = useState('');
  const [outputSize, setOutputSize] = useState(null);

  const resetOutput = () => {
    setSuccess('');
    setDownloadUrl('');
    setOutputFileName('');
    setOutputSize(null);
  };

  const selectFile = (selected) => {
    const svg = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return f.type === 'image/svg+xml' || name.endsWith('.svg');
    });

    if (!svg) {
      setError('Please select a valid .svg file.');
      return;
    }

    setFile(svg);
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
    setError('');
    resetOutput();
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select an SVG file to convert.');
      return;
    }

    setLoading(true);

    try {
      const result = await convertSvgToPng(file);
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('SVG converted to PNG successfully! Download your file below.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    setError('');
    try {
      await downloadFile(downloadUrl, outputFileName || 'image.png');
    } catch (err) {
      setError(err.message || 'Failed to download PNG.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="SVG to PNG" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Image Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">SVG to PNG</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert SVG vector graphics to PNG raster images for use anywhere PNG is required.
            </p>
          </div>

          <form onSubmit={handleConvert} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-6 py-10 text-center transition hover:border-orange-300"
            >
              <svg className="mx-auto h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop an SVG file here</p>
              <p className="mt-1 text-sm text-stone-500">.svg</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Select SVG File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,.svg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-bold text-stone-700">Selected file</p>
                <p className="mt-1 truncate text-sm text-stone-800">{file.name}</p>
                <p className="text-xs text-stone-400">Original size: {formatFileSize(file.size)}</p>
                {outputSize != null && (
                  <p className="mt-2 text-xs text-stone-500">
                    PNG size: <span className="font-bold text-orange-700">{formatFileSize(outputSize)}</span>
                  </p>
                )}
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
                  'Convert to PNG'
                )}
              </button>
              {downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Download PNG
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

export default SvgToPng;
