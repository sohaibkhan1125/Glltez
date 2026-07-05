const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'services', 'mergePdfApi.js');
let code = fs.readFileSync(filePath, 'utf8');

const guards = [
  ['mergePdfFiles', 'merge-pdf', 'Merge PDF'],
  ['compressPdfFile', 'compress-pdf', 'Compress PDF'],
  ['compressJpgFile', 'image-compressor', 'Image Compressor'],
  ['convertJpgToPng', 'jpg-to-png', 'JPG to PNG'],
  ['convertJpgToWebp', 'jpg-to-webp', 'JPG to WebP'],
  ['convertPngToJpg', 'png-to-jpg', 'PNG to JPG'],
  ['convertPngToSvg', 'png-to-svg', 'PNG to SVG'],
  ['convertSvgToPng', 'svg-to-png', 'SVG to PNG'],
  ['convertPngToWebp', 'png-to-webp', 'PNG to WebP'],
  ['convertGifToJpg', 'format-converter', 'Format Converter'],
  ['convertPsdToJpg', 'psd-to-jpg', 'PSD to JPG'],
  ['convertPdfToDocx', 'pdf-to-word', 'PDF to Word'],
  ['convertXlsxToPdf', 'xlsx-to-pdf', 'XLSX to PDF'],
  ['convertXlsxToPng', 'xlsx-to-png', 'XLSX to PNG'],
  ['convertHtmlToPdf', 'html-to-pdf', 'HTML to PDF'],
  ['convertWebToPdf', 'web-to-pdf', 'Web to PDF'],
  ['convertPdfToJpg', 'pdf-to-jpg', 'PDF to JPG'],
  ['convertPdfToPng', 'pdf-to-png', 'PDF to PNG'],
  ['convertPptxToPng', 'pptx-to-png', 'PPTX to PNG'],
  ['deletePdfPages', 'delete-pdf-pages', 'Delete PDF Pages'],
  ['cropPdf', 'crop-pdf', 'Crop PDF'],
  ['protectPdf', 'protect-pdf', 'Protect PDF'],
  ['watermarkPdf', 'pdf-watermark', 'PDF Watermark'],
];

for (const [fn, id, name] of guards) {
  const marker = `ensureToolUsage('${id}', '${name}')`;
  if (code.includes(marker)) continue;

  const re = new RegExp(`export async function ${fn}\\([^)]*\\) \\{`);
  code = code.replace(re, (match) => `${match}\n  ${marker};`);
}

fs.writeFileSync(filePath, code);
console.log('Patched mergePdfApi.js');
