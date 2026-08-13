import React, { useState, useEffect, useRef } from 'react';
import { Pipette, Copy, Check } from 'lucide-react';

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
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imgData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts = {};

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      const topPalette = sorted.slice(0, 8);
      setPalette(topPalette);
      if (topPalette.length > 0) setSelectedColor(topPalette[0]);
    };
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Pipette size={22} /> Color Picker & Palette Extractor
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', backgroundColor: selectedColor, border: '2px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{selectedColor}</div>
            <button className="btn-secondary" onClick={() => copyToClipboard(selectedColor)} style={{ padding: '4px 10px', marginTop: '6px', fontSize: '0.8rem' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy HEX'}
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Extracted Color Palette:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {palette.map((color, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: selectedColor === color ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  transition: 'transform 0.1s ease'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="preview-container">
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
          style={{ maxWidth: '100%', maxHeight: '440px', cursor: 'crosshair', borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    </div>
  );
}
