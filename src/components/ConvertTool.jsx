import React, { useState } from 'react';
import { RefreshCw, Download, Layers } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function ConvertTool({ image, onSaveHistory }) {
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(92);
  const [bgFill, setBgFill] = useState('#FFFFFF');
  const [convertedUrl, setConvertedUrl] = useState(null);

  const formatExt = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/bmp': 'bmp'
  };

  const convertImage = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = bgFill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(targetFormat, quality / 100);
      setConvertedUrl(dataUrl);

      const ext = formatExt[targetFormat] || 'png';
      if (onSaveHistory) {
        onSaveHistory({ tool: 'Format Converter', url: dataUrl, name: `converted_image.${ext}` });
      }
    };
  };

  const handleDownload = () => {
    convertImage();
    const ext = formatExt[targetFormat] || 'png';
    triggerFileDownload(convertedUrl || image?.src, `converted_image.${ext}`);
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <RefreshCw size={24} style={{ color: 'var(--accent-primary)' }} /> Format Converter & Quality Optimizer
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Converted File
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Target Format</label>
          <select className="glass-select" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
            <option value="image/webp">WEBP (Modern Lightweight Web Standard)</option>
            <option value="image/png">PNG (Lossless High Quality + Transparency)</option>
            <option value="image/jpeg">JPEG / JPG (Universal Photo Format)</option>
            <option value="image/bmp">BMP (Raw Bitmap Graphics)</option>
          </select>
        </div>

        <div className="field-box">
          <label className="field-label">Quality Compression Level: {quality}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        {targetFormat === 'image/jpeg' && (
          <div className="field-box">
            <label className="field-label">Alpha Background Fill</label>
            <input
              type="color"
              className="glass-input"
              value={bgFill}
              onChange={(e) => setBgFill(e.target.value)}
              style={{ height: '44px', padding: '4px' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '22px' }}>
        <button className="btn-glass-primary" onClick={convertImage}>
          <RefreshCw size={18} /> Convert Format
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={convertedUrl || image?.src} alt="Converted Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
