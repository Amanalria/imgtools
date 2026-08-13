/**
 * Helper to reliably trigger file downloads across Desktop, Web, & Mobile WebViews
 */
export function triggerFileDownload(dataUrl, filename) {
  if (!dataUrl) return;

  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename || 'downloaded_image.png';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (err) {
    console.error('Download error:', err);
    // Fallback: open in new tab
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${dataUrl}" style="max-width:100%"/>`);
    }
  }
}
