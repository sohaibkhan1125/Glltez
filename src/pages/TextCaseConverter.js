import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';

const SAMPLE_TEXT = 'Hello World from ToolNexa Online Tools';

function extractWords(text) {
  return text.match(/[A-Za-z0-9]+/g) || [];
}

const converters = {
  uppercase: (text) => text.toUpperCase(),
  lowercase: (text) => text.toLowerCase(),
  titleCase: (text) => text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
  sentenceCase: (text) => text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase()),
  camelCase: (text) => {
    const words = extractWords(text).map((word) => word.toLowerCase());
    if (!words.length) return '';
    return words[0] + words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  },
  pascalCase: (text) => extractWords(text)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(''),
  snakeCase: (text) => extractWords(text).map((word) => word.toLowerCase()).join('_'),
  kebabCase: (text) => extractWords(text).map((word) => word.toLowerCase()).join('-'),
  constantCase: (text) => extractWords(text).map((word) => word.toUpperCase()).join('_'),
  alternatingCase: (text) => {
    let upper = false;
    return text
      .split('')
      .map((char) => {
        if (!/[a-z]/i.test(char)) return char;
        upper = !upper;
        return upper ? char.toUpperCase() : char.toLowerCase();
      })
      .join('');
  },
  inverseCase: (text) => text
    .split('')
    .map((char) => {
      if (char === char.toUpperCase() && /[a-z]/i.test(char)) return char.toLowerCase();
      if (char === char.toLowerCase() && /[a-z]/i.test(char)) return char.toUpperCase();
      return char;
    })
    .join(''),
};

const CASE_OPTIONS = [
  { id: 'uppercase', label: 'UPPERCASE' },
  { id: 'lowercase', label: 'lowercase' },
  { id: 'titleCase', label: 'Title Case' },
  { id: 'sentenceCase', label: 'Sentence case' },
  { id: 'camelCase', label: 'camelCase' },
  { id: 'pascalCase', label: 'PascalCase' },
  { id: 'snakeCase', label: 'snake_case' },
  { id: 'kebabCase', label: 'kebab-case' },
  { id: 'constantCase', label: 'CONSTANT_CASE' },
  { id: 'alternatingCase', label: 'aLtErNaTiNg' },
  { id: 'inverseCase', label: 'InVeRsE cAsE' },
];

function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeCase, setActiveCase] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = (caseId) => {
    setError('');
    setSuccess('');

    if (!input.trim()) {
      setError('Please enter text to convert.');
      setOutput('');
      return;
    }

    const convert = converters[caseId];
    if (!convert) return;

    setOutput(convert(input));
    setActiveCase(caseId);
    setSuccess(`Converted to ${CASE_OPTIONS.find((option) => option.id === caseId)?.label || 'selected case'}.`);
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

  const handleUseOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput('');
    setActiveCase('');
    setSuccess('');
    setError('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setActiveCase('');
    setError('');
    setSuccess('');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    setOutput('');
    setActiveCase('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Text Case Converter" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Text Case Converter</h1>
            <p className="mt-2 text-base text-stone-500">
              Convert text to uppercase, lowercase, title case, camelCase, snake_case, and more — instantly in your browser.
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

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
            <p className="text-sm font-bold text-stone-700">Choose a case</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CASE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleConvert(option.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCase === option.id
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                      : 'border border-stone-200 bg-stone-50 text-stone-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <label htmlFor="case-input" className="block text-sm font-bold text-stone-700">
                Input text
              </label>
              <textarea
                id="case-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Enter or paste text to convert..."
                className="mt-3 h-72 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <label htmlFor="case-output" className="block text-sm font-bold text-stone-700">
                  Converted text
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
                id="case-output"
                value={output}
                readOnly
                placeholder="Converted text will appear here..."
                className="mt-3 h-72 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 focus:outline-none"
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
              onClick={handleUseOutput}
              disabled={!output}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[180px] sm:flex-none"
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

export default TextCaseConverter;
