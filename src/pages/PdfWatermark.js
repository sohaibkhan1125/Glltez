import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { downloadPdf, watermarkPdf } from '../services/mergePdfApi';

const STYLES = [
  { value: 'watermark', label: 'Watermark (behind content)' },
  { value: 'stamp', label: 'Stamp (over content)' },
];

const ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const VERTICAL_ALIGNMENTS = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PdfWatermark() {
  const fileInputRef = useRef(null);
  const overlayInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [overlayFile, setOverlayFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [overlayPage, setOverlayPage] = useState(1);
  const [scale, setScale] = useState(100);
  const [opacity, setOpacity] = useState(50);
  const [style, setStyle] = useState('watermark');
  const [horizontalAlignment, setHorizontalAlignment] = useState('center');
  const [verticalAlignment, setVerticalAlignment] = useState('center');
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

  const selectPdf = (selected, type) => {
    const pdf = Array.from(selected).find((f) => f.type === 'application/pdf');
    if (!pdf) {
      setError('Please select a valid PDF file.');
      return;
    }
    setError('');
    resetOutput();
    if (type === 'main') setFile(pdf);
    else setOverlayFile(pdf);
  };

  const handleClear = () => {
    setFile(null);
    setOverlayFile(null);
    setPageRange('');
    setOverlayPage(1);
    setScale(100);
    setOpacity(50);
    setStyle('watermark');
    setHorizontalAlignment('center');
    setVerticalAlignment('center');
    setError('');
    resetOutput();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select the PDF file to watermark.');
      return;
    }

    if (!overlayFile) {
      setError('Please select the overlay PDF file.');
      return;
    }

    setLoading(true);

    try {
      const result = await watermarkPdf(file, overlayFile, {
        pageRange,
        overlayPage,
        scale,
        opacity,
        style,
        horizontalAlignment,
        verticalAlignment,
      });
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('Watermark applied successfully! Download your PDF below.');
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
      await downloadPdf(downloadUrl, outputFileName || 'document-watermarked.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="PDF Watermark" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">PDF Watermark</h1>
            <p className="mt-2 text-base text-stone-500">
              Overlay a PDF page as a watermark on your document — control opacity, scale, and position.
            </p>
          </div>

          <form onSubmit={handleApply} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-stone-700">Main PDF</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full rounded-xl border border-dashed border-sky-200 bg-sky-50/50 px-4 py-6 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  {file ? file.name : 'Select PDF to watermark'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.length) selectPdf(e.target.files, 'main');
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700">Overlay PDF</label>
                <button
                  type="button"
                  onClick={() => overlayInputRef.current?.click()}
                  className="mt-2 w-full rounded-xl border border-dashed border-sky-200 bg-sky-50/50 px-4 py-6 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  {overlayFile ? overlayFile.name : 'Select watermark PDF'}
                </button>
                <input
                  ref={overlayInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.length) selectPdf(e.target.files, 'overlay');
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="style" className="block text-sm font-bold text-stone-700">
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => {
                    setStyle(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="overlayPage" className="block text-sm font-bold text-stone-700">
                  Overlay Page Number
                </label>
                <input
                  id="overlayPage"
                  type="number"
                  min={1}
                  value={overlayPage}
                  onChange={(e) => {
                    setOverlayPage(Number(e.target.value) || 1);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="opacity" className="block text-sm font-bold text-stone-700">
                  Opacity: {opacity}%
                </label>
                <input
                  id="opacity"
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(Number(e.target.value));
                    resetOutput();
                  }}
                  className="mt-3 w-full accent-sky-600"
                />
              </div>
              <div>
                <label htmlFor="scale" className="block text-sm font-bold text-stone-700">
                  Scale: {scale}%
                </label>
                <input
                  id="scale"
                  type="range"
                  min={10}
                  max={200}
                  value={scale}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                    resetOutput();
                  }}
                  className="mt-3 w-full accent-sky-600"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="horizontal" className="block text-sm font-bold text-stone-700">
                  Horizontal Alignment
                </label>
                <select
                  id="horizontal"
                  value={horizontalAlignment}
                  onChange={(e) => {
                    setHorizontalAlignment(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {ALIGNMENTS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vertical" className="block text-sm font-bold text-stone-700">
                  Vertical Alignment
                </label>
                <select
                  id="vertical"
                  value={verticalAlignment}
                  onChange={(e) => {
                    setVerticalAlignment(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {VERTICAL_ALIGNMENTS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label htmlFor="pageRange" className="mt-5 block text-sm font-bold text-stone-700">
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
              placeholder="Apply watermark to specific pages, e.g. 1-5 or 2,4,6"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />

            {(file || overlayFile) && (
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
                {file && <p>Main: {file.name} ({formatFileSize(file.size)})</p>}
                {overlayFile && <p className="mt-1">Overlay: {overlayFile.name} ({formatFileSize(overlayFile.size)})</p>}
                {outputSize != null && (
                  <p className="mt-2 text-sky-700">Output size: {formatFileSize(outputSize)}</p>
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
                disabled={loading || !file || !overlayFile}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Applying...
                  </>
                ) : (
                  'Apply Watermark'
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

export default PdfWatermark;
