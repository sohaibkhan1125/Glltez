import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { generateSocialCaption } from '../services/aiWriterApi';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
];

const TONES = [
  { value: 'engaging', label: 'Engaging' },
  { value: 'professional', label: 'Professional' },
  { value: 'witty', label: 'Witty' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'promotional', label: 'Promotional' },
];

const VARIATIONS = [
  { value: 1, label: '1 variation' },
  { value: 2, label: '2 variations' },
  { value: 3, label: '3 variations' },
];

function SocialCaptionGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('engaging');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [variations, setVariations] = useState(3);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please describe your post or what the caption should be about.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const result = await generateSocialCaption({
        topic: topic.trim(),
        platform,
        tone,
        includeHashtags,
        variations,
      });
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
    setTopic('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="AI Social Media Caption Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" />
              </svg>
              AI Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">
              AI Social Media Caption Generator
            </h1>
            <p className="mt-2 text-base text-stone-500">
              Generate catchy captions with hashtags for Instagram, Facebook, LinkedIn, TikTok, and more.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <label htmlFor="platform" className="block text-sm font-bold text-stone-700">
                  Platform
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="tone" className="mt-5 block text-sm font-bold text-stone-700">
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="variations" className="mt-5 block text-sm font-bold text-stone-700">
                  Number of Variations
                </label>
                <select
                  id="variations"
                  value={variations}
                  onChange={(e) => setVariations(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {VARIATIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>

                <label className="mt-5 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-bold text-stone-700">Include hashtags</span>
                </label>

                <label htmlFor="topic" className="mt-5 block text-sm font-bold text-stone-700">
                  Post Topic or Description
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={6}
                  placeholder="e.g. New product launch — eco-friendly water bottle, summer sale, behind-the-scenes office photo..."
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
                        Generating...
                      </>
                    ) : (
                      'Generate Captions'
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
                  Generated Captions
                </h2>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    {copied ? 'Copied!' : 'Copy Captions'}
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
                    <p className="text-sm font-medium">AI is writing your captions...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{output}</div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-stone-400">
                    <svg className="mb-3 h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    <p className="text-sm">Your generated captions will appear here</p>
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

export default SocialCaptionGenerator;
