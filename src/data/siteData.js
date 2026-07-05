export const toolCategories = [
  {
    id: 'ai-tools',
    title: 'AI Tools',
    tagline: 'Work smarter with AI',
    description:
      'Smart AI-powered utilities to automate tasks, generate content, and boost your productivity.',
    bgClass: 'bg-violet-50',
    panelClass: 'bg-gradient-to-br from-violet-500 to-purple-600',
    badgeClass: 'bg-violet-100 text-violet-700',
    iconClass: 'text-violet-600 bg-violet-100',
    accentBorder: 'border-violet-200',
    tools: [
      { name: 'AI Writer', description: 'Generate high-quality text in seconds.', status: 'active', path: '/ai-writer' },
      { name: 'Text Summarizer', description: 'Condense long documents into key points.', status: 'active', path: '/text-summarizer' },
      { name: 'Code Assistant', description: 'Get help with coding and debugging.', status: 'active', path: '/code-assistant' },
      { name: 'AI Article Rewriter', description: 'Rewrite articles into fresh, unique content.', status: 'active', path: '/article-rewriter' },
      { name: 'AI Email Writer', description: 'Draft professional emails in seconds.', status: 'active', path: '/email-writer' },
      { name: 'AI Blog Post Generator', description: 'Create full SEO-friendly blog posts instantly.', status: 'active', path: '/blog-post-generator' },
      { name: 'AI Ad Copy Generator', description: 'Write high-converting ads for any platform.', status: 'active', path: '/ad-copy-generator' },
      { name: 'AI Script Generator', description: 'Create scripts for videos, podcasts, and ads.', status: 'active', path: '/script-generator' },
      { name: 'AI Social Media Caption Generator', description: 'Write catchy captions with hashtags.', status: 'active', path: '/social-caption-generator' },
      { name: 'AI Story Generator', description: 'Create short stories from your ideas.', status: 'active', path: '/story-generator' },
      { name: 'AI SEO Title Generator', description: 'Generate keyword-optimized title ideas.', status: 'active', path: '/seo-title-generator' },
      { name: 'AI Invoice Generator', description: 'Create professional invoices in seconds.', status: 'active', path: '/invoice-generator' },
    ],
  },
  {
    id: 'pdf-tools',
    title: 'PDF Tools',
    tagline: 'Handle PDFs effortlessly',
    description:
      'Everything you need to merge, split, compress, and convert PDF files — fast and secure.',
    bgClass: 'bg-sky-50',
    panelClass: 'bg-gradient-to-br from-sky-500 to-blue-600',
    badgeClass: 'bg-sky-100 text-sky-700',
    iconClass: 'text-sky-600 bg-sky-100',
    accentBorder: 'border-sky-200',
    tools: [
      { name: 'Merge PDF', description: 'Combine multiple PDFs into one file.', status: 'active', path: '/merge-pdf' },
      { name: 'Compress PDF', description: 'Reduce file size without losing quality.', status: 'active', path: '/compress-pdf' },
      { name: 'PDF to Word', description: 'Convert PDF documents to editable formats.', status: 'active', path: '/pdf-to-word' },
      { name: 'HTML to PDF', description: 'Convert HTML pages into PDF documents.', status: 'active', path: '/html-to-pdf' },
      { name: 'Web to PDF', description: 'Convert any webpage URL into a PDF file.', status: 'active', path: '/web-to-pdf' },
      { name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF files.', status: 'active', path: '/xlsx-to-pdf' },
      { name: 'PDF to JPG', description: 'Convert PDF pages to JPG images.', status: 'active', path: '/pdf-to-jpg' },
      { name: 'PDF to PNG', description: 'Convert PDF pages to PNG images.', status: 'active', path: '/pdf-to-png' },
      { name: 'Delete PDF Pages', description: 'Remove unwanted pages from PDF files.', status: 'active', path: '/delete-pdf-pages' },
      { name: 'Crop PDF', description: 'Trim PDF pages by auto-detect, size, or margins.', status: 'active', path: '/crop-pdf' },
      { name: 'Protect PDF', description: 'Add password encryption and permission restrictions.', status: 'active', path: '/protect-pdf' },
      { name: 'PDF Watermark', description: 'Overlay a PDF page as a watermark.', status: 'active', path: '/pdf-watermark' },
    ],
  },
  {
    id: 'image-tools',
    title: 'Image Tools',
    tagline: 'Edit images in a snap',
    description:
      'Resize, compress, convert, and enhance images with powerful browser-based utilities.',
    bgClass: 'bg-coral-50',
    panelClass: 'bg-gradient-to-br from-coral-500 to-rose-500',
    badgeClass: 'bg-orange-100 text-orange-700',
    iconClass: 'text-coral-600 bg-orange-100',
    accentBorder: 'border-orange-200',
    tools: [
      { name: 'Image Compressor', description: 'Shrink JPG image file sizes instantly.', status: 'active', path: '/image-compressor' },
      { name: 'Format Converter', description: 'Convert GIF images to JPG format.', status: 'active', path: '/format-converter' },
      { name: 'Background Remover', description: 'Remove backgrounds with one click.', status: 'active', path: '/background-remover' },
      { name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', status: 'active', path: '/jpg-to-png' },
      { name: 'JPG to WebP', description: 'Convert JPG images to WebP format.', status: 'active', path: '/jpg-to-webp' },
      { name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', status: 'active', path: '/png-to-jpg' },
      { name: 'PNG to SVG', description: 'Convert PNG images to scalable SVG format.', status: 'active', path: '/png-to-svg' },
      { name: 'PNG to WebP', description: 'Convert PNG images to WebP format.', status: 'active', path: '/png-to-webp' },
      { name: 'PPTX to PNG', description: 'Convert PowerPoint slides to PNG images.', status: 'active', path: '/pptx-to-png' },
      { name: 'PSD to JPG', description: 'Convert Photoshop PSD files to JPG images.', status: 'active', path: '/psd-to-jpg' },
      { name: 'SVG to PNG', description: 'Convert SVG vector graphics to PNG images.', status: 'active', path: '/svg-to-png' },
      { name: 'XLSX to PNG', description: 'Convert Excel spreadsheets to PNG images.', status: 'active', path: '/xlsx-to-png' },
    ],
  },
  {
    id: 'other-tools',
    title: 'Other Tools',
    tagline: 'Handy everyday utilities',
    description:
      'Quick browser-based helpers for formatting, converting, and working with everyday data — no uploads needed.',
    bgClass: 'bg-brand-50',
    panelClass: 'bg-gradient-to-br from-brand-500 to-brand-700',
    badgeClass: 'bg-brand-100 text-brand-700',
    iconClass: 'text-brand-600 bg-brand-100',
    accentBorder: 'border-brand-200',
    tools: [
      { name: 'JSON Formatter', description: 'Beautify, minify, and validate JSON instantly.', status: 'active', path: '/json-formatter' },
      { name: 'Base64 Encoder / Decoder', description: 'Encode text to Base64 or decode it back.', status: 'active', path: '/base64-encoder-decoder' },
      { name: 'HTML Minifier', description: 'Remove whitespace and shrink HTML file size.', status: 'active', path: '/html-minifier' },
      { name: 'CSS Minifier', description: 'Remove comments and shrink CSS file size.', status: 'active', path: '/css-minifier' },
      { name: 'JavaScript Minifier', description: 'Remove comments and shrink JavaScript file size.', status: 'active', path: '/javascript-minifier' },
      { name: 'QR Code Generator', description: 'Create QR codes from URLs, text, and contact info.', status: 'active', path: '/qr-code-generator' },
      { name: 'Color Converter (HEX ↔ RGB ↔ HSL)', description: 'Convert colors between HEX, RGB, and HSL formats.', status: 'active', path: '/color-converter' },
      { name: 'Color Picker & Palette Generator', description: 'Pick colors and generate harmonious design palettes.', status: 'active', path: '/color-picker-palette' },
      { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs and mockups.', status: 'active', path: '/lorem-ipsum-generator' },
      { name: 'Word & Character Counter', description: 'Count words, characters, and sentences instantly.', status: 'active', path: '/word-character-counter' },
      { name: 'Text Case Converter', description: 'Convert text to uppercase, camelCase, snake_case, and more.', status: 'active', path: '/text-case-converter' },
      { name: 'Password Generator', description: 'Create strong random passwords securely in your browser.', status: 'active', path: '/password-generator' },
    ],
  },
];

export const howToSteps = [
  {
    step: '1',
    title: 'Choose Your Tool',
    description: 'Browse AI, PDF, Image, or Other tools and pick the one that fits your task.',
    icon: 'search',
  },
  {
    step: '2',
    title: 'Upload or Input',
    description: 'Add your file, text, or data directly in the browser — no signup required.',
    icon: 'upload',
  },
  {
    step: '3',
    title: 'Process Instantly',
    description: 'Our tools run fast in the cloud for reliable results every time.',
    icon: 'process',
  },
  {
    step: '4',
    title: 'Download & Done',
    description: 'Get your output immediately. Share, save, or continue with another tool.',
    icon: 'download',
  },
];

export const faqItems = [
  {
    question: 'Are these tools free to use?',
    answer:
      'Yes! ToolNexa offers free access to all core tools. Premium features may be added in the future, but essential utilities will always remain free.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account is required for most tools. Simply visit the tool you need, upload your file or input your data, and get results instantly.',
  },
  {
    question: 'Is my data safe and private?',
    answer:
      'Your privacy is our priority. Files are processed securely and automatically deleted after processing. We never store or share your personal data.',
  },
  {
    question: 'Which devices and browsers are supported?',
    answer:
      'ToolNexa works on all modern browsers — Chrome, Firefox, Safari, and Edge — across desktop, tablet, and mobile devices.',
  },
  {
    question: 'Will more tools be added?',
    answer:
      'Absolutely! We are continuously expanding our AI, PDF, Image, and Other tool collections. Check back regularly for new additions.',
  },
];

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'AI Tools', to: '/ai-tools' },
  { label: 'PDF Tools', to: '/pdf-tools' },
  { label: 'Image Tools', to: '/image-tools' },
  { label: 'Other Tools', to: '/other-tools' },
  { label: 'How to Use', to: '/how-to-use' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Pricing', to: '/pricing' },
];

export const heroCategories = [
  { label: 'AI Tools', to: '/ai-tools', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { label: 'PDF Tools', to: '/pdf-tools', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { label: 'Image Tools', to: '/image-tools', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { label: 'Other Tools', to: '/other-tools', color: 'bg-brand-100 text-brand-700 border-brand-200' },
];
