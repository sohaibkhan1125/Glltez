import { useState } from 'react';
import ToolNavbar from '../components/ToolNavbar';
import { generateBlogPost } from '../services/aiWriterApi';

const LENGTHS = [
  { value: 'short', label: 'Short (~500 words)' },
  { value: 'medium', label: 'Medium (~1000 words)' },
  { value: 'long', label: 'Long (~1500+ words)' },
];

const TONES = [
  { value: 'informative', label: 'Informative' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
];

function BlogPostGenerator() {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('informative');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please enter a blog topic or brief.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const result = await generateBlogPost({
        topic: topic.trim(),
        length,
        tone,
        keywords: keywords.trim(),
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
    setKeywords('');
    setAudience('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="AI Blog Post Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M6 7.5h3v9H6v-9z" />
              </svg>
              AI Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">AI Blog Post Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Generate complete, SEO-friendly blog posts with titles, headings, and engaging content in seconds.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <label htmlFor="length" className="block text-sm font-bold text-stone-700">
                  Post Length
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
                  placeholder="e.g. Small business owners, beginners in web design"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />

                <label htmlFor="keywords" className="mt-5 block text-sm font-bold text-stone-700">
                  SEO Keywords <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. remote work, productivity, team collaboration"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />

                <label htmlFor="topic" className="mt-5 block text-sm font-bold text-stone-700">
                  Blog Topic or Brief
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={6}
                  placeholder="e.g. The benefits of remote work for small businesses, including tips for staying productive..."
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
                      'Generate Blog Post'
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
                  Generated Blog Post
                </h2>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    {copied ? 'Copied!' : 'Copy Post'}
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
                    <p className="text-sm font-medium">AI is writing your blog post...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{output}</div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-stone-400">
                    <svg className="mb-3 h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className="text-sm">Your generated blog post will appear here</p>
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

export default BlogPostGenerator;
