import React, { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';

export default function ConvertTool({ image, onSaveHistory }) {
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(90);
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
        ctx.fillStyle = '#ffffff';
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

  const downloadImage = () => {
    if (!convertedUrl) return;
    const ext = formatExt[targetFormat] || 'png';
    const link = document.createElement('a');
    link.download = `converted_image.${ext}`;
    link.href = convertedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <RefreshCw size={22} /> Image Format Converter
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="control-grid">
        <div className="form-group">
          <label>Target Format</label>
          <select
            className="form-select"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
          >
            <option value="image/webp">WEBP (Modern & Lightweight)</option>
            <option value="image/png">PNG (Lossless & Transparent)</option>
            <option value="image/jpeg">JPEG / JPG (Universal Standard)</option>
            <option value="image/bmp">BMP (Bitmap Standard)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Output Quality: {quality}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="range-slider"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={convertImage}>
          <RefreshCw size={18} /> Convert Image Format
        </button>
      </div>

      <div className="preview-container">
        <img src={convertedUrl || image?.src} alt="Converted Preview" className="preview-image" />
      </div>
    </div>
  );
}
