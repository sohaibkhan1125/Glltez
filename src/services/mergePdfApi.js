import { ensureToolUsage } from '../utils/toolUsage';

const MERGE_URL = 'https://v2.convertapi.com/convert/pdf/to/merge';
const COMPRESS_URL = 'https://v2.convertapi.com/convert/pdf/to/compress';
const PDF_TO_DOCX_URL = 'https://v2.convertapi.com/convert/pdf/to/docx';
const HTML_TO_PDF_URL = 'https://v2.convertapi.com/convert/html/to/pdf';
const WEB_TO_PDF_URL = 'https://v2.convertapi.com/convert/web/to/pdf';
const XLSX_TO_PDF_URL = 'https://v2.convertapi.com/convert/xlsx/to/pdf';
const XLSX_TO_PNG_URL = 'https://v2.convertapi.com/convert/xlsx/to/png';
const PPTX_TO_PNG_URL = 'https://v2.convertapi.com/convert/pptx/to/png';
const PSD_TO_JPG_URL = 'https://v2.convertapi.com/convert/psd/to/jpg';
const PDF_TO_JPG_URL = 'https://v2.convertapi.com/convert/pdf/to/jpg';
const PDF_TO_PNG_URL = 'https://v2.convertapi.com/convert/pdf/to/png';
const JPG_TO_ZIP_URL = 'https://v2.convertapi.com/convert/jpg/to/zip';
const JPG_TO_COMPRESS_URL = 'https://v2.convertapi.com/convert/jpg/to/compress';
const GIF_TO_JPG_URL = 'https://v2.convertapi.com/convert/gif/to/jpg';
const JPG_TO_PNG_URL = 'https://v2.convertapi.com/convert/jpg/to/png';
const JPG_TO_WEBP_URL = 'https://v2.convertapi.com/convert/jpg/to/webp';
const PNG_TO_JPG_URL = 'https://v2.convertapi.com/convert/png/to/jpg';
const PNG_TO_SVG_URL = 'https://v2.convertapi.com/convert/png/to/svg';
const SVG_TO_PNG_URL = 'https://v2.convertapi.com/convert/svg/to/png';
const PNG_TO_WEBP_URL = 'https://v2.convertapi.com/convert/png/to/webp';
const PNG_TO_ZIP_URL = 'https://v2.convertapi.com/convert/png/to/zip';
const PDF_DELETE_PAGES_URL = 'https://v2.convertapi.com/convert/pdf/to/delete-pages';
const PDF_CROP_URL = 'https://v2.convertapi.com/convert/pdf/to/crop';
const PDF_PROTECT_URL = 'https://v2.convertapi.com/convert/pdf/to/protect';
const PDF_WATERMARK_URL = 'https://v2.convertapi.com/convert/pdf/to/pdf-watermark';

function getSecret() {
  const secret = process.env.REACT_APP_CONVERTAPI_SECRET;
  if (!secret) {
    throw new Error('REACT_APP_CONVERTAPI_SECRET is not configured. Add it to your .env file.');
  }
  return secret;
}

async function getConvertApiData(response, errorFallback) {
  let data;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || 'Unexpected response from conversion service.');
    }
  }

  if (!response.ok) {
    throw new Error(data.Message || data.message || data.error || errorFallback);
  }

  return data;
}

async function parseConvertApiResponse(response, errorFallback) {
  const data = await getConvertApiData(response, errorFallback);
  const file = data.Files?.[0];

  if (!file?.Url) {
    throw new Error('Unexpected response format from conversion service.');
  }

  return {
    url: file.Url,
    fileName: file.FileName || 'output.pdf',
    fileSize: file.FileSize,
  };
}

async function parseConvertApiFiles(response, errorFallback) {
  const data = await getConvertApiData(response, errorFallback);
  const files = (data.Files || []).filter((file) => file?.Url);

  if (!files.length) {
    throw new Error('Unexpected response format from conversion service.');
  }

  return files.map((file) => ({
    url: file.Url,
    fileName: file.FileName || 'image.jpg',
    fileSize: file.FileSize,
  }));
}

async function zipConvertedFiles(images, zipUrl) {
  const formData = new FormData();
  formData.append('StoreFile', 'true');

  images.forEach((image, index) => {
    formData.append(`Files[${index}]`, image.url);
  });

  const response = await fetch(zipUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  return parseConvertApiResponse(response, 'Failed to create ZIP archive.');
}

async function convertPdfToImages(file, {
  convertUrl,
  zipUrl,
  errorMessage,
  extension,
  zipLabel,
  pageRange = '',
  resolution = 300,
}) {
  if (!file) {
    throw new Error('Please select a PDF file to convert.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('ImageResolutionH', String(resolution));
  formData.append('ImageResolutionV', String(resolution));
  formData.append('ScaleImage', 'true');

  if (pageRange.trim()) {
    formData.append('PageRange', pageRange.trim());
  }

  const response = await fetch(convertUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const images = await parseConvertApiFiles(response, errorMessage);
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  if (images.length === 1) {
    const image = images[0];
    return {
      type: 'single',
      images,
      downloadUrl: image.url,
      downloadFileName: image.fileName.toLowerCase().endsWith(`.${extension}`)
        ? image.fileName
        : `${baseName}.${extension}`,
    };
  }

  const zip = await zipConvertedFiles(images, zipUrl);

  return {
    type: 'zip',
    images,
    downloadUrl: zip.url,
    downloadFileName: `${baseName}-${zipLabel}.zip`,
  };
}

export async function mergePdfFiles(files) {
  ensureToolUsage('merge-pdf', 'Merge PDF');
  if (!files?.length || files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');

  files.forEach((file, index) => {
    formData.append(`Files[${index}]`, file, file.name);
  });

  const response = await fetch(MERGE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to merge PDF files.');
  return {
    ...result,
    fileName: result.fileName.endsWith('.pdf') ? result.fileName : 'merged.pdf',
  };
}

export async function compressPdfFile(file, preset = 'web') {
  ensureToolUsage('compress-pdf', 'Compress PDF');
  if (!file) {
    throw new Error('Please select a PDF file to compress.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  if (preset) {
    formData.append('Preset', preset);
  }

  const response = await fetch(COMPRESS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to compress PDF file.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName || `${baseName}-compressed.pdf`,
    originalSize: file.size,
  };
}

function isJpgFile(file) {
  const name = file.name.toLowerCase();
  return file.type === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg');
}

export async function compressJpgFile(file, {
  compressionLevel = 'Good',
  percentage = '',
  targetSize = '',
} = {}) {
  ensureToolUsage('image-compressor', 'Image Compressor');
  if (!file) {
    throw new Error('Please select a JPG image to compress.');
  }

  if (!isJpgFile(file)) {
    throw new Error('Please select a valid .jpg or .jpeg file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  if (compressionLevel) {
    formData.append('CompressionLevel', compressionLevel);
  }

  if (percentage !== '' && percentage != null) {
    formData.append('Percentage', String(percentage));
  }

  if (targetSize !== '' && targetSize != null) {
    formData.append('TargetSize', String(targetSize));
  }

  const response = await fetch(JPG_TO_COMPRESS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to compress JPG image.');
  const baseName = file.name.replace(/\.(jpe?g)$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.match(/\.jpe?g$/i) ? result.fileName : `${baseName}-compressed.jpg`,
    originalSize: file.size,
  };
}

export async function convertJpgToPng(file) {
  ensureToolUsage('jpg-to-png', 'JPG to PNG');
  if (!file) {
    throw new Error('Please select a JPG image to convert.');
  }

  if (!isJpgFile(file)) {
    throw new Error('Please select a valid .jpg or .jpeg file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(JPG_TO_PNG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert JPG to PNG.');
  const baseName = file.name.replace(/\.(jpe?g)$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.png') ? result.fileName : `${baseName}.png`,
    originalSize: file.size,
  };
}

export async function convertJpgToWebp(file) {
  ensureToolUsage('jpg-to-webp', 'JPG to WebP');
  if (!file) {
    throw new Error('Please select a JPG image to convert.');
  }

  if (!isJpgFile(file)) {
    throw new Error('Please select a valid .jpg or .jpeg file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(JPG_TO_WEBP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert JPG to WebP.');
  const baseName = file.name.replace(/\.(jpe?g)$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.webp') ? result.fileName : `${baseName}.webp`,
    originalSize: file.size,
  };
}

function isPngFile(file) {
  const name = file.name.toLowerCase();
  return file.type === 'image/png' || name.endsWith('.png');
}

export async function convertPngToJpg(file) {
  ensureToolUsage('png-to-jpg', 'PNG to JPG');
  if (!file) {
    throw new Error('Please select a PNG image to convert.');
  }

  if (!isPngFile(file)) {
    throw new Error('Please select a valid .png file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(PNG_TO_JPG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert PNG to JPG.');
  const baseName = file.name.replace(/\.png$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.match(/\.jpe?g$/i) ? result.fileName : `${baseName}.jpg`,
    originalSize: file.size,
  };
}

export async function convertPngToSvg(file) {
  ensureToolUsage('png-to-svg', 'PNG to SVG');
  if (!file) {
    throw new Error('Please select a PNG image to convert.');
  }

  if (!isPngFile(file)) {
    throw new Error('Please select a valid .png file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(PNG_TO_SVG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert PNG to SVG.');
  const baseName = file.name.replace(/\.png$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.svg') ? result.fileName : `${baseName}.svg`,
    originalSize: file.size,
  };
}

function isSvgFile(file) {
  const name = file.name.toLowerCase();
  return file.type === 'image/svg+xml' || name.endsWith('.svg');
}

export async function convertSvgToPng(file) {
  ensureToolUsage('svg-to-png', 'SVG to PNG');
  if (!file) {
    throw new Error('Please select an SVG file to convert.');
  }

  if (!isSvgFile(file)) {
    throw new Error('Please select a valid .svg file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(SVG_TO_PNG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert SVG to PNG.');
  const baseName = file.name.replace(/\.svg$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.png') ? result.fileName : `${baseName}.png`,
    originalSize: file.size,
  };
}

export async function convertPngToWebp(file) {
  ensureToolUsage('png-to-webp', 'PNG to WebP');
  if (!file) {
    throw new Error('Please select a PNG image to convert.');
  }

  if (!isPngFile(file)) {
    throw new Error('Please select a valid .png file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(PNG_TO_WEBP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert PNG to WebP.');
  const baseName = file.name.replace(/\.png$/i, '') || 'image';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.webp') ? result.fileName : `${baseName}.webp`,
    originalSize: file.size,
  };
}

function isGifFile(file) {
  const name = file.name.toLowerCase();
  return file.type === 'image/gif' || name.endsWith('.gif');
}

export async function convertGifToJpg(file, { quality = 90, alphaColor = 'white' } = {}) {
  ensureToolUsage('format-converter', 'Format Converter');
  if (!file) {
    throw new Error('Please select a GIF image to convert.');
  }

  if (!isGifFile(file)) {
    throw new Error('Please select a valid .gif file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  if (quality != null) {
    formData.append('Quality', String(quality));
  }

  if (alphaColor?.trim()) {
    formData.append('AlphaColor', alphaColor.trim());
  }

  const response = await fetch(GIF_TO_JPG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const images = await parseConvertApiFiles(response, 'Failed to convert GIF to JPG.');
  const baseName = file.name.replace(/\.gif$/i, '') || 'image';

  if (images.length === 1) {
    const image = images[0];
    return {
      type: 'single',
      images,
      downloadUrl: image.url,
      downloadFileName: image.fileName.toLowerCase().endsWith('.jpg')
        ? image.fileName
        : `${baseName}.jpg`,
      originalSize: file.size,
    };
  }

  const zip = await zipConvertedFiles(images, JPG_TO_ZIP_URL);

  return {
    type: 'zip',
    images,
    downloadUrl: zip.url,
    downloadFileName: zip.fileName?.endsWith('.zip') ? zip.fileName : `${baseName}-jpg.zip`,
    originalSize: file.size,
  };
}

function isPsdFile(file) {
  const name = file.name.toLowerCase();
  return file.type === 'image/vnd.adobe.photoshop' || file.type === 'application/x-photoshop' || name.endsWith('.psd');
}

export async function convertPsdToJpg(file) {
  ensureToolUsage('psd-to-jpg', 'PSD to JPG');
  if (!file) {
    throw new Error('Please select a PSD file to convert.');
  }

  if (!isPsdFile(file)) {
    throw new Error('Please select a valid .psd file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(PSD_TO_JPG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const images = await parseConvertApiFiles(response, 'Failed to convert PSD to JPG.');
  const baseName = file.name.replace(/\.psd$/i, '') || 'design';

  if (images.length === 1) {
    const image = images[0];
    return {
      type: 'single',
      images,
      downloadUrl: image.url,
      downloadFileName: image.fileName.toLowerCase().endsWith('.jpg')
        ? image.fileName
        : `${baseName}.jpg`,
      originalSize: file.size,
    };
  }

  const zip = await zipConvertedFiles(images, JPG_TO_ZIP_URL);

  return {
    type: 'zip',
    images,
    downloadUrl: zip.url,
    downloadFileName: zip.fileName?.endsWith('.zip') ? zip.fileName : `${baseName}-jpg.zip`,
    originalSize: file.size,
  };
}

export async function convertPdfToDocx(file) {
  ensureToolUsage('pdf-to-word', 'PDF to Word');
  if (!file) {
    throw new Error('Please select a PDF file to convert.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(PDF_TO_DOCX_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert PDF to Word.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.docx') ? result.fileName : `${baseName}.docx`,
    originalSize: file.size,
  };
}

function isExcelFile(file) {
  const name = file.name.toLowerCase();
  const excelTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  return excelTypes.includes(file.type) || name.endsWith('.xlsx') || name.endsWith('.xls');
}

export async function convertXlsxToPdf(file) {
  ensureToolUsage('xlsx-to-pdf', 'XLSX to PDF');
  if (!file) {
    throw new Error('Please select an Excel file to convert.');
  }

  if (!isExcelFile(file)) {
    throw new Error('Please select a valid .xlsx or .xls file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);

  const response = await fetch(XLSX_TO_PDF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert Excel to PDF.');
  const baseName = file.name.replace(/\.(xlsx|xls)$/i, '') || 'spreadsheet';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}.pdf`,
    originalSize: file.size,
  };
}

export async function convertXlsxToPng(file, { pageRange = '', resolution = 300 } = {}) {
  ensureToolUsage('xlsx-to-png', 'XLSX to PNG');
  if (!file) {
    throw new Error('Please select an Excel file to convert.');
  }

  if (!isExcelFile(file)) {
    throw new Error('Please select a valid .xlsx or .xls file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('ImageResolutionH', String(resolution));
  formData.append('ImageResolutionV', String(resolution));
  formData.append('ScaleImage', 'true');

  if (pageRange.trim()) {
    formData.append('PageRange', pageRange.trim());
  }

  const response = await fetch(XLSX_TO_PNG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const images = await parseConvertApiFiles(response, 'Failed to convert Excel to PNG.');
  const baseName = file.name.replace(/\.(xlsx|xls)$/i, '') || 'spreadsheet';

  if (images.length === 1) {
    const image = images[0];
    return {
      type: 'single',
      images,
      downloadUrl: image.url,
      downloadFileName: image.fileName.toLowerCase().endsWith('.png')
        ? image.fileName
        : `${baseName}.png`,
      originalSize: file.size,
    };
  }

  const zip = await zipConvertedFiles(images, PNG_TO_ZIP_URL);

  return {
    type: 'zip',
    images,
    downloadUrl: zip.url,
    downloadFileName: zip.fileName?.endsWith('.zip') ? zip.fileName : `${baseName}-png.zip`,
    originalSize: file.size,
  };
}

function htmlFileFromString(html, fileName = 'document.html') {
  const wrapped = html.trim().toLowerCase().startsWith('<!doctype') || html.trim().toLowerCase().startsWith('<html')
    ? html
    : `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;

  return new File([wrapped], fileName, { type: 'text/html' });
}

export async function convertHtmlToPdf({ html, file, pageSize = 'a4', pageOrientation = 'portrait' }) {
  ensureToolUsage('html-to-pdf', 'HTML to PDF');
  let htmlFile = file;

  if (!htmlFile) {
    if (!html?.trim()) {
      throw new Error('Please enter HTML content or upload an HTML file.');
    }
    htmlFile = htmlFileFromString(html.trim());
  } else {
    const name = file.name.toLowerCase();
    const isHtml = file.type === 'text/html' || name.endsWith('.html') || name.endsWith('.htm');
    if (!isHtml) {
      throw new Error('Please upload a valid .html or .htm file.');
    }
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', htmlFile, htmlFile.name);
  if (pageSize) {
    formData.append('PageSize', pageSize);
  }
  if (pageOrientation) {
    formData.append('PageOrientation', pageOrientation);
  }

  const response = await fetch(HTML_TO_PDF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert HTML to PDF.');
  const baseName = htmlFile.name.replace(/\.(html|htm)$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}.pdf`,
  };
}

export async function convertWebToPdf(url, { pageSize = 'a4', pageOrientation = 'portrait' } = {}) {
  ensureToolUsage('web-to-pdf', 'Web to PDF');
  const trimmed = url?.trim();
  if (!trimmed) {
    throw new Error('Please enter a website URL.');
  }

  let normalizedUrl = trimmed;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    throw new Error('Please enter a valid website URL.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('Url', normalizedUrl);
  if (pageSize) {
    formData.append('PageSize', pageSize);
  }
  if (pageOrientation) {
    formData.append('PageOrientation', pageOrientation);
  }

  const response = await fetch(WEB_TO_PDF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to convert webpage to PDF.');
  let baseName = 'webpage';
  try {
    const hostname = new URL(normalizedUrl).hostname.replace(/^www\./, '');
    baseName = hostname.replace(/[^a-z0-9-]/gi, '-') || 'webpage';
  } catch {
    // keep default
  }

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}.pdf`,
  };
}

export async function convertPdfToJpg(file, { pageRange = '', resolution = 300 } = {}) {
  ensureToolUsage('pdf-to-jpg', 'PDF to JPG');
  return convertPdfToImages(file, {
    convertUrl: PDF_TO_JPG_URL,
    zipUrl: JPG_TO_ZIP_URL,
    errorMessage: 'Failed to convert PDF to JPG.',
    extension: 'jpg',
    zipLabel: 'jpg',
    pageRange,
    resolution,
  });
}

export async function convertPdfToPng(file, { pageRange = '', resolution = 300 } = {}) {
  ensureToolUsage('pdf-to-png', 'PDF to PNG');
  return convertPdfToImages(file, {
    convertUrl: PDF_TO_PNG_URL,
    zipUrl: PNG_TO_ZIP_URL,
    errorMessage: 'Failed to convert PDF to PNG.',
    extension: 'png',
    zipLabel: 'png',
    pageRange,
    resolution,
  });
}

function isPptxFile(file) {
  const name = file.name.toLowerCase();
  return (
    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    || file.type === 'application/vnd.ms-powerpoint'
    || name.endsWith('.pptx')
    || name.endsWith('.ppt')
  );
}

export async function convertPptxToPng(file, { pageRange = '', resolution = 300 } = {}) {
  ensureToolUsage('pptx-to-png', 'PPTX to PNG');
  if (!file) {
    throw new Error('Please select a PowerPoint file to convert.');
  }

  if (!isPptxFile(file)) {
    throw new Error('Please select a valid .pptx or .ppt file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('ImageResolutionH', String(resolution));
  formData.append('ImageResolutionV', String(resolution));
  formData.append('ScaleImage', 'true');

  if (pageRange.trim()) {
    formData.append('PageRange', pageRange.trim());
  }

  const response = await fetch(PPTX_TO_PNG_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const images = await parseConvertApiFiles(response, 'Failed to convert PowerPoint to PNG.');
  const baseName = file.name.replace(/\.(pptx|ppt)$/i, '') || 'presentation';

  if (images.length === 1) {
    const image = images[0];
    return {
      type: 'single',
      images,
      downloadUrl: image.url,
      downloadFileName: image.fileName.toLowerCase().endsWith('.png')
        ? image.fileName
        : `${baseName}.png`,
      originalSize: file.size,
    };
  }

  const zip = await zipConvertedFiles(images, PNG_TO_ZIP_URL);

  return {
    type: 'zip',
    images,
    downloadUrl: zip.url,
    downloadFileName: zip.fileName?.endsWith('.zip') ? zip.fileName : `${baseName}-png.zip`,
    originalSize: file.size,
  };
}

export async function deletePdfPages(file, { pageRange = '', password = '', deleteBlankPages = false } = {}) {
  ensureToolUsage('delete-pdf-pages', 'Delete PDF Pages');
  if (!file) {
    throw new Error('Please select a PDF file.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  if (!pageRange.trim()) {
    throw new Error('Please specify which pages to delete (e.g. 1-3 or 2,5,8).');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('PageRange', pageRange.trim());

  if (password.trim()) {
    formData.append('Password', password.trim());
  }

  if (deleteBlankPages) {
    formData.append('DeleteBlankPages', 'true');
  }

  const response = await fetch(PDF_DELETE_PAGES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to delete PDF pages.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}-edited.pdf`,
    originalSize: file.size,
  };
}

export async function cropPdf(file, {
  pageRange = '',
  password = '',
  cropMode = 'auto',
  measurementUnit = 'in',
  autoStrategy = 'uniform',
  autoPadding = 0,
  pageSize = 'a4',
  pageOrientation = 'default',
  cropWidth = '',
  cropHeight = '',
  anchor = 'center',
  verticalMargin = 1,
  horizontalMargin = 1,
} = {}) {
  ensureToolUsage('crop-pdf', 'Crop PDF');
  if (!file) {
    throw new Error('Please select a PDF file.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('CropMode', cropMode);

  if (pageRange.trim()) {
    formData.append('PageRange', pageRange.trim());
  }

  if (password.trim()) {
    formData.append('Password', password.trim());
  }

  if (measurementUnit) {
    formData.append('MeasurementUnit', measurementUnit);
  }

  if (cropMode === 'auto') {
    formData.append('AutoStrategy', autoStrategy);
    if (autoPadding !== '' && autoPadding != null) {
      formData.append('AutoPadding', String(autoPadding));
    }
  }

  if (cropMode === 'size') {
    formData.append('PageSize', pageSize);
    formData.append('PageOrientation', pageOrientation);
    formData.append('Anchor', anchor);
    if (cropWidth !== '' && cropWidth != null) {
      formData.append('CropWidth', String(cropWidth));
    }
    if (cropHeight !== '' && cropHeight != null) {
      formData.append('CropHeight', String(cropHeight));
    }
  }

  if (cropMode === 'margins') {
    formData.append('VerticalMargin', String(verticalMargin));
    formData.append('HorizontalMargin', String(horizontalMargin));
  }

  const response = await fetch(PDF_CROP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to crop PDF.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}-cropped.pdf`,
    originalSize: file.size,
  };
}

export async function protectPdf(file, {
  userPassword = '',
  ownerPassword = '',
  openPassword = '',
  encryptionAlgorithm = 'Aes256Bit',
  encryptMeta = false,
  printDocument = false,
  modifyContents = false,
  copyContents = false,
  fillFormFields = false,
  modifyAnnotations = false,
} = {}) {
  ensureToolUsage('protect-pdf', 'Protect PDF');
  if (!file) {
    throw new Error('Please select a PDF file.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file.');
  }

  if (!userPassword.trim() && !ownerPassword.trim()) {
    throw new Error('Please enter a user password, owner password, or both.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('EncryptionAlgorithm', encryptionAlgorithm);

  if (userPassword.trim()) {
    formData.append('UserPassword', userPassword.trim());
  }

  if (ownerPassword.trim()) {
    formData.append('OwnerPassword', ownerPassword.trim());
  }

  if (openPassword.trim()) {
    formData.append('Password', openPassword.trim());
  }

  if (encryptMeta) {
    formData.append('EncryptMeta', 'true');
  }

  formData.append('PrintDocument', printDocument ? 'true' : 'false');
  formData.append('ModifyContents', modifyContents ? 'true' : 'false');
  formData.append('CopyContents', copyContents ? 'true' : 'false');
  formData.append('FillFormFields', fillFormFields ? 'true' : 'false');
  formData.append('ModifyAnnotations', modifyAnnotations ? 'true' : 'false');

  const response = await fetch(PDF_PROTECT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to protect PDF.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}-protected.pdf`,
    originalSize: file.size,
  };
}

export async function watermarkPdf(file, overlayFile, {
  pageRange = '',
  overlayPage = 1,
  scale = 100,
  opacity = 50,
  style = 'watermark',
  horizontalAlignment = 'center',
  verticalAlignment = 'center',
} = {}) {
  ensureToolUsage('pdf-watermark', 'PDF Watermark');
  if (!file) {
    throw new Error('Please select the PDF file to watermark.');
  }

  if (!overlayFile) {
    throw new Error('Please select the overlay PDF file.');
  }

  if (file.type !== 'application/pdf' || overlayFile.type !== 'application/pdf') {
    throw new Error('Please select valid PDF files.');
  }

  const formData = new FormData();
  formData.append('StoreFile', 'true');
  formData.append('File', file, file.name);
  formData.append('OverlayFile', overlayFile, overlayFile.name);
  formData.append('OverlayPage', String(overlayPage));
  formData.append('Scale', String(scale));
  formData.append('Opacity', String(opacity));
  formData.append('Style', style);
  formData.append('HorizontalAlignment', horizontalAlignment);
  formData.append('VerticalAlignment', verticalAlignment);

  if (pageRange.trim()) {
    formData.append('PageRange', pageRange.trim());
  }

  const response = await fetch(PDF_WATERMARK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
    },
    body: formData,
  });

  const result = await parseConvertApiResponse(response, 'Failed to apply PDF watermark.');
  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

  return {
    ...result,
    fileName: result.fileName?.endsWith('.pdf') ? result.fileName : `${baseName}-watermarked.pdf`,
    originalSize: file.size,
  };
}

export async function downloadFile(url, fileName) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download file.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadPdf(url, fileName) {
  return downloadFile(url, fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

export async function downloadMergedPdf(url, fileName) {
  return downloadPdf(url, fileName);
}
