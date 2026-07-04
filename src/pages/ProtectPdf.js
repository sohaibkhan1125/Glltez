import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { protectPdf, downloadPdf } from '../services/mergePdfApi';

const ENCRYPTION_ALGORITHMS = [
  { value: 'Aes256Bit', label: '256-bit AES (recommended)' },
  { value: 'Aes128Bit', label: '128-bit AES' },
  { value: 'Standard128Bit', label: '128-bit RC4' },
  { value: 'Standard40Bit', label: '40-bit RC4' },
];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ProtectPdf() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [confirmUserPassword, setConfirmUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmOwnerPassword, setConfirmOwnerPassword] = useState('');
  const [openPassword, setOpenPassword] = useState('');
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState('Aes256Bit');
  const [encryptMeta, setEncryptMeta] = useState(false);
  const [printDocument, setPrintDocument] = useState(false);
  const [modifyContents, setModifyContents] = useState(false);
  const [copyContents, setCopyContents] = useState(false);
  const [fillFormFields, setFillFormFields] = useState(false);
  const [modifyAnnotations, setModifyAnnotations] = useState(false);
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
    setUserPassword('');
    setConfirmUserPassword('');
    setOwnerPassword('');
    setConfirmOwnerPassword('');
    setOpenPassword('');
    setEncryptionAlgorithm('Aes256Bit');
    setEncryptMeta(false);
    setPrintDocument(false);
    setModifyContents(false);
    setCopyContents(false);
    setFillFormFields(false);
    setModifyAnnotations(false);
    setError('');
    resetOutput();
  };

  const handleProtect = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    if (!userPassword.trim() && !ownerPassword.trim()) {
      setError('Please enter a user password, owner password, or both.');
      return;
    }

    if (userPassword && userPassword !== confirmUserPassword) {
      setError('User passwords do not match.');
      return;
    }

    if (ownerPassword && ownerPassword !== confirmOwnerPassword) {
      setError('Owner passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await protectPdf(file, {
        userPassword,
        ownerPassword,
        openPassword,
        encryptionAlgorithm,
        encryptMeta,
        printDocument,
        modifyContents,
        copyContents,
        fillFormFields,
        modifyAnnotations,
      });
      setDownloadUrl(result.url);
      setOutputFileName(result.fileName);
      setOutputSize(result.fileSize ?? null);
      setSuccess('PDF protected successfully! Download your encrypted file below.');
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
      await downloadPdf(downloadUrl, outputFileName || 'document-protected.pdf');
    } catch (err) {
      setError(err.message || 'Failed to download PDF.');
    }
  };

  const canProtect = Boolean(file) && (userPassword.trim() || ownerPassword.trim());

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Protect PDF" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              PDF Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Protect PDF</h1>
            <p className="mt-2 text-base text-stone-500">
              Encrypt PDF files with passwords and restrict printing, copying, or editing permissions.
            </p>
          </div>

          <form onSubmit={handleProtect} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="userPassword" className="block text-sm font-bold text-stone-700">
                  User Password
                </label>
                <input
                  id="userPassword"
                  type="password"
                  value={userPassword}
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Required to open the PDF"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label htmlFor="confirmUserPassword" className="block text-sm font-bold text-stone-700">
                  Confirm User Password
                </label>
                <input
                  id="confirmUserPassword"
                  type="password"
                  value={confirmUserPassword}
                  onChange={(e) => {
                    setConfirmUserPassword(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Re-enter user password"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ownerPassword" className="block text-sm font-bold text-stone-700">
                  Owner Password <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="ownerPassword"
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => {
                    setOwnerPassword(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Controls editing permissions"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label htmlFor="confirmOwnerPassword" className="block text-sm font-bold text-stone-700">
                  Confirm Owner Password
                </label>
                <input
                  id="confirmOwnerPassword"
                  type="password"
                  value={confirmOwnerPassword}
                  onChange={(e) => {
                    setConfirmOwnerPassword(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Re-enter owner password"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <label htmlFor="openPassword" className="mt-5 block text-sm font-bold text-stone-700">
              Current PDF Password <span className="font-normal text-stone-400">(if already protected)</span>
            </label>
            <input
              id="openPassword"
              type="password"
              value={openPassword}
              onChange={(e) => {
                setOpenPassword(e.target.value);
                resetOutput();
              }}
              placeholder="Only needed if your input PDF is password-protected"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />

            <div className="mt-5">
              <label htmlFor="encryptionAlgorithm" className="block text-sm font-bold text-stone-700">
                Encryption Algorithm
              </label>
              <select
                id="encryptionAlgorithm"
                value={encryptionAlgorithm}
                onChange={(e) => {
                  setEncryptionAlgorithm(e.target.value);
                  resetOutput();
                }}
                className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                {ENCRYPTION_ALGORITHMS.map((algo) => (
                  <option key={algo.value} value={algo.value}>
                    {algo.label}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-stone-700">Allowed Permissions</legend>
              <p className="mt-1 text-xs text-stone-400">Unchecked permissions remain restricted.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={printDocument}
                    onChange={(e) => {
                      setPrintDocument(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Allow printing</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={copyContents}
                    onChange={(e) => {
                      setCopyContents(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Allow copying content</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={modifyContents}
                    onChange={(e) => {
                      setModifyContents(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Allow editing content</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={fillFormFields}
                    onChange={(e) => {
                      setFillFormFields(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Allow filling form fields</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={modifyAnnotations}
                    onChange={(e) => {
                      setModifyAnnotations(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Allow annotations</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={encryptMeta}
                    onChange={(e) => {
                      setEncryptMeta(e.target.checked);
                      resetOutput();
                    }}
                    className="h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-stone-700">Encrypt metadata</span>
                </label>
              </div>
            </fieldset>

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
                    Protected size: <span className="font-bold text-sky-700">{formatFileSize(outputSize)}</span>
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
                disabled={loading || !canProtect}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Protecting...
                  </>
                ) : (
                  'Protect PDF'
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

export default ProtectPdf;
