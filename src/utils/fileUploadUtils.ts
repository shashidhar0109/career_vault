/**
 * File upload & download helpers for client-side resume files
 */

export interface UploadedResumeResult {
  name: string;
  size: string;
  dataUrl: string;
  type: string;
}

export function readFileAsDataUrl(
  file: File,
  maxSizeMB = 3.5
): Promise<UploadedResumeResult> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      reject(
        new Error(
          `File "${file.name}" is ${sizeInMB.toFixed(
            1
          )}MB. Please select a resume file under ${maxSizeMB}MB to ensure browser storage reliability.`
        )
      );
      return;
    }

    const sizeFormatted =
      file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${sizeInMB.toFixed(1)} MB`;

    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        size: sizeFormatted,
        dataUrl: reader.result as string,
        type: file.type || 'application/octet-stream',
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk.'));
    };

    reader.readAsDataURL(file);
  });
}

export function downloadBase64File(dataUrl: string, fileName: string): void {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to trigger download:', err);
    window.open(dataUrl, '_blank');
  }
}

export function previewBase64File(dataUrl: string, fileName: string): void {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const previewWin = window.open(blobUrl, '_blank');
    if (!previewWin) {
      // If popup blocker triggers, fallback to download
      downloadBase64File(dataUrl, fileName);
    }
  } catch (err) {
    console.error('Failed to preview file:', err);
    downloadBase64File(dataUrl, fileName);
  }
}
