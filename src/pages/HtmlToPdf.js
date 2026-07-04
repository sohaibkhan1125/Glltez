import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertHtmlToPdf, downloadPdf } from '../services/mergePdfApi';

const PAGE_SIZES = [
  { value: 'a4', label: 'A4' },
  { value: 'letter', label: 'Letter' },
  { value: 'legal', label: 'Legal' },
  { value: 'a3', label: 'A3' },
];

const ORIENTATIONS = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function HtmlToPdf() {
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('paste');
  const [html, setHtml] = useState('');
  const [file, setFile] = useState(null);
  const [pageSize, setPageSize] = useState('a4');
  const [pageOrientation, setPageOrientation] = useState('portrait');
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
    const htmlFile = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return f.type === 'text/html' || name.endsWith('.html') || name.endsWith('.htm');
    });

    if (!htmlFile) {
      setError('Please select a valid .html or .htm file.');
      return;
    }

    setFile(htmlFile);
    setHtml('');
    setMode('upload');
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
    setHtml('');
    setFile(null);
    setError('');
    resetOutput();
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    setLoading(true);

    try {
      const result = await convertHtmlToPdf({
        html: mode === 'paste' ? html : '',
        file: mode === 'upload' ? file : null,
        pageSize,
        pageOrientation,
      });
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('HTML converted to PDF successfully!');
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
      await downloadPdf(downloadUrl, outputFileName || 'document.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  const canConvert = mode === 'paste' ? html.trim().length > 0 : Boolean(file);

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="HTML to PDF" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">HTML to PDF</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert HTML pages or code into pixel-perfect PDF documents — paste HTML or upload a file.
            </p>
          </div>

          <form onSubmit={handleConvert} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="flex rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('paste');
                  setFile(null);
                  resetOutput();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
                  mode === 'paste' ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Paste HTML
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('upload');
                  setHtml('');
                  resetOutput();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
                  mode === 'upload' ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Upload File
              </button>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="pageSize" className="block text-sm font-bold text-stone-700">
                  Page Size
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="orientation" className="block text-sm font-bold text-stone-700">
                  Orientation
                </label>
                <select
                  id="orientation"
                  value={pageOrientation}
                  onChange={(e) => {
                    setPageOrientation(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {ORIENTATIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {mode === 'paste' ? (
              <>
                <label htmlFor="html" className="mt-5 block text-sm font-bold text-stone-700">
                  HTML Content
                </label>
                <textarea
                  id="html"
                  value={html}
                  onChange={(e) => {
                    setHtml(e.target.value);
                    resetOutput();
                  }}
                  rows={12}
                  placeholder={'<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'}
                  className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-900 px-4 py-3 font-mono text-sm text-stone-100 placeholder:text-stone-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="mt-5 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-6 py-10 text-center transition hover:border-sky-300"
              >
                <svg className="mx-auto h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop an HTML file here</p>
                <p className="mt-1 text-sm text-stone-500">.html or .htm</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 inline-flex rounded-full bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"
                >
                  Select HTML File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm,text/html"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file && (
                  <div className="mt-5 rounded-xl border border-stone-200 bg-white px-4 py-3 text-left">
                    <p className="truncate text-sm font-semibold text-stone-800">{file.name}</p>
                    <p className="text-xs text-stone-400">{formatFileSize(file.size)}</p>
                  </div>
                )}
              </div>
            )}

            {outputSize != null && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                PDF size: <span className="font-bold text-sky-700">{formatFileSize(outputSize)}</span>
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
                disabled={loading || !canConvert}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                  'Convert to PDF'
                )}
              </button>
              {downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Download PDF
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

export default HtmlToPdf;
