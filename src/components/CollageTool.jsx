import React, { useState } from 'react';
import { LayoutGrid, Download, Plus, Trash2 } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function CollageTool({ onSaveHistory }) {
  const [images, setImages] = useState([]);
  const [gap, setGap] = useState(12);
  const [radius, setRadius] = useState(12);
  const [bgColor, setBgColor] = useState('#0f172a');
  const [layout, setLayout] = useState('2x1');
  const [collageUrl, setCollageUrl] = useState(null);

  const handleMultiUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImages((prev) => [...prev, evt.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateCollage = () => {
    if (images.length === 0) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const totalW = 1200;
    const totalH = 800;
    canvas.width = totalW;
    canvas.height = totalH;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalW, totalH);

    const count = images.length;
    let cols = 2;
    let rows = 1;

    if (layout === '2x2' || count === 4) {
      cols = 2; rows = 2;
    } else if (layout === '3x1' || count === 3) {
      cols = 3; rows = 1;
    } else if (layout === '3x3' || count >= 5) {
      cols = 3; rows = 3;
    }

    const cellW = (totalW - gap * (cols + 1)) / cols;
    const cellH = (totalH - gap * (rows + 1)) / rows;

    let loadedCount = 0;
    images.slice(0, cols * rows).forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const x = gap + col * (cellW + gap);
        const y = gap + row * (cellH + gap);

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, radius);
        ctx.clip();

        const imgRatio = img.width / img.height;
        const cellRatio = cellW / cellH;
        let dw = cellW;
        let dh = cellH;
        let dx = x;
        let dy = y;

        if (imgRatio > cellRatio) {
          dw = cellH * imgRatio;
          dx = x - (dw - cellW) / 2;
        } else {
          dh = cellW / imgRatio;
          dy = y - (dh - cellH) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        loadedCount++;
        if (loadedCount === Math.min(images.length, cols * rows)) {
          const dataUrl = canvas.toDataURL('image/png');
          setCollageUrl(dataUrl);
          if (onSaveHistory) {
            onSaveHistory({ tool: 'Collage Maker', url: dataUrl, name: 'collage.png' });
          }
        }
      };
    });
  };

  const handleDownload = () => {
    generateCollage();
    triggerFileDownload(collageUrl, 'collage.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <LayoutGrid size={24} style={{ color: 'var(--accent-primary)' }} /> Photo Collage & Grid Studio
        </div>
        <button className="btn-glass-primary" onClick={handleDownload} disabled={!collageUrl}>
          <Download size={18} /> Download Collage Grid
        </button>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <label className="btn-glass-secondary" style={{ cursor: 'pointer' }}>
          <Plus size={18} /> Upload Multiple Photos ({images.length} added)
          <input type="file" multiple accept="image/*" onChange={handleMultiUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {images.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <img src={src} alt={`Uploaded ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--glass-border)' }} />
              <button
                onClick={() => removeImage(idx)}
                style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger-color, #ef4444)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Grid Layout Preset</label>
          <select className="glass-select" value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option value="2x1">2 Columns Split (2x1)</option>
            <option value="3x1">3 Columns Split (3x1)</option>
            <option value="2x2">2x2 Grid (4 Photos)</option>
            <option value="3x3">3x3 Grid (9 Photos)</option>
          </select>
        </div>

        <div className="field-box">
          <label className="field-label">Grid Gap: {gap}px</label>
          <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Corner Rounding: {radius}px</label>
          <input type="range" min="0" max="40" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Canvas Background Fill</label>
          <input type="color" className="glass-input" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ height: '44px', padding: '4px' }} />
        </div>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <button className="btn-glass-primary" onClick={generateCollage} disabled={images.length === 0}>
          <LayoutGrid size={18} /> Render Photo Collage
        </button>
      </div>

      <div className="canvas-preview-box">
        {collageUrl ? (
          <img src={collageUrl} alt="Collage Preview" className="preview-rendered-img" />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Upload photos to build a liquid glass photo collage</span>
        )}
      </div>
    </div>
  );
}
