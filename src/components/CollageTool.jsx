import React, { useState } from 'react';
import { LayoutGrid, Download, Plus, Trash2 } from 'lucide-react';

export default function CollageTool({ onSaveHistory }) {
  const [images, setImages] = useState([]);
  const [gap, setGap] = useState(10);
  const [radius, setRadius] = useState(8);
  const [bgColor, setBgColor] = useState('#1e293b');
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

        // Aspect fill draw
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
          const url = canvas.toDataURL('image/png');
          setCollageUrl(url);
          if (onSaveHistory) {
            onSaveHistory({ tool: 'Collage Maker', url, name: 'collage.png' });
          }
        }
      };
    });
  };

  const downloadImage = () => {
    if (!collageUrl) return;
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = collageUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <LayoutGrid size={22} /> Collage & Photo Grid Maker
        </div>
        <button className="btn-primary" onClick={downloadImage} disabled={!collageUrl}>
          <Download size={18} /> Download
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
          <Plus size={18} /> Add Photos ({images.length} added)
          <input type="file" multiple accept="image/*" onChange={handleMultiUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '8px' }}>
          {images.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
              <img src={src} alt={`Uploaded ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
              <button
                onClick={() => removeImage(idx)}
                style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger-color)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="control-grid">
        <div className="form-group">
          <label>Layout Grid</label>
          <select className="form-select" value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option value="2x1">2 Columns (2x1)</option>
            <option value="3x1">3 Columns (3x1)</option>
            <option value="2x2">2x2 Grid (4 Photos)</option>
            <option value="3x3">3x3 Grid (9 Photos)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Grid Spacing: {gap}px</label>
          <input type="range" min="0" max="30" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Corner Radius: {radius}px</label>
          <input type="range" min="0" max="30" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Background Color</label>
          <input type="color" className="form-control" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ height: '42px', padding: '2px 6px' }} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={generateCollage} disabled={images.length === 0}>
          <LayoutGrid size={18} /> Render Photo Collage
        </button>
      </div>

      <div className="preview-container">
        {collageUrl ? (
          <img src={collageUrl} alt="Collage Preview" className="preview-image" />
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>Upload 2 or more photos to build a collage grid</span>
        )}
      </div>
    </div>
  );
}
