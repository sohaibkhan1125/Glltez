import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { deletePdfPages, downloadPdf } from '../services/mergePdfApi';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DeletePdfPages() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [password, setPassword] = useState('');
  const [deleteBlankPages, setDeleteBlankPages] = useState(false);
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
    setDeleteBlankPages(false);
    setError('');
    resetOutput();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    if (!pageRange.trim()) {
      setError('Please enter the pages to delete (e.g. 1-3 or 2,5,8).');
      return;
    }

    setLoading(true);

    try {
      const result = await deletePdfPages(file, { pageRange, password, deleteBlankPages });
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('Pages deleted successfully! Download your updated PDF below.');
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
      await downloadPdf(downloadUrl, outputFileName || 'document-edited.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Delete PDF Pages" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Delete PDF Pages</h1>
            <p className="mt-2 text-base text-stone-500">
              Remove unwanted pages from your PDF — specify page numbers or ranges and download the updated file.
            </p>
          </div>

          <form onSubmit={handleDelete} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <label htmlFor="pageRange" className="block text-sm font-bold text-stone-700">
              Pages to Delete
            </label>
            <input
              id="pageRange"
              type="text"
              value={pageRange}
              onChange={(e) => {
                setPageRange(e.target.value);
                resetOutput();
              }}
              placeholder="e.g. 1-3, 5, 8-10"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-2 text-xs text-stone-400">
              Enter page numbers or ranges separated by commas (e.g. 1-5, 7, 10-12).
            </p>

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

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={deleteBlankPages}
                onChange={(e) => {
                  setDeleteBlankPages(e.target.checked);
                  resetOutput();
                }}
                className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm font-bold text-stone-700">Also delete blank pages automatically</span>
            </label>

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
                disabled={loading || !file || !pageRange.trim()}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Delete Pages'
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

export default DeletePdfPages;
