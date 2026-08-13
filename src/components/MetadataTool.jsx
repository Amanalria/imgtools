import React, { useState, useEffect } from 'react';
import { Info, Download, ShieldCheck, FileCheck } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

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

      const dataUrl = canvas.toDataURL('image/png');
      setCleanUrl(dataUrl);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'EXIF Metadata Stripper', url: dataUrl, name: 'stripped_clean_image.png' });
      }
    };
  };

  const handleDownload = () => {
    stripMetadata();
    triggerFileDownload(cleanUrl || image?.src, 'stripped_clean_image.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Info size={24} style={{ color: 'var(--accent-primary)' }} /> EXIF Metadata & Privacy Stripper
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Clean Privacy File
        </button>
      </div>

      {metadata && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--glass-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span className="field-label">Resolution</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>{metadata.width} × {metadata.height} px</div>
          </div>

          <div style={{ background: 'var(--glass-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span className="field-label">File Size</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>{metadata.sizeKb} KB ({metadata.sizeMb} MB)</div>
          </div>

          <div style={{ background: 'var(--glass-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span className="field-label">Megapixels</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>{metadata.megapixels} MP</div>
          </div>

          <div style={{ background: 'var(--glass-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span className="field-label">MIME Format</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px' }}>{metadata.mimeType}</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '22px' }}>
        <button className="btn-glass-primary" onClick={stripMetadata}>
          <ShieldCheck size={18} /> Strip GPS, Camera & Location Data
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={cleanUrl || image?.src} alt="Cleaned Image Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
