import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { assistWithCode } from '../services/aiWriterApi';

const TASKS = [
  { value: 'debug', label: 'Debug Code' },
  { value: 'explain', label: 'Explain Code' },
  { value: 'generate', label: 'Generate Code' },
  { value: 'optimize', label: 'Optimize Code' },
  { value: 'review', label: 'Code Review' },
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'html/css', label: 'HTML / CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'other', label: 'Other' },
];

const PLACEHOLDERS = {
  debug: 'Paste the code that has a bug or error...',
  explain: 'Paste the code you want explained...',
  generate: 'Describe what you want to build, e.g. a React todo list with add/delete...',
  optimize: 'Paste the code you want to improve...',
  review: 'Paste the code you want reviewed...',
};

function CodeAssistant() {
  const [input, setInput] = useState('');
  const [task, setTask] = useState('explain');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      setError('Please enter code or a description.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const result = await assistWithCode({ input: input.trim(), task, language });
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
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Code Assistant" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              AI Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Code Assistant</h1>
            <p className="mt-2 text-base text-stone-500">
              Debug, explain, generate, optimize, or review code with AI-powered help.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <label htmlFor="task" className="block text-sm font-bold text-stone-700">
                  Task
                </label>
                <select
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {TASKS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="language" className="mt-5 block text-sm font-bold text-stone-700">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="input" className="mt-5 block text-sm font-bold text-stone-700">
                  {task === 'generate' ? 'Requirements' : 'Code'}
                </label>
                <textarea
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={12}
                  placeholder={PLACEHOLDERS[task]}
                  spellCheck={task === 'generate'}
                  className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-900 px-4 py-3 font-mono text-sm text-stone-100 placeholder:text-stone-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
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
                        Processing...
                      </>
                    ) : (
                      'Run Assistant'
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
                  Assistant Output
                </h2>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    {copied ? 'Copied!' : 'Copy Output'}
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
                    <p className="text-sm font-medium">AI is analyzing your code...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-stone-700">{output}</div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-stone-400">
                    <svg className="mb-3 h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                    <p className="text-sm">Your code assistant response will appear here</p>
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

export default CodeAssistant;
