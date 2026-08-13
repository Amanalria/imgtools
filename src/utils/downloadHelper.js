/**
 * Robust helper to trigger file downloads across Desktop, Mobile Browsers, & Android WebViews
 */
export function triggerFileDownload(dataUrl, filename) {
  if (!dataUrl) return;

  const safeFilename = filename || `image_${Date.now()}.png`;

  try {
    // If it's a data URL, convert to Blob object for maximum compatibility
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const uInt8Array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 200);
      return;
    }

    // Direct link fallback
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
  } catch (err) {
    console.error('Download trigger error:', err);
    // Ultimate fallback for restricted WebViews
    const win = window.open(dataUrl, '_blank');
    if (!win) {
      alert('To download, please long press the image preview and select Save Image.');
    }
  }
}
