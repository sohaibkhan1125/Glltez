import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const subject = encodeURIComponent(form.subject.trim() || 'ToolNexa Contact Form');
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`
    );
    window.location.href = `mailto:support@toolnexa.com?subject=${subject}&body=${body}`;
    setSuccess('Your email client should open shortly. If it does not, email us at support@toolnexa.com.');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-cream-50">
        <div className="section-container py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              ← Back to Home
            </Link>
            <h1 className="mt-6 text-3xl font-extrabold text-stone-900 sm:text-4xl">Contact Us</h1>
            <p className="mt-3 text-base leading-relaxed text-stone-500">
              Have a question, feedback, or issue with a tool? We&apos;d love to hear from you.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-stone-700">Email</p>
                  <a
                    href="mailto:support@toolnexa.com"
                    className="mt-2 block text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    support@toolnexa.com
                  </a>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-stone-700">Response time</p>
                  <p className="mt-2 text-sm text-stone-600">
                    We typically respond within 1–3 business days.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                  <p className="text-sm font-bold text-brand-800">Before you write</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900/80">
                    Include the tool name and a short description of the issue. Screenshots help us
                    resolve problems faster.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card lg:col-span-3"
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-stone-700">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-stone-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-stone-700">
                      Subject <span className="font-normal text-stone-400">(optional)</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-stone-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
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

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContactUs;
