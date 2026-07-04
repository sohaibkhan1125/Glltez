import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertPdfToJpg, downloadFile } from '../services/mergePdfApi';

const QUALITIES = [
  { value: 150, label: 'Web (150 DPI)' },
  { value: 300, label: 'Standard (300 DPI)' },
  { value: 500, label: 'High (500 DPI)' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PdfToJpg() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [resolution, setResolution] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const resetOutput = () => {
    setSuccess('');
    setResult(null);
  };

  const selectFile = (selected) => {
    const pdf = Array.from(selected).find((f) => f.type === 'application/pdf');
    if (!pdf) {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(pdf);
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
    setPageRange('');
    setError('');
    resetOutput();
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a PDF file to convert.');
      return;
    }

    setLoading(true);

    try {
      const conversion = await convertPdfToJpg(file, { pageRange, resolution });
      setResult(conversion);
      setSuccess(
        conversion.type === 'zip'
          ? `${conversion.images.length} pages converted! Download the ZIP file below.`
          : 'PDF converted to JPG successfully!'
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
      <ToolNavbar toolName="PDF to JPG" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">PDF to JPG</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert PDF pages to high-quality JPG images. Multi-page PDFs are packaged into a ZIP file.
            </p>
          </div>

          <form onSubmit={handleConvert} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="resolution" className="block text-sm font-bold text-stone-700">
                  Image Quality
                </label>
                <select
                  id="resolution"
                  value={resolution}
                  onChange={(e) => {
                    setResolution(Number(e.target.value));
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {QUALITIES.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pageRange" className="block text-sm font-bold text-stone-700">
                  Page Range <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="pageRange"
                  type="text"
                  value={pageRange}
                  onChange={(e) => {
                    setPageRange(e.target.value);
                    resetOutput();
                  }}
                  placeholder="e.g. 1-5 or 1,3,7"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

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
                <p className="text-xs text-stone-400">Size: {formatFileSize(file.size)}</p>
              </div>
            )}

            {result?.images?.length > 1 && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <p className="mb-3 text-sm font-bold text-stone-700">
                  Converted pages ({result.images.length})
                </p>
                <ul className="max-h-48 space-y-2 overflow-y-auto">
                  {result.images.map((image, index) => (
                    <li
                      key={`${image.fileName}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-stone-800">{image.fileName}</p>
                        <p className="text-xs text-stone-400">{formatFileSize(image.fileSize)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadImage(image.url, image.fileName)}
                        className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 hover:bg-sky-100"
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

export default PdfToJpg;
