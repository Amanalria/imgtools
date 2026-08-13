import React, { useState, useEffect } from 'react';
import { Zap, Download, FileText } from 'lucide-react';

export default function CompressTool({ image, onSaveHistory }) {
  const [quality, setQuality] = useState(70);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);

  useEffect(() => {
    if (image) {
      // Estimate original size from data url length
      const bytes = Math.round((image.src.length * 3) / 4);
      setOriginalSize(bytes);
      compressImage(70);
    }
  }, [image]);

  const compressImage = (qualityVal) => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/jpeg', qualityVal / 100);
      const newBytes = Math.round((dataUrl.length * 3) / 4);
      setCompressedSize(newBytes);
      setCompressedUrl(dataUrl);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Image Compressor', url: dataUrl, name: 'compressed_image.jpg' });
      }
    };
  };

  const handleQualityChange = (e) => {
    const q = parseInt(e.target.value);
    setQuality(q);
    compressImage(q);
  };

  const formatKB = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savedPercent = originalSize ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

  const downloadImage = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Zap size={22} /> Image Compressor
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Original Size</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatKB(originalSize)}
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Compressed Size</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-color)', marginTop: '4px' }}>
            {formatKB(compressedSize)}
          </div>
        </div>

        <div style={{ background: 'var(--accent-light)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600' }}>Space Saved</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--success-color)', marginTop: '4px' }}>
            -{savedPercent}%
          </div>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label>Compression Level: {quality}% Quality</label>
        <input
          type="range"
          min="5"
          max="95"
          value={quality}
          onChange={handleQualityChange}
          className="range-slider"
        />
      </div>

      <div className="preview-container">
        <img src={compressedUrl || image?.src} alt="Compressed Preview" className="preview-image" />
      </div>
    </div>
  );
}
