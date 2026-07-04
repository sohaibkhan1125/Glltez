const WRITING_MODES = {
  blog: 'Write a well-structured blog post about:',
  email: 'Write a professional email about:',
  social: 'Write an engaging social media post about:',
  product: 'Write a compelling product description for:',
  essay: 'Write an informative essay about:',
  custom: '',
};

const SUMMARY_LENGTHS = {
  brief: 'Keep the summary very concise — about 2-3 sentences.',
  moderate: 'Provide a balanced summary — about one short paragraph or 4-6 sentences.',
  detailed: 'Provide a thorough summary covering all major points — about 2-3 paragraphs.',
};

const SUMMARY_FORMATS = {
  paragraph: 'Write the summary as flowing paragraph(s).',
  bullets: 'Format the summary as clear bullet points.',
  takeaways: 'List only the key takeaways as numbered points.',
};

const CODE_TASKS = {
  debug: 'Debug the following code. Identify issues, explain what is wrong, and provide a corrected version with brief explanations.',
  explain: 'Explain the following code clearly. Cover what it does, how it works, and any important details a developer should know.',
  generate: 'Write clean, working code based on the following requirements. Include helpful comments where appropriate.',
  optimize: 'Review and optimize the following code. Improve readability, performance, and best practices. Show the improved code and explain key changes.',
  review: 'Perform a thorough code review of the following code. Point out bugs, security issues, style problems, and suggest improvements.',
};

const REWRITE_STYLES = {
  standard: 'Rewrite with fresh wording while keeping the same meaning, structure, and length.',
  creative: 'Rewrite creatively with varied sentence structure and engaging language, preserving the core message.',
  simplified: 'Rewrite in simpler, clearer language that is easy to read and understand.',
  formal: 'Rewrite in a polished, professional tone suitable for business or academic use.',
  seo: 'Rewrite for SEO: improve readability, use natural keywords, and keep the content engaging for web readers.',
};

const EMAIL_TYPES = {
  professional: 'Write a professional business email',
  cold: 'Write a cold outreach email that is concise and compelling',
  followup: 'Write a polite follow-up email',
  thankyou: 'Write a sincere thank-you email',
  apology: 'Write a professional apology email',
  meeting: 'Write an email requesting a meeting or call',
  job: 'Write a job application or cover letter email',
  custom: 'Write an email based on the details provided',
};

const BLOG_LENGTHS = {
  short: 'Write a concise blog post of about 400-500 words.',
  medium: 'Write a well-developed blog post of about 800-1000 words.',
  long: 'Write a comprehensive, in-depth blog post of about 1500-2000 words.',
};

const AD_PLATFORMS = {
  google: 'Create Google Ads copy with a headline (max 30 chars), description (max 90 chars), and optional extensions. Focus on keywords and clear value.',
  facebook: 'Create Facebook/Instagram ad copy with a primary text, headline, and call-to-action. Make it scroll-stopping and visual-friendly.',
  linkedin: 'Create LinkedIn ad copy that is professional, B2B-focused, with headline and body text suited for a business audience.',
  twitter: 'Create Twitter/X ad copy that is concise, punchy, and within character limits. Include hashtags if relevant.',
  general: 'Create versatile ad copy with headline, body, and call-to-action suitable for any platform.',
};

const SCRIPT_TYPES = {
  youtube: 'Write a YouTube video script with hook, intro, main content sections, and outro. Include speaker notes and suggested visuals where helpful.',
  tiktok: 'Write a short-form video script for TikTok/Reels (15-60 seconds). Fast-paced, hook in the first 3 seconds, clear CTA at the end.',
  podcast: 'Write a podcast episode script or outline with intro, segments, talking points, transitions, and outro.',
  videoAd: 'Write a video ad script with hook, problem, solution, benefits, and strong call-to-action. Keep it concise and persuasive.',
  presentation: 'Write a presentation or webinar script with slide cues, speaker notes, and smooth transitions between sections.',
  custom: 'Write a professional script based on the details provided.',
};

const SCRIPT_LENGTHS = {
  short: 'Keep the script short — about 1-2 minutes when spoken.',
  medium: 'Target a medium length — about 3-5 minutes when spoken.',
  long: 'Create a longer script — about 8-10 minutes when spoken.',
};

const CAPTION_PLATFORMS = {
  instagram: 'Create an Instagram caption with engaging hook, body text, and relevant hashtags. Optimize for visual storytelling.',
  facebook: 'Create a Facebook post caption that encourages comments and shares. Conversational and community-focused.',
  twitter: 'Create a Twitter/X post within character limits. Punchy, concise, and shareable. Include hashtags sparingly.',
  linkedin: 'Create a professional LinkedIn post caption. Thought-leadership tone with value-driven content.',
  tiktok: 'Create a TikTok caption that is short, trendy, and includes popular hashtag suggestions.',
  pinterest: 'Create a Pinterest pin description that is keyword-rich, inspirational, and drives clicks.',
};

const STORY_GENRES = {
  fantasy: 'Write a fantasy story with imaginative world-building and magical elements.',
  scifi: 'Write a science fiction story with futuristic or technological themes.',
  mystery: 'Write a mystery story with suspense, clues, and an engaging plot twist.',
  romance: 'Write a romance story with emotional depth and compelling characters.',
  horror: 'Write a horror story that builds tension and atmosphere.',
  adventure: 'Write an adventure story with action, exploration, and excitement.',
  children: 'Write a wholesome story suitable for children with a clear moral or lesson.',
  custom: 'Write a creative story based on the details provided.',
};

const STORY_LENGTHS = {
  short: 'Write a short story of about 500-800 words with a complete beginning, middle, and end.',
  medium: 'Write a medium-length story of about 1200-1500 words with rich detail and character development.',
  long: 'Write a longer story of about 2000-2500 words with multiple scenes and depth.',
};

const SEO_TITLE_STYLES = {
  informational: 'Create clear, informative titles that accurately describe the content and include primary keywords.',
  howto: 'Create how-to style titles starting with action words like "How to" that promise practical value.',
  listicle: 'Create list-based titles with numbers (e.g. "10 Ways to...") that attract clicks.',
  question: 'Create question-based titles that spark curiosity and match search intent.',
  clickbait: 'Create attention-grabbing titles that drive clicks while staying relevant and not misleading.',
  professional: 'Create polished, authoritative titles suitable for business, B2B, or academic content.',
};

function extractContent(data) {
  if (typeof data === 'string') return data;
  if (typeof data?.result === 'string') return data.result;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.content === 'string') return data.content;
  if (typeof data?.response === 'string') return data.response;
  if (typeof data?.text === 'string') return data.text;
  if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
  if (data?.choices?.[0]?.text) return data.choices[0].text;
  return null;
}

async function callGpt(messages) {
  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('REACT_APP_RAPIDAPI_KEY is not configured. Add it to your .env file.');
  }

  const response = await fetch('https://chatgpt-42.p.rapidapi.com/gpt4', {
    method: 'POST',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, web_access: false }),
  });

  const rawText = await response.text();
  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    data = rawText;
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && (data.message || data.error)) ||
      `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const content = extractContent(data);
  if (!content) {
    throw new Error('Unexpected response format from AI service.');
  }

  return content;
}

export async function generateText({ prompt, mode = 'custom', tone = 'professional' }) {
  const prefix = WRITING_MODES[mode] || '';
  const userContent = prefix
    ? `${prefix} ${prompt}\n\nTone: ${tone}. Make it clear, engaging, and well-formatted.`
    : `${prompt}\n\nTone: ${tone}.`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function summarizeText({ text, length = 'moderate', format = 'paragraph' }) {
  const lengthInstruction = SUMMARY_LENGTHS[length] || SUMMARY_LENGTHS.moderate;
  const formatInstruction = SUMMARY_FORMATS[format] || SUMMARY_FORMATS.paragraph;

  const userContent = `Summarize the following text clearly and accurately. ${lengthInstruction} ${formatInstruction}\n\nText to summarize:\n\n${text}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function assistWithCode({ input, task = 'explain', language = 'javascript' }) {
  const taskInstruction = CODE_TASKS[task] || CODE_TASKS.explain;
  const languageLabel = language === 'other' ? 'the appropriate language' : language;

  const userContent = `You are an expert software developer. ${taskInstruction}

Use ${languageLabel} unless another language is clearly required.
Format code blocks with proper syntax. Be practical and concise.

Input:
${input}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function rewriteArticle({ text, style = 'standard', tone = 'professional' }) {
  const styleInstruction = REWRITE_STYLES[style] || REWRITE_STYLES.standard;

  const userContent = `Rewrite the following article. ${styleInstruction}
Maintain factual accuracy and the original intent. Use a ${tone} tone.
Return only the rewritten article with no preamble or explanation.

Original article:

${text}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateEmail({
  prompt,
  type = 'professional',
  tone = 'professional',
  recipient = '',
  subject = '',
}) {
  const typeInstruction = EMAIL_TYPES[type] || EMAIL_TYPES.professional;
  const recipientLine = recipient.trim() ? `Recipient: ${recipient.trim()}\n` : '';
  const subjectLine = subject.trim()
    ? `Use this subject line: ${subject.trim()}\n`
    : 'Include a clear, relevant subject line at the top.\n';

  const userContent = `${typeInstruction}. Use a ${tone} tone.
${recipientLine}${subjectLine}
Format the output as a complete email with Subject line, greeting, body, and sign-off.
Return only the email with no extra commentary.

Details:
${prompt}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateBlogPost({
  topic,
  tone = 'informative',
  length = 'medium',
  keywords = '',
  audience = '',
}) {
  const lengthInstruction = BLOG_LENGTHS[length] || BLOG_LENGTHS.medium;
  const keywordsLine = keywords.trim() ? `Naturally include these keywords: ${keywords.trim()}\n` : '';
  const audienceLine = audience.trim() ? `Target audience: ${audience.trim()}\n` : '';

  const userContent = `Write a complete, SEO-friendly blog post. ${lengthInstruction}
Use a ${tone} tone. ${keywordsLine}${audienceLine}
Include a compelling title, introduction, clear headings/subheadings, body sections, and a conclusion.
Make it engaging, readable, and valuable for readers.
Return only the blog post with no extra commentary.

Topic:
${topic}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateAdCopy({
  product,
  platform = 'general',
  tone = 'persuasive',
  audience = '',
  cta = '',
}) {
  const platformInstruction = AD_PLATFORMS[platform] || AD_PLATFORMS.general;
  const audienceLine = audience.trim() ? `Target audience: ${audience.trim()}\n` : '';
  const ctaLine = cta.trim() ? `Use this call-to-action: ${cta.trim()}\n` : 'Include a strong, clear call-to-action.\n';

  const userContent = `You are an expert copywriter. ${platformInstruction}
Use a ${tone} tone. ${audienceLine}${ctaLine}
Provide multiple variations if possible (e.g. 2-3 headline options).
Return only the ad copy with clear labels (Headline, Body, CTA, etc.) and no extra commentary.

Product or service details:
${product}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateScript({
  topic,
  type = 'youtube',
  tone = 'engaging',
  length = 'medium',
  audience = '',
}) {
  const typeInstruction = SCRIPT_TYPES[type] || SCRIPT_TYPES.youtube;
  const lengthInstruction = SCRIPT_LENGTHS[length] || SCRIPT_LENGTHS.medium;
  const audienceLine = audience.trim() ? `Target audience: ${audience.trim()}\n` : '';

  const userContent = `You are an expert scriptwriter. ${typeInstruction}
${lengthInstruction}
Use a ${tone} tone. ${audienceLine}
Format with clear scene/speaker labels, timestamps or sections where appropriate.
Return only the script with no extra commentary.

Topic or brief:
${topic}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateSocialCaption({
  topic,
  platform = 'instagram',
  tone = 'engaging',
  includeHashtags = true,
  variations = 3,
}) {
  const platformInstruction = CAPTION_PLATFORMS[platform] || CAPTION_PLATFORMS.instagram;
  const hashtagInstruction = includeHashtags
    ? 'Include a set of relevant hashtags at the end.'
    : 'Do not include hashtags.';

  const userContent = `You are a social media expert. ${platformInstruction}
Use a ${tone} tone. ${hashtagInstruction}
Provide ${variations} caption variation(s), clearly labeled (Caption 1, Caption 2, etc.).
Return only the captions with no extra commentary.

Post topic or description:
${topic}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateStory({
  prompt,
  genre = 'fantasy',
  tone = 'dramatic',
  length = 'medium',
  characters = '',
  setting = '',
}) {
  const genreInstruction = STORY_GENRES[genre] || STORY_GENRES.fantasy;
  const lengthInstruction = STORY_LENGTHS[length] || STORY_LENGTHS.medium;
  const charactersLine = characters.trim() ? `Main characters: ${characters.trim()}\n` : '';
  const settingLine = setting.trim() ? `Setting: ${setting.trim()}\n` : '';

  const userContent = `You are a talented fiction writer. ${genreInstruction}
${lengthInstruction}
Use a ${tone} tone. ${charactersLine}${settingLine}
Include a compelling title, vivid descriptions, dialogue where appropriate, and a satisfying conclusion.
Return only the story with no extra commentary.

Story prompt or idea:
${prompt}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateSeoTitles({
  topic,
  style = 'informational',
  keywords = '',
  variations = 10,
}) {
  const styleInstruction = SEO_TITLE_STYLES[style] || SEO_TITLE_STYLES.informational;
  const keywordsLine = keywords.trim()
    ? `Naturally incorporate these keywords: ${keywords.trim()}\n`
    : '';

  const userContent = `You are an SEO expert. ${styleInstruction}
${keywordsLine}
Generate ${variations} unique SEO title options for the topic below.
Keep titles under 60 characters when possible for Google SERP display.
Make them compelling, keyword-rich, and click-worthy.
Number each title (1., 2., etc.) and return only the title list with no extra commentary.

Topic or content description:
${topic}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export async function generateInvoice({
  businessName,
  clientName,
  items,
  currency = 'USD',
  taxRate = '',
  invoiceDate = '',
  dueDate = '',
  paymentTerms = '',
  notes = '',
}) {
  const taxLine = taxRate.trim() ? `Apply ${taxRate.trim()}% tax to the subtotal.\n` : '';
  const dateLine = invoiceDate.trim() ? `Invoice date: ${invoiceDate.trim()}\n` : 'Use today\'s date for the invoice date.\n';
  const dueLine = dueDate.trim() ? `Due date: ${dueDate.trim()}\n` : 'Set due date 30 days from invoice date.\n';
  const termsLine = paymentTerms.trim() ? `Payment terms: ${paymentTerms.trim()}\n` : '';
  const notesLine = notes.trim() ? `Additional notes: ${notes.trim()}\n` : '';

  const userContent = `Create a professional business invoice in plain text format.
From (Business): ${businessName}
Bill To (Client): ${clientName}
Currency: ${currency}
${dateLine}${dueLine}${taxLine}${termsLine}${notesLine}
Include: invoice number, dates, itemized line items table (Description, Qty, Rate, Amount), subtotal, tax (if applicable), and grand total.
Calculate all amounts accurately based on the items provided.
Use clear alignment and professional formatting.
Return only the completed invoice with no extra commentary.

Items or services:
${items}`;

  return callGpt([{ role: 'user', content: userContent }]);
}

export {
  WRITING_MODES,
  SUMMARY_LENGTHS,
  SUMMARY_FORMATS,
  CODE_TASKS,
  REWRITE_STYLES,
  EMAIL_TYPES,
  BLOG_LENGTHS,
  AD_PLATFORMS,
  SCRIPT_TYPES,
  SCRIPT_LENGTHS,
  CAPTION_PLATFORMS,
  STORY_GENRES,
  STORY_LENGTHS,
  SEO_TITLE_STYLES,
};
