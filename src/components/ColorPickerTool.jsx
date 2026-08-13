import React, { useState, useEffect, useRef } from 'react';
import { Pipette, Copy, Check, Palette } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function ColorPickerTool({ image }) {
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      extractPalette();
    }
  }, [image]);

  const extractPalette = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 120;
      canvas.height = 120;
      ctx.drawImage(img, 0, 0, 120, 120);

      const imgData = ctx.getImageData(0, 0, 120, 120).data;
      const colorCounts = {};

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      const topPalette = sorted.slice(0, 10);
      setPalette(topPalette);
      if (topPalette.length > 0) setSelectedColor(topPalette[0]);
    };
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
    setSelectedColor(hex);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPaletteSwatch = () => {
    if (palette.length === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 300);

    const swatchW = 800 / palette.length;
    palette.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * swatchW, 0, swatchW, 200);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color, i * swatchW + swatchW / 2, 250);
    });

    triggerFileDownload(canvas.toDataURL('image/png'), 'palette_swatch.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Pipette size={24} style={{ color: 'var(--accent-primary)' }} /> Color Eyedropper & Palette Extractor
        </div>
        <button className="btn-glass-primary" onClick={downloadPaletteSwatch}>
          <Palette size={18} /> Export Palette Swatch PNG
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: 'var(--glass-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', backgroundColor: selectedColor, border: '2px solid var(--glass-border)', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }} />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px' }}>{selectedColor}</div>
            <button className="btn-glass-secondary" onClick={() => copyToClipboard(selectedColor)} style={{ marginTop: '8px' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied to Clipboard!' : 'Copy Hex Code'}
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--glass-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <span className="field-label" style={{ display: 'block', marginBottom: '12px' }}>Auto-Extracted Dominant Color Palette:</span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {palette.map((color, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: selectedColor === color ? '3px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  transform: selectedColor === color ? 'scale(1.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="canvas-preview-box">
        <canvas
          ref={(ref) => {
            canvasRef.current = ref;
            if (ref && image) {
              const img = new Image();
              img.src = image.src;
              img.onload = () => {
                ref.width = img.width;
                ref.height = img.height;
                const ctx = ref.getContext('2d');
                ctx.drawImage(img, 0, 0);
              };
            }
          }}
          onClick={handleCanvasClick}
          style={{ maxWidth: '100%', maxHeight: '460px', cursor: 'crosshair', borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    </div>
  );
}
