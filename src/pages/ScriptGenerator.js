import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { generateScript } from '../services/aiWriterApi';

const SCRIPT_TYPES = [
  { value: 'youtube', label: 'YouTube Video' },
  { value: 'tiktok', label: 'TikTok / Reels' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'videoAd', label: 'Video Ad' },
  { value: 'presentation', label: 'Presentation / Webinar' },
  { value: 'custom', label: 'Custom' },
];

const LENGTHS = [
  { value: 'short', label: 'Short (1-2 min)' },
  { value: 'medium', label: 'Medium (3-5 min)' },
  { value: 'long', label: 'Long (8-10 min)' },
];

const TONES = [
  { value: 'engaging', label: 'Engaging' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'inspirational', label: 'Inspirational' },
];

function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('youtube');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('engaging');
  const [audience, setAudience] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please describe your script topic or brief.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const result = await generateScript({
        topic: topic.trim(),
        type,
        length,
        tone,
        audience: audience.trim(),
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
    setAudience('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="AI Script Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125h15.75c.621 0 1.125.504 1.125 1.125v1.5m-18.75 0V5.625m0 12.75c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V5.625m0 12.75v-1.5c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v1.5m15.75 0h-15.75" />
              </svg>
              AI Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">AI Script Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Create professional scripts for YouTube, TikTok, podcasts, video ads, and presentations.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <label htmlFor="type" className="block text-sm font-bold text-stone-700">
                  Script Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {SCRIPT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="length" className="mt-5 block text-sm font-bold text-stone-700">
                  Script Length
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

                <label htmlFor="audience" className="mt-5 block text-sm font-bold text-stone-700">
                  Target Audience <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="audience"
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Tech enthusiasts, small business owners"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />

                <label htmlFor="topic" className="mt-5 block text-sm font-bold text-stone-700">
                  Topic or Brief
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={6}
                  placeholder="Describe your video/podcast topic, key points to cover, style, and any specific requirements..."
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
                      'Generate Script'
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
                  Generated Script
                </h2>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    {copied ? 'Copied!' : 'Copy Script'}
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
                    <p className="text-sm font-medium">AI is writing your script...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{output}</div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-stone-400">
                    <svg className="mb-3 h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <p className="text-sm">Your generated script will appear here</p>
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

export default ScriptGenerator;
