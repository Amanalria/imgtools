import React, { useState, useEffect } from 'react';
import { Info, Download, ShieldCheck } from 'lucide-react';

export default function MetadataTool({ image, onSaveHistory }) {
  const [metadata, setMetadata] = useState(null);
  const [cleanUrl, setCleanUrl] = useState(null);

  useEffect(() => {
    if (image) {
      const bytes = Math.round((image.src.length * 3) / 4);
      setMetadata({
        name: image.name || 'Image_File',
        width: image.width,
        height: image.height,
        megapixels: ((image.width * image.height) / 1000000).toFixed(2),
        sizeKb: (bytes / 1024).toFixed(1),
        sizeMb: (bytes / (1024 * 1024)).toFixed(2),
        aspectRatio: (image.width / image.height).toFixed(2),
        mimeType: image.src.split(';')[0].replace('data:', '') || 'image/png'
      });
      setCleanUrl(image.src);
    }
  }, [image]);

  const stripMetadata = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Re-encode image stripping EXIF header metadata
      const url = canvas.toDataURL('image/png');
      setCleanUrl(url);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'EXIF Metadata Stripper', url, name: 'stripped_clean_image.png' });
      }
    };
  };

  const downloadCleanImage = () => {
    if (!cleanUrl) return;
    const link = document.createElement('a');
    link.download = 'stripped_clean_image.png';
    link.href = cleanUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Info size={22} /> EXIF & Metadata Inspector / Stripper
        </div>
        <button className="btn-primary" onClick={downloadCleanImage}>
          <Download size={18} /> Download Clean
        </button>
      </div>

      {metadata && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dimensions</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '2px' }}>{metadata.width} × {metadata.height} px</div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>File Size</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '2px' }}>{metadata.sizeKb} KB ({metadata.sizeMb} MB)</div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Megapixels</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '2px' }}>{metadata.megapixels} MP</div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MIME Type</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '2px' }}>{metadata.mimeType}</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={stripMetadata}>
          <ShieldCheck size={18} /> Strip All Metadata & Secure Image
        </button>
      </div>

      <div className="preview-container">
        <img src={cleanUrl || image?.src} alt="Cleaned Image Preview" className="preview-image" />
      </div>
    </div>
  );
}
