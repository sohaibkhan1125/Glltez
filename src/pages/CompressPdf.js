import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { compressPdfFile, downloadPdf } from '../services/mergePdfApi';

const PRESETS = [
  { value: 'web', label: 'Web — balanced size & quality' },
  { value: 'print', label: 'Print — higher quality' },
  { value: 'archive', label: 'Archive — maximum compression' },
  { value: 'ebook', label: 'Ebook — optimized for reading' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function compressionPercent(original, compressed) {
  if (!original || !compressed) return null;
  const saved = ((original - compressed) / original) * 100;
  return saved > 0 ? saved.toFixed(1) : '0';
}

function CompressPdf() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState('web');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [compressedFileName, setCompressedFileName] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);

  const selectFile = (selected) => {
    const pdf = Array.from(selected).find((f) => f.type === 'application/pdf');
    if (!pdf) {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(pdf);
    setError('');
    setSuccess('');
    setDownloadUrl('');
    setCompressedSize(null);
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
    setSuccess('');
    setDownloadUrl('');
    setCompressedFileName('');
    setCompressedSize(null);
  };

  const handleCompress = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDownloadUrl('');
    setCompressedFileName('');
    setCompressedSize(null);

    if (!file) {
      setError('Please select a PDF file to compress.');
      return;
    }

    setLoading(true);

    try {
      const result = await compressPdfFile(file, preset);
      setDownloadUrl(result.url);
      setCompressedFileName(result.fileName);
      setCompressedSize(result.fileSize ?? null);
      setSuccess('PDF compressed successfully! Click download to save your file.');
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
      await downloadPdf(downloadUrl, compressedFileName || 'compressed.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download compressed PDF.');
    }
  };

  const savedPercent = file && compressedSize ? compressionPercent(file.size, compressedSize) : null;

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Compress PDF" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Compress PDF</h1>
            <p className="mt-2 text-base text-stone-500">
              Reduce PDF file size for easier sharing and storage — without complex software.
            </p>
          </div>

          <form onSubmit={handleCompress} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <label htmlFor="preset" className="block text-sm font-bold text-stone-700">
              Compression Level
            </label>
            <select
              id="preset"
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value);
                setSuccess('');
                setDownloadUrl('');
                setCompressedSize(null);
              }}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              {PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mt-5 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-6 py-10 text-center transition hover:border-sky-300"
            >
              <svg className="mx-auto h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop a PDF file here</p>
              <p className="mt-1 text-sm text-stone-500">or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Select PDF File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-bold text-stone-700">Selected file</p>
                <p className="mt-1 truncate text-sm text-stone-800">{file.name}</p>
                <p className="text-xs text-stone-400">Original size: {formatFileSize(file.size)}</p>
                {compressedSize != null && (
                  <div className="mt-3 border-t border-stone-200 pt-3">
                    <p className="text-sm text-stone-600">
                      Compressed size: <span className="font-bold text-green-700">{formatFileSize(compressedSize)}</span>
                    </p>
                    {savedPercent && (
                      <p className="mt-1 text-xs text-green-600">{savedPercent}% smaller</p>
                    )}
                  </div>
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
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Compressing...
                  </>
                ) : (
                  'Compress PDF'
                )}
              </button>
              {downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Download Compressed PDF
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

export default CompressPdf;
