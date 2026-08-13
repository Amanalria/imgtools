import React, { useState } from 'react';
import { Eraser, Download, RefreshCw, Layers } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function BgRemoverTool({ image, onSaveHistory }) {
  const [targetColor, setTargetColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(40);
  const [feather, setFeather] = useState(10);
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

      const hex = targetColor.replace('#', '');
      const tr = parseInt(hex.substring(0, 2), 16) || 255;
      const tg = parseInt(hex.substring(2, 4), 16) || 255;
      const tb = parseInt(hex.substring(4, 6), 16) || 255;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
        if (diff < tolerance * 2.5) {
          if (replacedBg === 'transparent') {
            data[i + 3] = 0;
          } else {
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

  const handleDownload = () => {
    processBgRemoval();
    triggerFileDownload(processedUrl || image?.src, 'bg_removed.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Eraser size={24} style={{ color: 'var(--accent-primary)' }} /> Chroma Keyer & Background Eraser
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Transparent PNG
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Target Color to Erase</label>
          <input
            type="color"
            className="glass-input"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            style={{ height: '44px', padding: '4px' }}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Sensitivity Threshold: {tolerance}%</label>
          <input
            type="range"
            min="5"
            max="90"
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        <div className="field-box">
          <label className="field-label">Edge Softening Feather: {feather}px</label>
          <input
            type="range"
            min="0"
            max="30"
            value={feather}
            onChange={(e) => setFeather(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        <div className="field-box">
          <label className="field-label">Background Replacement Fill</label>
          <select className="glass-select" value={replacedBg} onChange={(e) => setReplacedBg(e.target.value)}>
            <option value="transparent">Transparent (PNG Alpha)</option>
            <option value="#FFFFFF">Solid Pure White</option>
            <option value="#000000">Solid Pitch Black</option>
            <option value="#6366F1">Liquid Indigo</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <button className="btn-glass-primary" onClick={processBgRemoval}>
          <RefreshCw size={18} /> Process Background Removal
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={processedUrl || image?.src} alt="Bg Removed Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
