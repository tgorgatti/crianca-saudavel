const MAX_IMAGE_PX = 1600;
const IMAGE_QUALITY = 0.82;
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB hard cap before compression attempt

export interface CompressedFile {
  data: string;
  mime: string;
  originalSize: number;
  compressedSize: number;
}

export async function compressFile(file: File): Promise<CompressedFile> {
  const originalSize = file.size;

  if (!file.type.startsWith('image/')) {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum 4 MB for PDF files.`);
    }
    const data = await readAsDataURL(file);
    return { data, mime: file.type, originalSize, compressedSize: data.length };
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let outW = width;
  let outH = height;
  if (outW > MAX_IMAGE_PX || outH > MAX_IMAGE_PX) {
    const ratio = Math.min(MAX_IMAGE_PX / outW, MAX_IMAGE_PX / outH);
    outW = Math.round(outW * ratio);
    outH = Math.round(outH * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, outW, outH);
  bitmap.close();

  const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const data = canvas.toDataURL(outputMime, IMAGE_QUALITY);
  return { data, mime: outputMime, originalSize, compressedSize: data.length };
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function estimateLocalStorageUsed(): number {
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) ?? '').length * 2;
  }
  return total;
}

export function localStorageUsageMB(): string {
  return (estimateLocalStorageUsed() / 1024 / 1024).toFixed(1);
}
