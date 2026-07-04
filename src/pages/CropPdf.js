import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { cropPdf, downloadPdf } from '../services/mergePdfApi';

const CROP_MODES = [
  { value: 'auto', label: 'Auto (detect content)' },
  { value: 'size', label: 'Size (width/height)' },
  { value: 'margins', label: 'Margins' },
];

const MEASUREMENT_UNITS = [
  { value: 'in', label: 'Inches' },
  { value: 'mm', label: 'Millimeters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'pt', label: 'Points' },
];

const PAGE_SIZES = [
  { value: 'a4', label: 'A4' },
  { value: 'letter', label: 'Letter' },
  { value: 'legal', label: 'Legal' },
  { value: 'a3', label: 'A3' },
  { value: 'a5', label: 'A5' },
  { value: 'custom', label: 'Custom' },
];

const ORIENTATIONS = [
  { value: 'default', label: 'Default' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

const ANCHORS = [
  { value: 'center', label: 'Center' },
  { value: 'topleft', label: 'Top Left' },
  { value: 'top', label: 'Top' },
  { value: 'topright', label: 'Top Right' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottomright', label: 'Bottom Right' },
];

const AUTO_STRATEGIES = [
  { value: 'uniform', label: 'Uniform (all pages)' },
  { value: 'perPage', label: 'Per page' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CropPdf() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [password, setPassword] = useState('');
  const [cropMode, setCropMode] = useState('auto');
  const [measurementUnit, setMeasurementUnit] = useState('in');
  const [autoStrategy, setAutoStrategy] = useState('uniform');
  const [autoPadding, setAutoPadding] = useState('0');
  const [pageSize, setPageSize] = useState('a4');
  const [pageOrientation, setPageOrientation] = useState('default');
  const [cropWidth, setCropWidth] = useState('');
  const [cropHeight, setCropHeight] = useState('');
  const [anchor, setAnchor] = useState('center');
  const [verticalMargin, setVerticalMargin] = useState('1');
  const [horizontalMargin, setHorizontalMargin] = useState('1');
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
    setPassword('');
    setCropMode('auto');
    setMeasurementUnit('in');
    setAutoStrategy('uniform');
    setAutoPadding('0');
    setPageSize('a4');
    setPageOrientation('default');
    setCropWidth('');
    setCropHeight('');
    setAnchor('center');
    setVerticalMargin('1');
    setHorizontalMargin('1');
    setError('');
    resetOutput();
  };

  const handleCrop = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    setLoading(true);

    try {
      const result = await cropPdf(file, {
        pageRange,
        password,
        cropMode,
        measurementUnit,
        autoStrategy,
        autoPadding: autoPadding === '' ? 0 : Number(autoPadding),
        pageSize,
        pageOrientation,
        cropWidth,
        cropHeight,
        anchor,
        verticalMargin: verticalMargin === '' ? 1 : Number(verticalMargin),
        horizontalMargin: horizontalMargin === '' ? 1 : Number(horizontalMargin),
      });
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('PDF cropped successfully! Download your file below.');
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
      await downloadPdf(downloadUrl, outputFileName || 'document-cropped.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Crop PDF" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5M3.75 16.5v1.5A2.25 2.25 0 006 20.25h1.5M16.5 20.25H18A2.25 2.25 0 0120.25 18v-1.5M9 12h6" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Crop PDF</h1>
            <p className="mt-2 text-base text-stone-500">
              Trim PDF pages automatically, by exact size, or by margins — with optional page ranges.
            </p>
          </div>

          <form onSubmit={handleCrop} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="cropMode" className="block text-sm font-bold text-stone-700">
                  Crop Mode
                </label>
                <select
                  id="cropMode"
                  value={cropMode}
                  onChange={(e) => {
                    setCropMode(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {CROP_MODES.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="measurementUnit" className="block text-sm font-bold text-stone-700">
                  Measurement Unit
                </label>
                <select
                  id="measurementUnit"
                  value={measurementUnit}
                  onChange={(e) => {
                    setMeasurementUnit(e.target.value);
                    resetOutput();
                  }}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {MEASUREMENT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {cropMode === 'auto' && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="autoStrategy" className="block text-sm font-bold text-stone-700">
                    Auto Strategy
                  </label>
                  <select
                    id="autoStrategy"
                    value={autoStrategy}
                    onChange={(e) => {
                      setAutoStrategy(e.target.value);
                      resetOutput();
                    }}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    {AUTO_STRATEGIES.map((strategy) => (
                      <option key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="autoPadding" className="block text-sm font-bold text-stone-700">
                    Auto Padding
                  </label>
                  <input
                    id="autoPadding"
                    type="number"
                    min="0"
                    step="0.1"
                    value={autoPadding}
                    onChange={(e) => {
                      setAutoPadding(e.target.value);
                      resetOutput();
                    }}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            )}

            {cropMode === 'size' && (
              <>
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
                      {PAGE_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pageOrientation" className="block text-sm font-bold text-stone-700">
                      Orientation
                    </label>
                    <select
                      id="pageOrientation"
                      value={pageOrientation}
                      onChange={(e) => {
                        setPageOrientation(e.target.value);
                        resetOutput();
                      }}
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    >
                      {ORIENTATIONS.map((orientation) => (
                        <option key={orientation.value} value={orientation.value}>
                          {orientation.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="cropWidth" className="block text-sm font-bold text-stone-700">
                      Crop Width <span className="font-normal text-stone-400">(optional)</span>
                    </label>
                    <input
                      id="cropWidth"
                      type="number"
                      min="1"
                      step="0.1"
                      value={cropWidth}
                      onChange={(e) => {
                        setCropWidth(e.target.value);
                        resetOutput();
                      }}
                      placeholder="Uses page size if empty"
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="cropHeight" className="block text-sm font-bold text-stone-700">
                      Crop Height <span className="font-normal text-stone-400">(optional)</span>
                    </label>
                    <input
                      id="cropHeight"
                      type="number"
                      min="1"
                      step="0.1"
                      value={cropHeight}
                      onChange={(e) => {
                        setCropHeight(e.target.value);
                        resetOutput();
                      }}
                      placeholder="Uses page size if empty"
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="anchor" className="block text-sm font-bold text-stone-700">
                      Anchor
                    </label>
                    <select
                      id="anchor"
                      value={anchor}
                      onChange={(e) => {
                        setAnchor(e.target.value);
                        resetOutput();
                      }}
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    >
                      {ANCHORS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {cropMode === 'margins' && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="verticalMargin" className="block text-sm font-bold text-stone-700">
                    Vertical Margin
                  </label>
                  <input
                    id="verticalMargin"
                    type="number"
                    min="0"
                    step="0.1"
                    value={verticalMargin}
                    onChange={(e) => {
                      setVerticalMargin(e.target.value);
                      resetOutput();
                    }}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label htmlFor="horizontalMargin" className="block text-sm font-bold text-stone-700">
                    Horizontal Margin
                  </label>
                  <input
                    id="horizontalMargin"
                    type="number"
                    min="0"
                    step="0.1"
                    value={horizontalMargin}
                    onChange={(e) => {
                      setHorizontalMargin(e.target.value);
                      resetOutput();
                    }}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            )}

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
              placeholder="e.g. 1-5, 7, 10-12 (leave empty for all pages)"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />

            <label htmlFor="password" className="mt-5 block text-sm font-bold text-stone-700">
              PDF Password <span className="font-normal text-stone-400">(optional)</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                resetOutput();
              }}
              placeholder="Only if the PDF is password-protected"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />

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
                {outputSize != null && (
                  <p className="mt-2 text-xs text-stone-500">
                    New size: <span className="font-bold text-sky-700">{formatFileSize(outputSize)}</span>
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
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cropping...
                  </>
                ) : (
                  'Crop PDF'
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

export default CropPdf;
