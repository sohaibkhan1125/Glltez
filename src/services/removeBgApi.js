const REMOVEBG_URL = 'https://api.remove.bg/v1.0/removebg';

function getApiKey() {
  const key = process.env.REACT_APP_REMOVEBG_API_KEY;
  if (!key) {
    throw new Error('REACT_APP_REMOVEBG_API_KEY is not configured. Add it to your .env file.');
  }
  return key;
}

function isSupportedImage(file) {
  const name = file.name.toLowerCase();
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  return supportedTypes.includes(file.type) || supportedExtensions.some((ext) => name.endsWith(ext));
}

async function parseRemoveBgError(response) {
  try {
    const data = await response.json();
    if (data.errors?.length) {
      return data.errors.map((item) => item.title || item.detail).filter(Boolean).join(' ');
    }
    if (data.error?.message) {
      return data.error.message;
    }
    if (typeof data.error === 'string') {
      return data.error;
    }
  } catch {
    // fall through
  }

  return response.statusText || 'Failed to remove background.';
}

export async function removeImageBackground(file, { size = 'auto' } = {}) {
  if (!file) {
    throw new Error('Please select an image to process.');
  }

  if (!isSupportedImage(file)) {
    throw new Error('Please select a valid JPG, PNG, or WebP image.');
  }

  const formData = new FormData();
  formData.append('image_file', file, file.name);
  formData.append('size', size);

  const response = await fetch(REMOVEBG_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': getApiKey(),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseRemoveBgError(response));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const baseName = file.name.replace(/\.[^.]+$/i, '') || 'image';

  return {
    blob,
    url,
    fileName: `${baseName}-no-bg.png`,
    fileSize: blob.size,
  };
}

export function downloadBlobUrl(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
