import React, { useState, useEffect } from 'react';
import { Zap, Download, SlidersHorizontal } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function CompressTool({ image, onSaveHistory }) {
  const [quality, setQuality] = useState(70);
  const [maxKbTarget, setMaxKbTarget] = useState(500);
  const [useTargetKb, setUseTargetKb] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);

  useEffect(() => {
    if (image) {
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

  const handleQualityChange = (q) => {
    setQuality(q);
    compressImage(q);
  };

  const formatKB = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savedPercent = originalSize ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

  const handleDownload = () => {
    compressImage(quality);
    triggerFileDownload(compressedUrl || image?.src, 'compressed_image.jpg');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Zap size={24} style={{ color: 'var(--accent-primary)' }} /> Intelligent Image Compressor
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Compressed
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--glass-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Original Size</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>{formatKB(originalSize)}</div>
        </div>

        <div style={{ background: 'var(--glass-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Compressed Size</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '4px' }}>{formatKB(compressedSize)}</div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>Space Savings</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>-{savedPercent}% Saved</div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="field-box" style={{ gridColumn: '1 / -1' }}>
          <label className="field-label">Quality Level Slider: {quality}%</label>
          <input
            type="range"
            min="5"
            max="95"
            value={quality}
            onChange={(e) => handleQualityChange(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>
      </div>

      <div className="canvas-preview-box">
        <img src={compressedUrl || image?.src} alt="Compressed Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
