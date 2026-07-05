import { useState } from 'react';
import { guardClientTool } from '../utils/guardClientTool';
import ToolNavbar from '../components/ToolNavbar';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
];

const MODES = [
  { value: 'paragraphs', label: 'Paragraphs' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'words', label: 'Words' },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord() {
  return LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)];
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateWords(count, startWithLorem = true) {
  const words = [];
  if (startWithLorem && count >= 2) {
    words.push('Lorem', 'ipsum');
    for (let i = 2; i < count; i += 1) {
      words.push(randomWord());
    }
  } else if (startWithLorem && count === 1) {
    words.push('Lorem');
  } else {
    for (let i = 0; i < count; i += 1) {
      words.push(randomWord());
    }
  }
  return words.join(' ');
}

function generateSentence(startWithLorem = true) {
  const length = randomInt(8, 16);
  const words = generateWords(length, startWithLorem).split(' ');
  words[0] = capitalize(words[0].toLowerCase());
  return `${words.join(' ')}.`;
}

function generateParagraph(startWithLorem = true) {
  const sentenceCount = randomInt(4, 7);
  const sentences = [];
  for (let i = 0; i < sentenceCount; i += 1) {
    sentences.push(generateSentence(i === 0 && startWithLorem));
  }
  return sentences.join(' ');
}

function generateLorem({ mode, count, startWithLorem }) {
  if (count < 1 || count > 100) {
    throw new Error('Count must be between 1 and 100.');
  }

  if (mode === 'words') {
    return generateWords(count, startWithLorem);
  }

  if (mode === 'sentences') {
    const sentences = [];
    for (let i = 0; i < count; i += 1) {
      sentences.push(generateSentence(i === 0 && startWithLorem));
    }
    return sentences.join(' ');
  }

  const paragraphs = [];
  for (let i = 0; i < count; i += 1) {
    paragraphs.push(generateParagraph(i === 0 && startWithLorem));
  }
  return paragraphs.join('\n\n');
}

function LoremIpsumGenerator() {
  const [mode, setMode] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!guardClientTool('lorem-ipsum-generator', 'Lorem Ipsum Generator', setError)) return;
    setError('');
    setSuccess('');
    setOutput('');

    const amount = Number(count);
    if (!Number.isInteger(amount)) {
      setError('Please enter a valid whole number.');
      return;
    }

    try {
      const text = generateLorem({ mode, count: amount, startWithLorem });
      setOutput(text);
      setSuccess('Lorem ipsum text generated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to generate text.');
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
    setOutput('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Lorem Ipsum Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Lorem Ipsum Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Generate placeholder text for designs and mockups — choose paragraphs, sentences, or words.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="mode" className="block text-sm font-bold text-stone-700">
                  Generate by
                </label>
                <select
                  id="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  {MODES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="count" className="block text-sm font-bold text-stone-700">
                  Count <span className="font-normal text-stone-400">(1–100)</span>
                </label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm font-semibold text-stone-700">Start with &ldquo;Lorem ipsum&rdquo;</span>
            </label>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="lorem-output" className="block text-sm font-bold text-stone-700">
                  Generated text
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
                id="lorem-output"
                value={output}
                readOnly
                placeholder="Click Generate to create lorem ipsum placeholder text..."
                className="h-72 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:flex-none sm:min-w-[180px]"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn-outline flex-1 !py-3.5 sm:flex-none sm:min-w-[140px]"
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

export default LoremIpsumGenerator;
