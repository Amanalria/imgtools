import React, { useState } from 'react';
import { Eraser, Download, RefreshCw } from 'lucide-react';

export default function BgRemoverTool({ image, onSaveHistory }) {
  const [targetColor, setTargetColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(40);
  const [replacedBg, setReplacedBg] = useState('transparent');
  const [processedUrl, setProcessedUrl] = useState(null);

  const processBgRemoval = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Parse target hex color
      const hex = targetColor.replace('#', '');
      const tr = parseInt(hex.substring(0, 2), 16) || 255;
      const tg = parseInt(hex.substring(2, 4), 16) || 255;
      const tb = parseInt(hex.substring(4, 6), 16) || 255;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean distance color diff
        const diff = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
        if (diff < tolerance * 2.5) {
          if (replacedBg === 'transparent') {
            data[i + 3] = 0; // Alpha transparent
          } else {
            // Replaced color
            const rHex = replacedBg.replace('#', '');
            data[i] = parseInt(rHex.substring(0, 2), 16) || 0;
            data[i + 1] = parseInt(rHex.substring(2, 4), 16) || 0;
            data[i + 2] = parseInt(rHex.substring(4, 6), 16) || 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const url = canvas.toDataURL('image/png');
      setProcessedUrl(url);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Background Eraser', url, name: 'bg_removed.png' });
      }
    };
  };

  const downloadImage = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = 'bg_removed.png';
    link.href = processedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Eraser size={22} /> Background Remover & Chroma Keyer
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="control-grid">
        <div className="form-group">
          <label>Target Color to Remove</label>
          <input
            type="color"
            className="form-control"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            style={{ height: '42px', padding: '2px 6px' }}
          />
        </div>

        <div className="form-group">
          <label>Removal Threshold: {tolerance}%</label>
          <input
            type="range"
            min="5"
            max="90"
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            className="range-slider"
          />
        </div>

        <div className="form-group">
          <label>Background Fill</label>
          <select
            className="form-select"
            value={replacedBg}
            onChange={(e) => setReplacedBg(e.target.value)}
          >
            <option value="transparent">Transparent PNG</option>
            <option value="#FFFFFF">White</option>
            <option value="#000000">Black</option>
            <option value="#6366F1">Indigo Accent</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={processBgRemoval}>
          <RefreshCw size={18} /> Remove Background Color
        </button>
      </div>

      <div className="preview-container">
        <img src={processedUrl || image?.src} alt="Bg Removed Preview" className="preview-image" />
      </div>
    </div>
  );
}
