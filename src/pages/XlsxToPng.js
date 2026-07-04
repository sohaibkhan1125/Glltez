import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertXlsxToPng, downloadFile } from '../services/mergePdfApi';

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

function XlsxToPng() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [sheetRange, setSheetRange] = useState('');
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
    const xlsx = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return (
        f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || f.type === 'application/vnd.ms-excel'
        || name.endsWith('.xlsx')
        || name.endsWith('.xls')
      );
    });

    if (!xlsx) {
      setError('Please select a valid .xlsx or .xls file.');
      return;
    }

    setFile(xlsx);
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
    setSheetRange('');
    setError('');
    resetOutput();
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select an Excel file to convert.');
      return;
    }

    setLoading(true);

    try {
      const conversion = await convertXlsxToPng(file, { pageRange: sheetRange, resolution });
      setResult(conversion);
      setSuccess(
        conversion.type === 'zip'
          ? `${conversion.images.length} sheets converted! Download the ZIP file below.`
          : 'Excel converted to PNG successfully!'
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
      <ToolNavbar toolName="XLSX to PNG" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
              </svg>
              Image Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">XLSX to PNG</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert Excel spreadsheets to high-quality PNG images. Workbooks with multiple sheets are packaged into a ZIP file.
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
                <label htmlFor="sheetRange" className="block text-sm font-bold text-stone-700">
                  Sheet Range <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="sheetRange"
                  type="text"
                  value={sheetRange}
                  onChange={(e) => {
                    setSheetRange(e.target.value);
                    resetOutput();
                  }}
                  placeholder="e.g. 1-3 or 1,3"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mt-5 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-6 py-10 text-center transition hover:border-orange-300"
            >
              <svg className="mx-auto h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop an Excel file here</p>
              <p className="mt-1 text-sm text-stone-500">.xlsx or .xls</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Select Excel File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
                  Converted sheets ({result.images.length})
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
                        className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 hover:bg-orange-100"
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
                  'Convert to PNG'
                )}
              </button>
              {result?.downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  {result.type === 'zip' ? 'Download ZIP' : 'Download PNG'}
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

export default XlsxToPng;
