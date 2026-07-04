import { useRef, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { compressJpgFile, downloadFile } from '../services/mergePdfApi';

const COMPRESSION_LEVELS = [
  { value: 'Good', label: 'Good — balanced size & quality' },
  { value: 'Lossless', label: 'Lossless — no quality loss' },
  { value: 'Extreme', label: 'Extreme — maximum compression' },
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

function ImageCompressor() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('Good');
  const [percentage, setPercentage] = useState('');
  const [targetSize, setTargetSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [compressedFileName, setCompressedFileName] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);

  const resetOutput = () => {
    setSuccess('');
    setDownloadUrl('');
    setCompressedFileName('');
    setCompressedSize(null);
  };

  const selectFile = (selected) => {
    const jpg = Array.from(selected).find((f) => {
      const name = f.name.toLowerCase();
      return f.type === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg');
    });

    if (!jpg) {
      setError('Please select a valid .jpg or .jpeg file.');
      return;
    }

    setFile(jpg);
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
    setCompressionLevel('Good');
    setPercentage('');
    setTargetSize('');
    setError('');
    resetOutput();
  };

  const handleCompress = async (e) => {
    e.preventDefault();
    setError('');
    resetOutput();

    if (!file) {
      setError('Please select a JPG image to compress.');
      return;
    }

    setLoading(true);

    try {
      const result = await compressJpgFile(file, {
        compressionLevel,
        percentage: percentage === '' ? '' : Number(percentage),
        targetSize: targetSize === '' ? '' : Number(targetSize),
      });
      setDownloadUrl(result.url);
      setCompressedFileName(result.fileName);
      setCompressedSize(result.fileSize ?? null);
      setSuccess('Image compressed successfully! Click download to save your file.');
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
      await downloadFile(downloadUrl, compressedFileName || 'compressed.jpg');
    } catch (err) {
      setError(err.message || 'Failed to download compressed image.');
    }
  };

  const savedPercent = file && compressedSize ? compressionPercent(file.size, compressedSize) : null;

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Image Compressor" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Image Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Image Compressor</h1>
            <p className="mt-2 text-base text-stone-500">
              Shrink JPG file sizes for faster uploads and sharing — without complex software.
            </p>
          </div>

          <form onSubmit={handleCompress} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <label htmlFor="compressionLevel" className="block text-sm font-bold text-stone-700">
              Compression Level
            </label>
            <select
              id="compressionLevel"
              value={compressionLevel}
              onChange={(e) => {
                setCompressionLevel(e.target.value);
                resetOutput();
              }}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              {COMPRESSION_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="percentage" className="block text-sm font-bold text-stone-700">
                  Quality % <span className="font-normal text-stone-400">(optional, 10–100)</span>
                </label>
                <input
                  id="percentage"
                  type="number"
                  min="10"
                  max="100"
                  value={percentage}
                  onChange={(e) => {
                    setPercentage(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Overrides level unless Lossless"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label htmlFor="targetSize" className="block text-sm font-bold text-stone-700">
                  Target Size (KB) <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="targetSize"
                  type="number"
                  min="10"
                  max="30000"
                  value={targetSize}
                  onChange={(e) => {
                    setTargetSize(e.target.value);
                    resetOutput();
                  }}
                  placeholder="Compress to target file size"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="mt-4 text-sm font-bold text-stone-700">Drag & drop a JPG image here</p>
              <p className="mt-1 text-sm text-stone-500">.jpg or .jpeg</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Select JPG Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
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
                className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                  'Compress Image'
                )}
              </button>
              {downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  Download Compressed JPG
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

export default ImageCompressor;
