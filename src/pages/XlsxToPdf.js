import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { convertXlsxToPdf, downloadPdf } from '../services/mergePdfApi';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function XlsxToPdf() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [outputFileName, setOutputFileName] = useState('');
  const [outputSize, setOutputSize] = useState(null);

  const selectFile = (selected) => {
    const excel = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return (
        f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || f.type === 'application/vnd.ms-excel'
        || name.endsWith('.xlsx')
        || name.endsWith('.xls')
      );
    });

    if (!excel) {
      setError('Please select a valid .xlsx or .xls file.');
      return;
    }

    setFile(excel);
    setError('');
    setSuccess('');
    setDownloadUrl('');
    setOutputSize(null);
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
    setOutputFileName('');
    setOutputSize(null);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDownloadUrl('');
    setOutputFileName('');
    setOutputSize(null);

    if (!file) {
      setError('Please select an Excel file to convert.');
      return;
    }

    setLoading(true);

    try {
      const result = await convertXlsxToPdf(file);
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('Excel file converted successfully! Download your PDF below.');
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
      await downloadPdf(downloadUrl, outputFileName || 'spreadsheet.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Excel to PDF" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75v-1.5c0-.621-.504-1.125-1.125-1.125m-16.5 0h15.75m-15.75 0a1.125 1.125 0 01-1.125-1.125M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Excel to PDF</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert Excel spreadsheets (.xlsx, .xls) into PDF documents in seconds — no software required.
            </p>
          </div>

          <form onSubmit={handleConvert} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-6 py-10 text-center transition hover:border-sky-300"
            >
              <svg className="mx-auto h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75v-1.5c0-.621-.504-1.125-1.125-1.125m-16.5 0h15.75" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop an Excel file here</p>
              <p className="mt-1 text-sm text-stone-500">.xlsx or .xls</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"
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
                {outputSize != null && (
                  <div className="mt-3 border-t border-stone-200 pt-3">
                    <p className="text-sm text-stone-600">
                      PDF size: <span className="font-bold text-sky-700">{formatFileSize(outputSize)}</span>
                    </p>
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

export default XlsxToPdf;
