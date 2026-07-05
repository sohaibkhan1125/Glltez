import { useState } from 'react';
import { guardClientTool } from '../utils/guardClientTool';
import ToolNavbar from '../components/ToolNavbar';

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  upperSafe: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  lowerSafe: 'abcdefghijkmnopqrstuvwxyz',
  numbers: '0123456789',
  numbersSafe: '23456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function secureRandomIndex(max) {
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do {
    crypto.getRandomValues(array);
  } while (array[0] >= limit);
  return array[0] % max;
}

function pickRandom(charset) {
  return charset[secureRandomIndex(charset.length)];
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = secureRandomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join('');
}

function buildCharset(options) {
  const {
    useUpper,
    useLower,
    useNumbers,
    useSymbols,
    excludeAmbiguous,
  } = options;

  const pools = [];
  let charset = '';

  if (useUpper) {
    const pool = excludeAmbiguous ? CHARSETS.upperSafe : CHARSETS.upper;
    pools.push(pool);
    charset += pool;
  }
  if (useLower) {
    const pool = excludeAmbiguous ? CHARSETS.lowerSafe : CHARSETS.lower;
    pools.push(pool);
    charset += pool;
  }
  if (useNumbers) {
    const pool = excludeAmbiguous ? CHARSETS.numbersSafe : CHARSETS.numbers;
    pools.push(pool);
    charset += pool;
  }
  if (useSymbols) {
    pools.push(CHARSETS.symbols);
    charset += CHARSETS.symbols;
  }

  return { charset, pools };
}

function generatePassword(options) {
  const { length, count } = options;
  const { charset, pools } = buildCharset(options);

  if (!charset) {
    throw new Error('Select at least one character type.');
  }

  if (length < 4 || length > 128) {
    throw new Error('Password length must be between 4 and 128.');
  }

  if (length < pools.length) {
    throw new Error('Increase length to include all selected character types.');
  }

  const passwords = [];

  for (let n = 0; n < count; n += 1) {
    const chars = pools.map((pool) => pickRandom(pool));
    while (chars.length < length) {
      chars.push(pickRandom(charset));
    }
    passwords.push(shuffle(chars));
  }

  return passwords;
}

function getStrengthLabel(password) {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Weak', className: 'text-red-600 bg-red-50 border-red-200' };
  if (score <= 4) return { label: 'Fair', className: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (score <= 5) return { label: 'Strong', className: 'text-green-700 bg-green-50 border-green-200' };
  return { label: 'Very strong', className: 'text-brand-700 bg-brand-50 border-brand-200' };
}

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = () => {
    if (!guardClientTool('password-generator', 'Password Generator', setError)) return;
    setError('');
    setSuccess('');
    setCopiedIndex(null);

    try {
      const generated = generatePassword({
        length: Number(length),
        count: Number(count),
        useUpper,
        useLower,
        useNumbers,
        useSymbols,
        excludeAmbiguous,
      });
      setPasswords(generated);
      setSuccess(
        generated.length === 1
          ? 'Password generated successfully.'
          : `${generated.length} passwords generated successfully.`
      );
    } catch (err) {
      setPasswords([]);
      setError(err.message || 'Failed to generate password.');
    }
  };

  const handleCopy = async (password, index) => {
    setError('');
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleCopyAll = async () => {
    if (!passwords.length) return;
    setError('');
    try {
      await navigator.clipboard.writeText(passwords.join('\n'));
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  };

  const handleClear = () => {
    setPasswords([]);
    setError('');
    setSuccess('');
    setCopiedIndex(null);
  };

  const strength = passwords[0] ? getStrengthLabel(passwords[0]) : null;

  return (
    <div className="min-h-screen bg-cream-50">
      <ToolNavbar toolName="Password Generator" />

      <main className="section-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
              </svg>
              Other Tool
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Password Generator</h1>
            <p className="mt-2 text-base text-stone-500">
              Create strong, random passwords with secure browser cryptography — nothing is sent to a server.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="length" className="block text-sm font-bold text-stone-700">
                  Length <span className="font-normal text-stone-400">(4–128)</span>
                </label>
                <input
                  id="length"
                  type="number"
                  min={4}
                  max={128}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <div>
                <label htmlFor="count" className="block text-sm font-bold text-stone-700">
                  Quantity <span className="font-normal text-stone-400">(1–10)</span>
                </label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  max={10}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { id: 'upper', label: 'Uppercase (A–Z)', checked: useUpper, onChange: setUseUpper },
                { id: 'lower', label: 'Lowercase (a–z)', checked: useLower, onChange: setUseLower },
                { id: 'numbers', label: 'Numbers (0–9)', checked: useNumbers, onChange: setUseNumbers },
                { id: 'symbols', label: 'Symbols (!@#…)', checked: useSymbols, onChange: setUseSymbols },
              ].map((option) => (
                <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(e) => option.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-semibold text-stone-700">{option.label}</span>
                </label>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm font-semibold text-stone-700">
                Exclude ambiguous characters (0, O, l, 1, I)
              </span>
            </label>

            {passwords.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-stone-700">
                    {passwords.length === 1 ? 'Generated password' : 'Generated passwords'}
                  </p>
                  {strength && passwords.length === 1 && (
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${strength.className}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
                {passwords.map((password, index) => (
                  <div
                    key={`${password}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
                  >
                    <code className="min-w-0 flex-1 break-all font-mono text-sm text-stone-800">{password}</code>
                    <button
                      type="button"
                      onClick={() => handleCopy(password, index)}
                      className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-100"
                    >
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
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
                onClick={handleGenerate}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:min-w-[180px] sm:flex-none"
              >
                Generate Password
              </button>
              {passwords.length > 1 && (
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 sm:min-w-[140px] sm:flex-none"
                >
                  {copiedIndex === 'all' ? 'Copied!' : 'Copy all'}
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="btn-outline flex-1 !py-3.5 sm:min-w-[140px] sm:flex-none"
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

export default PasswordGenerator;
