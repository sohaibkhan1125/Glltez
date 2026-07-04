import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { summarizeText } from '../services/aiWriterApi';

const LENGTHS = [
  { value: 'brief', label: 'Brief' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'detailed', label: 'Detailed' },
];

const FORMATS = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'bullets', label: 'Bullet Points' },
  { value: 'takeaways', label: 'Key Takeaways' },
];

function TextSummarizer() {
  const [text, setText] = useState('');
  const [length, setLength] = useState('moderate');
  const [format, setFormat] = useState('paragraph');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please paste the text you want to summarize.');
      return;
    }

    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters for a meaningful summary.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const result = await summarizeText({ text: text.trim(), length, format });
      setOutput(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleClear = () => {
    setText('');
    setOutput('');
    setError('');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Text Summarizer" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              AI Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Text Summarizer</h1>
            <p className="mt-2 text-base text-stone-500">
              Paste long articles, documents, or notes and get a clear, concise summary in seconds.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSummarize} className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <label htmlFor="length" className="block text-sm font-bold text-stone-700">
                  Summary Length
                </label>
                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="format" className="mt-5 block text-sm font-bold text-stone-700">
                  Output Format
                </label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <div className="mt-5 flex items-center justify-between">
                  <label htmlFor="text" className="block text-sm font-bold text-stone-700">
                    Text to Summarize
                  </label>
                  <span className="text-xs text-stone-400">{wordCount} words</span>
                </div>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  placeholder="Paste your article, report, essay, or any long text here..."
                  className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Summarizing...
                      </>
                    ) : (
                      'Summarize Text'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn-outline flex-1 !py-3.5"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                  Summary Output
                </h2>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    {copied ? 'Copied!' : 'Copy Summary'}
                  </button>
                )}
              </div>

              <div className="min-h-[320px] rounded-xl border border-stone-100 bg-stone-50 p-4">
                {loading ? (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-stone-400">
                    <svg className="mb-3 h-8 w-8 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm font-medium">AI is summarizing your text...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{output}</div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-stone-400">
                    <svg className="mb-3 h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
                    </svg>
                    <p className="text-sm">Your summary will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TextSummarizer;
