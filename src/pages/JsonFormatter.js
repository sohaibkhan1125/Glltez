import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';

const INDENTS = [
  { value: 2, label: '2 spaces' },
  { value: 4, label: '4 spaces' },
];

const SAMPLE_JSON = `{"name":"ToolNexa","type":"toolkit","features":["AI","PDF","Image"],"active":true,"stats":{"tools":35,"users":null}}`;

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const parseInput = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error('Please paste JSON to format.');
    }
    return JSON.parse(trimmed);
  };

  const handleFormat = () => {
    setError('');
    setSuccess('');
    setOutput('');

    try {
      const parsed = parseInput();
      setOutput(JSON.stringify(parsed, null, indent));
      setSuccess('JSON formatted successfully.');
    } catch (err) {
      setError(err.message || 'Invalid JSON. Check syntax and try again.');
    }
  };

  const handleMinify = () => {
    setError('');
    setSuccess('');
    setOutput('');

    try {
      const parsed = parseInput();
      setOutput(JSON.stringify(parsed));
      setSuccess('JSON minified successfully.');
    } catch (err) {
      setError(err.message || 'Invalid JSON. Check syntax and try again.');
    }
  };

  const handleValidate = () => {
    setError('');
    setSuccess('');
    setOutput('');

    try {
      parseInput();
      setSuccess('Valid JSON — no syntax errors found.');
    } catch (err) {
      setError(err.message || 'Invalid JSON.');
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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSuccess('');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setOutput('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="JSON Formatter" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">JSON Formatter</h1>
            <p className="mt-2 text-base text-stone-500">
              Beautify, minify, and validate JSON instantly — runs entirely in your browser, no upload required.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <label htmlFor="indent" className="text-sm font-bold text-stone-700">
              Indent
            </label>
            <select
              id="indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {INDENTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-brand-200 hover:text-brand-700"
            >
              Load sample
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <label htmlFor="json-input" className="block text-sm font-bold text-stone-700">
                Input JSON
              </label>
              <textarea
                id="json-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder='Paste JSON here, e.g. {"key": "value"}'
                spellCheck={false}
                className="mt-3 h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <label htmlFor="json-output" className="block text-sm font-bold text-stone-700">
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
                id="json-output"
                value={output}
                readOnly
                placeholder="Formatted or minified JSON will appear here..."
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
              onClick={handleFormat}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:min-w-[140px] sm:flex-none"
            >
              Format
            </button>
            <button
              type="button"
              onClick={handleMinify}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-stone-800 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-900 sm:min-w-[140px] sm:flex-none"
            >
              Minify
            </button>
            <button
              type="button"
              onClick={handleValidate}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 sm:min-w-[140px] sm:flex-none"
            >
              Validate
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

export default JsonFormatter;
