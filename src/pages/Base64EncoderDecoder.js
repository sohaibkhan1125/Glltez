import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';

const SAMPLE_TEXT = 'Hello, ToolNexa! 🚀';

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(base64) {
  const cleaned = base64.replace(/\s/g, '');
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function Base64EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setError('');
    setSuccess('');
    setOutput('');

    if (!input) {
      setError('Please enter text to encode.');
      return;
    }

    try {
      setOutput(encodeBase64(input));
      setSuccess('Text encoded to Base64 successfully.');
    } catch (err) {
      setError(err.message || 'Failed to encode text.');
    }
  };

  const handleDecode = () => {
    setError('');
    setSuccess('');
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter Base64 text to decode.');
      return;
    }

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed.replace(/\s/g, ''))) {
      setError('Invalid Base64 string. Check characters and padding.');
      return;
    }

    try {
      setOutput(decodeBase64(trimmed));
      setSuccess('Base64 decoded successfully.');
    } catch {
      setError('Invalid Base64 string. Could not decode.');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    setError('');
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setSuccess('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSuccess('');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    setOutput('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Base64 Encoder / Decoder" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Base64 Encoder / Decoder</h1>
            <p className="mt-2 text-base text-stone-500">
              Encode plain text to Base64 or decode Base64 back to readable text — UTF-8 safe, runs in your browser.
            </p>
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-brand-200 hover:text-brand-700"
            >
              Load sample text
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <label htmlFor="base64-input" className="block text-sm font-bold text-stone-700">
                Input
              </label>
              <textarea
                id="base64-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Enter plain text to encode, or Base64 to decode..."
                spellCheck={false}
                className="mt-3 h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <label htmlFor="base64-output" className="block text-sm font-bold text-stone-700">
                  Output
                </label>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                id="base64-output"
                value={output}
                readOnly
                placeholder="Encoded or decoded result will appear here..."
                spellCheck={false}
                className="mt-3 h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleEncode}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:min-w-[140px] sm:flex-none"
            >
              Encode
            </button>
            <button
              type="button"
              onClick={handleDecode}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-stone-800 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-900 sm:min-w-[140px] sm:flex-none"
            >
              Decode
            </button>
            <button
              type="button"
              onClick={handleSwap}
              disabled={!output}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[140px] sm:flex-none"
            >
              Use output as input
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn-outline flex-1 !py-3.5 sm:min-w-[140px] sm:flex-none"
            >
              Clear
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Base64EncoderDecoder;
