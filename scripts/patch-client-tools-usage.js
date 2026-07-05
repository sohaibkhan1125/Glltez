const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

const clientTools = [
  { file: 'JsonFormatter.js', id: 'json-formatter', name: 'JSON Formatter', handlers: ['handleFormat', 'handleMinify', 'handleValidate'] },
  { file: 'Base64EncoderDecoder.js', id: 'base64-encoder-decoder', name: 'Base64 Encoder/Decoder', handlers: ['handleEncode', 'handleDecode'] },
  { file: 'HtmlMinifier.js', id: 'html-minifier', name: 'HTML Minifier', handlers: ['handleMinify'] },
  { file: 'CssMinifier.js', id: 'css-minifier', name: 'CSS Minifier', handlers: ['handleMinify'] },
  { file: 'JavaScriptMinifier.js', id: 'javascript-minifier', name: 'JavaScript Minifier', handlers: ['handleMinify'] },
  { file: 'LoremIpsumGenerator.js', id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', handlers: ['handleGenerate'] },
  { file: 'WordCharacterCounter.js', id: 'word-character-counter', name: 'Word & Character Counter', handlers: ['handleLoadSample'] },
  { file: 'TextCaseConverter.js', id: 'text-case-converter', name: 'Text Case Converter', handlers: ['handleConvert'] },
  { file: 'PasswordGenerator.js', id: 'password-generator', name: 'Password Generator', handlers: ['handleGenerate'] },
  { file: 'QrCodeGenerator.js', id: 'qr-code-generator', name: 'QR Code Generator', handlers: ['handleGenerate'] },
  { file: 'ColorConverter.js', id: 'color-converter', name: 'Color Converter', handlers: ['handleReset'] },
  { file: 'ColorPickerPalette.js', id: 'color-picker-palette', name: 'Color Picker & Palette', handlers: ['handleRandom'] },
];

const guardBlock = (id, name) => `    try {
      ensureToolUsage('${id}', '${name}');
    } catch (err) {
      if (err instanceof UsageLimitError) return;
      setError(err.message || 'Usage check failed.');
      return;
    }

`;

for (const tool of clientTools) {
  const filePath = path.join(pagesDir, tool.file);
  if (!fs.existsSync(filePath)) {
    console.warn('Skip missing', tool.file);
    continue;
  }

  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes("ensureToolUsage")) {
    code = code.replace(
      "import { useState } from 'react';",
      "import { useState } from 'react';\nimport { ensureToolUsage, UsageLimitError } from '../utils/toolUsage';",
    );
  }

  for (const handler of tool.handlers) {
    const needle = `const ${handler} =`;
    if (!code.includes(needle)) {
      console.warn('Handler missing', tool.file, handler);
      continue;
    }

    const guardNeedle = `ensureToolUsage('${tool.id}'`;
    const handlerIndex = code.indexOf(`const ${handler} =`);
    const nextHandler = code.indexOf('\n  const handle', handlerIndex + 1);
    const sliceEnd = nextHandler === -1 ? code.length : nextHandler;
    const handlerBlock = code.slice(handlerIndex, sliceEnd);

    if (handlerBlock.includes(guardNeedle)) continue;

    code = code.replace(
      new RegExp(`(const ${handler} = (?:async )?\\([^)]*\\) => \\{\\n)`),
      `$1${guardBlock(tool.id, tool.name)}`,
    );
  }

  fs.writeFileSync(filePath, code);
  console.log('Patched', tool.file);
}
