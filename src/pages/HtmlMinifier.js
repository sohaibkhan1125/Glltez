import { useState } from 'react';
import { guardClientTool } from '../utils/guardClientTool';
import ToolNavbar from '../components/ToolNavbar';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ToolNexa Sample Page</title>
    <style>
      body {
        font-family: sans-serif;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <!-- Main content -->
    <header>
      <h1>  Hello, World!  </h1>
    </header>
    <p>
      This is a sample HTML document for minification.
    </p>
  </body>
</html>`;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function minifyHtml(input) {
  const preserved = [];

  const preserve = (match) => {
    const index = preserved.length;
    preserved.push(match);
    return `__PRESERVE_${index}__`;
  };

  let html = input.trim();

  html = html.replace(/<(script|style|pre|textarea)[^>]*>[\s\S]*?<\/\1>/gi, preserve);
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  html = html.replace(/\s+/g, ' ');
  html = html.replace(/>\s+</g, '><');
  html = html.replace(/\s*\/>/g, '/>');
  html = html.replace(/<\s+/g, '<');
  html = html.replace(/\s+>/g, '>');
  html = html.trim();

  preserved.forEach((block, index) => {
    html = html.replace(`__PRESERVE_${index}__`, block);
  });

  return html;
}

function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  const handleMinify = () => {
    if (!guardClientTool('html-minifier', 'HTML Minifier', setError)) return;
    setError('');
    setSuccess('');
    setOutput('');
    setStats(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please paste HTML to minify.');
      return;
    }

    if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
      setError('Input does not look like HTML. Include at least one HTML tag.');
      return;
    }

    try {
      const minified = minifyHtml(trimmed);
      const originalSize = new Blob([trimmed]).size;
      const minifiedSize = new Blob([minified]).size;
      const saved = originalSize - minifiedSize;
      const percent = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;

      setOutput(minified);
      setStats({ originalSize, minifiedSize, saved, percent });
      setSuccess(
        saved > 0
          ? `HTML minified successfully — ${percent}% smaller (${formatFileSize(saved)} saved).`
          : 'HTML minified successfully.'
      );
    } catch (err) {
      setError(err.message || 'Failed to minify HTML.');
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
    setStats(null);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_HTML);
    setOutput('');
    setError('');
    setSuccess('');
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="HTML Minifier" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">HTML Minifier</h1>
            <p className="mt-2 text-base text-stone-500">
              Remove whitespace and comments from HTML to shrink file size — runs entirely in your browser.
            </p>
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={handleLoadSample}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-brand-200 hover:text-brand-700"
            >
              Load sample HTML
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <label htmlFor="html-input" className="block text-sm font-bold text-stone-700">
                Input HTML
              </label>
              <textarea
                id="html-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                  setSuccess('');
                  setStats(null);
                }}
                placeholder="Paste your HTML markup here..."
                spellCheck={false}
                className="mt-3 h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <label htmlFor="html-output" className="block text-sm font-bold text-stone-700">
                  Minified HTML
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
                id="html-output"
                value={output}
                readOnly
                placeholder="Minified HTML will appear here..."
                spellCheck={false}
                className="mt-3 h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {stats && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Original</p>
                <p className="mt-1 text-lg font-bold text-stone-800">{formatFileSize(stats.originalSize)}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Minified</p>
                <p className="mt-1 text-lg font-bold text-brand-700">{formatFileSize(stats.minifiedSize)}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Saved</p>
                <p className="mt-1 text-lg font-bold text-green-700">
                  {formatFileSize(stats.saved)} ({stats.percent}%)
                </p>
              </div>
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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleMinify}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:min-w-[160px] sm:flex-none"
            >
              Minify HTML
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

export default HtmlMinifier;
