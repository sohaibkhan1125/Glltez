import { useMemo, useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';

function countStats(text) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim()
    ? (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter((s) => s.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  const lines = text ? text.split(/\n/).length : 0;

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
  };
}

const STAT_ITEMS = [
  { key: 'words', label: 'Words' },
  { key: 'characters', label: 'Characters' },
  { key: 'charactersNoSpaces', label: 'Characters (no spaces)' },
  { key: 'sentences', label: 'Sentences' },
  { key: 'paragraphs', label: 'Paragraphs' },
  { key: 'lines', label: 'Lines' },
];

function WordCharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const stats = useMemo(() => countStats(text), [text]);

  const handleCopy = async () => {
    if (!text) return;
    setError('');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleClear = () => {
    setText('');
    setError('');
  };

  const handleLoadSample = () => {
    setText(
      'ToolNexa helps you work faster with free online tools.\n\n'
      + 'Count words and characters as you type. Perfect for essays, posts, and SEO copy!'
    );
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Word & Character Counter" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Word & Character Counter</h1>
            <p className="mt-2 text-base text-stone-500">
              Count words, characters, sentences, and more as you type — updates instantly in your browser.
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STAT_ITEMS.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-center shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{item.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-brand-700">{stats[item.key]}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="counter-text" className="block text-sm font-bold text-stone-700">
                Your text
              </label>
              {text && (
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
              id="counter-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here to see live counts..."
              className="h-80 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClear}
                className="btn-outline flex-1 !py-3.5 sm:max-w-[160px]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WordCharacterCounter;
